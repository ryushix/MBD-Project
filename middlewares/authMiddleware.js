const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.authToken;
            if (!token) {
                return res.status(401).json({ message: 'token tidak ditemukan.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            const [rows] = await pool.query('CALL getUserRole(?)', [decoded.email]);
            const userRole = rows[0][0]?.role;

            if (!userRole || (requiredRoles.length > 0 && !requiredRoles.includes(userRole))) {
                return res.status(403).json({ message: 'anda tidak memiliki akses ke resource ini.' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'token tidak valid atau telah kedaluwarsa.' });
        }
    };
};

module.exports = authMiddleware;
