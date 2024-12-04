const express = require('express');
const { registerUser, loginUser, logoutUser, getPersonalData } = require('../controllers/usersController');
const { getUsers, searchUsersByName, editUser, deleteUser, getAllRequests, updateRequestStatus } = require('../controllers/adminController');
const { requestAssistance, getRequestStatus } = require('../controllers/penerimaController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.post('/login', loginUser);
router.get('/get-personal-data', authMiddleware(['admin', 'donatur', 'penerima_manfaat']), getPersonalData);

// Hanya Admin
router.get('/admin/get-users', authMiddleware(['admin']), getUsers);
router.get('/admin/search-users', authMiddleware(['admin']), searchUsersByName);
router.put('/admin/edit-user', authMiddleware(['admin']), editUser);
router.delete('/admin/delete-user', authMiddleware(['admin']), deleteUser);
router.get('/admin/all-requests', authMiddleware(['admin']), getAllRequests);
router.put('/admin/update-request-status', authMiddleware(['admin']), updateRequestStatus);

router.get('/donatur', authMiddleware(['donatur']), (req, res) => {
    res.status(200).json({ message: 'halo donatur!' });
});

// Hanya Penerima Manfaat
router.post('/penerima-manfaat/request-assistance', authMiddleware(['penerima_manfaat']), requestAssistance);
router.get('/penerima-manfaat/request-status', authMiddleware(['penerima_manfaat']), getRequestStatus);

module.exports = router;
