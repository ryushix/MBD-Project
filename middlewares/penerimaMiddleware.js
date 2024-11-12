const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET;

const penerimaMiddleware = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token not found, access denied!' });
    }

    // Verifikasi token menggunakan async/await
    const user = await jwt.verify(token, JWT_SECRET);
    
    // Ambil penerima_id dari token
    const { penerima_id } = user;
    if (!penerima_id) {
      return res.status(403).json({ error: 'Access Denied!' });
    }

    // Verifikasi penerima_id di database menggunakan prosedur PenerimaLihatDataDiri
    await query('CALL PenerimaLihatDataDiri($1)', [penerima_id]);

    // Simpan penerima_id ke request agar bisa digunakan di controller
    req.penerima_id = penerima_id;
    next();  // Lanjut ke controller
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token telah kedaluwarsa' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token tidak valid, akses ditolak' });
    }
    console.error('Error in penerimaMiddleware:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

module.exports = penerimaMiddleware;
