const express = require('express');
const { registerUser, loginUser, logoutUser, getPersonalData, getDonationPrograms, getTotalDonationProgram } = require('../controllers/usersController');
const { getUsers, searchUsersByName, editUser, deleteUser, getAllRequests, updateRequestStatus, addDonationProgram, getDonation, updateDonationStatus } = require('../controllers/adminController');
const { getPenerimaManfaatById, donate, getTotalDonationDonatur, getDonationHistory } = require('../controllers/donaturController');
const { requestAssistance, getRequestStatus } = require('../controllers/penerimaController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.post('/login', loginUser);
router.get('/personal-data', authMiddleware(['admin', 'donatur', 'penerima_manfaat']), getPersonalData);
router.get('/donation-programs', authMiddleware(['admin', 'donatur', 'penerima_manfaat']), getDonationPrograms);
router.get('/total-donation-program/:program_id', authMiddleware(['admin', 'donatur', 'penerima_manfaat']), getTotalDonationProgram);

// Hanya Admin
router.get('/admin/users', authMiddleware(['admin']), getUsers);
router.get('/admin/search', authMiddleware(['admin']), searchUsersByName);
router.put('/admin/user', authMiddleware(['admin']), editUser);
router.delete('/admin/user', authMiddleware(['admin']), deleteUser);
router.get('/admin/all-requests', authMiddleware(['admin']), getAllRequests);
router.put('/admin/request-status', authMiddleware(['admin']), updateRequestStatus);
router.post('/admin/donation-program', authMiddleware(['admin']), addDonationProgram);
router.get('/admin/donation', authMiddleware(['admin']), getDonation);
router.put('/admin/donation-status', authMiddleware(['admin']), updateDonationStatus);

// Hanya Donatur
router.get('/donatur/check-recipient/:penerima_id', authMiddleware(['donatur']), getPenerimaManfaatById);
router.post('/donatur/donate', authMiddleware(['donatur']), donate);
router.get('/donatur/total-donate', authMiddleware(['donatur']), getTotalDonationDonatur);
router.get('/donatur/donation-history', authMiddleware(['donatur']), getDonationHistory);

// Hanya Penerima Manfaat
router.post('/penerima-manfaat/request-assistance', authMiddleware(['penerima_manfaat']), requestAssistance);
router.get('/penerima-manfaat/request-status', authMiddleware(['penerima_manfaat']), getRequestStatus);

module.exports = router;
