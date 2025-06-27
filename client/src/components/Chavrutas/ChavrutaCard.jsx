import { chavrutaStatus } from '../formatHelpers';
import "../../css/ChavrutaCard.css";
import React, { useState } from 'react';
const ChavrutaCard = ({ chavruta, users, currentUserId, editable = false, onUpdateNote }) => {
  const user1 =chavruta.user1 ? chavruta.user1: null;
  const user2 = chavruta.user2 ? chavruta.user2 : null;

  const [noteUser1, setNoteUser1] = useState(chavruta.notesUser1 || '');
  const [noteUser2, setNoteUser2] = useState(chavruta.notesUser2 || '');

  const handleSave = (userField, value) => {
    if (onUpdateNote) {
      onUpdateNote(chavruta.chavrutaId, userField, value);
    }
  };
// ...existing code...
  return (
    <div className={`chavruta-card ${chavruta.status}`}>
      <h3>👥 {user1?.name} & {user2?.name}</h3>
      <p><strong>סטטוס:</strong> {chavrutaStatus[chavruta.status]}</p>

      {/* פרטי משתמשים */}
      <div className="users-details">
        <div>
          <h4>🧑 {user1?.name}</h4>
          <p>טלפון: {user1?.phone}</p>
          <p>מייל: {user1?.gmail}</p>
          <p>גיל: {user1?.age}</p>
          <p>מגזר: {user1?.sector}</p>
          <p>שפות: {user1?.languages}</p>
        </div>
        <div>
          <h4>🧑 {user2?.name}</h4>
          <p>טלפון: {user2?.phone}</p>
          <p>מייל: {user2?.gmail}</p>
          <p>גיל: {user2?.age}</p>
          <p>מגזר: {user2?.sector}</p>
          <p>שפות: {user2?.languages}</p>
        </div>
      </div>

      {/* נתונים מהקריאה */}
      {chavruta.call && (
        <div className="call-details">
          <h4>פרטי קריאה</h4>
          <p><strong>מיקום:</strong> {chavruta.call.place}</p>
          <p><strong>נושא:</strong> {chavruta.call.subject}</p>
          <p><strong>חומרים:</strong> {chavruta.call.material}</p>
        </div>
      )}

      {/* נתונים מהחברותא */}
      <p className="date">📅 התחיל ב: {new Date(chavruta.startedAt).toLocaleDateString('he-IL')}</p>
      {/* כאן תוכל להוסיף עוד שדות מהחברותא, לדוג' הערות, סטטוס וכו' */}

      {/* הערות */}
      {chavruta.status === 'ended' && (
        <>
          {chavruta.notesUser1 && <p><strong>הערה מ-{user1?.name}:</strong> {chavruta.notesUser1}</p>}
          {chavruta.notesUser2 && <p><strong>הערה מ-{user2?.name}:</strong> {chavruta.notesUser2}</p>}
        </>
      )}
    </div>
  );
// ...existing code...
//   return (
//     <div className={`chavruta-card ${chavruta.status}`}>
//       <h3>👥 {user1?.name} & {user2?.name}</h3>
//       <p><strong>סטטוס:</strong> {chavrutaStatus[chavruta.status]}</p>

//       {/* הערה ממשתמש 1 */}
//       {currentUserId === user1?.userId && editable &&(
//         <div>
//           <label>הערה מ-{user1.name}:</label>
//           <textarea
//             value={noteUser1}
//             onChange={(e) => setNoteUser1(e.target.value)}
//             onBlur={() => handleSave('notesUser1', noteUser1)}
//           />
//         </div>
//       ) }

//       {/* הערה ממשתמש 2 */}
//       {currentUserId === user2?.userId && editable &&(
//         <div>
//           <label>הערה מ-{user2.name}:</label>
//           <textarea
//             value={noteUser2}
//             onChange={(e) => setNoteUser2(e.target.value)}
//             onBlur={() => handleSave('notesUser2', noteUser2)}
//           />
//         </div>
//       )}

//       {chavruta.status === 'ended' && (
//   <>
//     {chavruta.notesUser1 && <p><strong>הערה מ-{user1.name}:</strong> {chavruta.notesUser1}</p>}
//     {chavruta.notesUser2 && <p><strong>הערה מ-{user2.name}:</strong> {chavruta.notesUser2}</p>}
//   </>
// )}
//       <p className="date">📅 התחיל ב: {new Date(chavruta.startedAt).toLocaleDateString('he-IL')}</p>
//     </div>
//   );
};

export default ChavrutaCard;