const express = require('express');
const router = express.Router();
const { buatPermintaanBantuan, lihatStatusPermintaanBantuan } = require('../controllers/penerimaController');

// Rute untuk membuat permintaan bantuan hanya bagi penerima manfaat
router.post('/permintaan-bantuan', buatPermintaanBantuan);

// Rute untuk melihat status permintaan bantuan hanya bagi penerima manfaat
router.get('/status-permintaan', lihatStatusPermintaanBantuan);

module.exports = router;