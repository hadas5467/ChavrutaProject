import db from '../dataServices/DB.js';

// בדיקת האם המשתמש הוא הבעלים של משאב כלשהו בטבלה מסוימת
function authorizeOwner({ tableName, idField = 'id', ownerFields = ['userId'], paramName = 'id' }) {
  return async (req, res, next) => {
    const resourceId = parseInt(req.params[paramName]);
    const userId = req.user?.id;

    if (isNaN(resourceId) || !userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {
      const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE ${idField} = ?`, [resourceId]);

      // אם אין תוצאה או שהמשתמש לא אחד הבעלים — דחייה
      if (rows.length === 0) {
        console.warn(`[authorizeOwner] No record found in ${tableName} with ${idField}=${resourceId}`);
        return res.status(403).json({ error: 'Access denied' });
      }

      const record = rows[0];
      const isOwner = ownerFields.some(field => record[field] === userId);

      if (!isOwner) {
        console.warn(`[authorizeOwner] User ${userId} is not owner of ${tableName} ${resourceId}`);
        return res.status(403).json({ error: 'Access denied' });
      }

      req[tableName.toLowerCase()] = record; // שמירה להמשך שרשרת
      next();
    } catch (err) {
      console.error(`[authorizeOwner] DB error:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// בדיקה אם המשתמש הוא מנהל
function authorizeAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}

// בדיקה אם המשתמש הוא הבעלים או מנהל
function authorizeOwnerOrAdmin({ tableName, idField = 'id', ownerFields = ['userId'], paramName = 'id' }) {
  return async (req, res, next) => {
    if (req.user?.role === 'admin') {
      return next();
    }

    // אם לא מנהל, בדוק בעלות רגילה
    return authorizeOwner({ tableName, idField, ownerFields, paramName })(req, res, next);
  };
}

export { authorizeAdmin, authorizeOwner, authorizeOwnerOrAdmin };
