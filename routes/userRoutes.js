const express = require('express');
const { registerUser, loginUser, logoutUser, getPersonalData, getDonationPrograms, getTotalDonationProgram } = require('../controllers/usersController');
const { getUsers, searchUsersByName, editUser, deleteUser, getAllRequests, updateRequestStatus, addDonationProgram } = require('../controllers/adminController');
const { getPenerimaManfaatById, donate } = require('../controllers/donaturController');
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
router.get('/admin/get-users', authMiddleware(['admin']), getUsers);
router.get('/admin/search-users', authMiddleware(['admin']), searchUsersByName);
router.put('/admin/edit-user', authMiddleware(['admin']), editUser);
router.delete('/admin/delete-user', authMiddleware(['admin']), deleteUser);
router.get('/admin/all-requests', authMiddleware(['admin']), getAllRequests);
router.put('/admin/update-request-status', authMiddleware(['admin']), updateRequestStatus);
router.post('/admin/add-donation-program', authMiddleware(['admin']), addDonationProgram);

// Hanya Donatur
router.get('/donatur/get-penerima/:penerima_id', authMiddleware(['donatur']), getPenerimaManfaatById);
router.post('/donatur/donate', authMiddleware(['donatur']), donate);

// Hanya Penerima Manfaat
router.post('/penerima-manfaat/request-assistance', authMiddleware(['penerima_manfaat']), requestAssistance);
router.get('/penerima-manfaat/request-status', authMiddleware(['penerima_manfaat']), getRequestStatus);

module.exports = router;
