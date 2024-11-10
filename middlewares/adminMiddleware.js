const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Middleware untuk memastikan hanya Admin yang dapat mengakses rute ini
const middlewareAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Menyimpan informasi pengguna yang sudah terverifikasi
    
    // Verifikasi apakah user adalah Admin
    const result = await query('SELECT * FROM Admin WHERE admin_id = $1', [req.user.admin_id]);

    if (!result.rows.length) {
      return res.status(403).json({ error: 'Access denied, not an admin' });
    }
    
    next(); // Admin terverifikasi, lanjutkan ke rute berikutnya
  } catch (err) {
    console.error('Error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = middlewareAdmin;
