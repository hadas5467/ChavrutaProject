import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRETKEY ?? "SECRETKEY"

const generateToken = (user) => {
    const payload = {
        id: user.id,
        sex: user.sex,
        name: user.name,
        role: user.role
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

function verifyToken(req, res, next) {
    console.log("verifyToken called");
//  const token = req.header('Authorization')?.split(' ')[1];   
 const token =req.cookies.token;
 if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "בעיה בשרת" });
}
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = {
            id: decoded.id,
            sex: decoded.sex,
            name: decoded.name,
            role: decoded.role
        };
        console.log("decoded.role:", decoded.role);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export { verifyToken, generateToken }