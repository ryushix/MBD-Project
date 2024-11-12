const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const adminMiddleware = async (req, res, next) => {
  // Ambil token dari header Authorization
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verifikasi token JWT
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan informasi pengguna dari token ke request
    req.user = user;

    // Mengambil admin_id dari token yang sudah diverifikasi
    const { admin_id } = req.user;

    // Jalankan prosedur LihatAdmin untuk memverifikasi admin
    const result = await query('CALL LihatAdmin($1);', [admin_id]);

    // Jika tidak ada hasil dari prosedur, anggap admin tidak ditemukan
    if (!result) {
      return res.status(403).json({ error: 'Access denied, only admins are allowed' });
    }

    // Jika admin ditemukan, lanjut ke middleware atau route berikutnya
    next();
  } catch (error) {
    console.error('Error in adminMiddleware:', error.message);
    res.status(403).json({ error: 'Access denied, only admins are allowed' });
  }
};

module.exports = adminMiddleware;
