const { query } = require('../config/db');

const adminMiddleware = async (req, res, next) => {
  try {
    // Mengambil admin_id dari token yang sudah diverifikasi di authenticateToken
    const { admin_id } = req.user; // pastikan req.user sudah diisi oleh authenticateToken

    // Menjalankan prosedur LihatAdmin untuk memverifikasi admin
    const result = await query('CALL LihatAdmin($1);', [admin_id]);

    // Jika tidak ada hasil dari prosedur, anggap admin tidak ditemukan
    if (!result) {
      return res.status(403).json({ error: 'access denied.' });
    }

    // Jika admin ditemukan, lanjut ke middleware atau route berikutnya
    next();
  } catch (error) {
    console.error('Error in adminMiddleware:', error.message);
    res.status(500).json({ error: 'access denied.' });
  }
};

module.exports = adminMiddleware;
