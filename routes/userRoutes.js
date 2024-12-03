const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { getUsers, editUser, deleteUser, searchUsersByName } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.post('/login', loginUser);

// Hanya Admin
router.get('/admin/get-users', authMiddleware(['admin']), getUsers);
router.get('/admin/search-users', authMiddleware(['admin']), searchUsersByName);
router.put('/admin/edit-user', authMiddleware(['admin']), editUser);
router.delete('/admin/delete-user', authMiddleware(['admin']), deleteUser);

router.get('/donatur', authMiddleware(['donatur']), (req, res) => {
    res.status(200).json({ message: 'halo donatur!' });
});

router.get('/penerima-manfaat', authMiddleware(['penerima_manfaat']), (req, res) => {
    res.status(200).json({ message: 'halo penerima manfaat!' });
});

module.exports = router;
