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
const middlewareAdmin = require('../middlewares/adminMiddleware');

// Rute untuk melihat dan mengelola Donatur
router.get('/donatur', middlewareAdmin, lihatDonatur);
router.put('/donatur', middlewareAdmin, perbaruiDonatur);
router.delete('/donatur/:donatur_id', middlewareAdmin, hapusDonatur);

// Rute untuk melihat dan mengelola Penerima Manfaat
router.get('/penerima', middlewareAdmin, lihatPenerimaManfaat);
router.put('/penerima', middlewareAdmin, perbaruiPenerimaManfaat);
router.delete('/penerima/:penerima_id', middlewareAdmin, hapusPenerimaManfaat);

module.exports = router;
