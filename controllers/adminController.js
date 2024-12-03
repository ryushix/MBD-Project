const pool = require('../config/db');

const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL getUsers()');
        return res.status(200).json({
            message: 'Data pengguna berhasil diambil.',
            data: rows[0]
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const searchUsersByName = async (req, res) => {
    const { nama } = req.query;

    try {
        const [rows] = await pool.query('CALL searchUsersByName(?)', [nama]);
        return res.status(200).json({
            message: 'Data pengguna berhasil ditemukan.',
            data: rows[0]
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const editUser = async (req, res) => {
    const { user_id, nama, informasi_pribadi } = req.body;

    try {
        await pool.query('CALL editUser(?, ?, ?)', [user_id, nama, informasi_pribadi]);
        return res.status(200).json({
            message: 'Data pengguna berhasil diperbarui.'
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { user_id } = req.body;

    try {
        await pool.query('CALL deleteUser(?)', [user_id]);
        return res.status(200).json({
            message: 'Data pengguna berhasil dihapus.'
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { getUsers, searchUsersByName, editUser, deleteUser };
