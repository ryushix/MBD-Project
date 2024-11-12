const express = require('express');
const router = express.Router();
const { 
  lihatDonatur,
  lihatPenerimaManfaat,
  perbaruiPenerimaManfaat,
  hapusPenerimaManfaat,
  perbaruiDonatur,
  hapusDonatur 
} = require('../controllers/userController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rute untuk melihat dan mengelola Donatur
router.get('/donatur', adminMiddleware, lihatDonatur);
router.put('/donatur', adminMiddleware, perbaruiDonatur);
router.delete('/donatur/:donatur_id', adminMiddleware, hapusDonatur);

// Rute untuk melihat dan mengelola Penerima Manfaat
router.get('/penerima', adminMiddleware, lihatPenerimaManfaat);
router.put('/penerima', adminMiddleware, perbaruiPenerimaManfaat);
router.delete('/penerima/:penerima_id', adminMiddleware, hapusPenerimaManfaat);

module.exports = router;
