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

const getAllRequests = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL getAllRequests()');

        return res.status(200).json({
            message: 'Data permintaan bantuan berhasil diambil.',
            data: rows[0]
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const updateRequestStatus = async (req, res) => {
    const { permintaan_id, status_permohonan } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status_permohonan)) {
        return res.status(400).json({ message: 'Status permohonan tidak valid.' });
    }

    try {
        await pool.query('CALL updateRequestStatus(?, ?)', [permintaan_id, status_permohonan]);

        return res.status(200).json({
            message: 'Status permintaan bantuan berhasil diperbarui.'
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const addDonationProgram = async (req, res) => {
    const { penerima_id, nama_program, deskripsi_program, tanggal_mulai, tanggal_berakhir } = req.body;

    try {
        await pool.query('CALL addDonationProgram(?, ?, ?, ?, ?)', [
            penerima_id, 
            nama_program, 
            deskripsi_program, 
            tanggal_mulai, 
            tanggal_berakhir
        ]);

        return res.status(200).json({
            message: 'Program donasi berhasil ditambahkan.'
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getDonation = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL getDonation()');
        return res.status(200).json({
            message: 'Data donasi berhasil diambil.',
            data: rows[0]
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const updateDonationStatus = async (req, res) => {
    const { donation_id, status } = req.body;

    // Validasi status
    if (!['success', 'refund'].includes(status)) {
        return res.status(400).json({ message: 'Status donasi tidak valid.' });
    }

    try {
        await pool.query('CALL updateDonationStatus(?, ?)', [donation_id, status]);
        return res.status(200).json({
            message: 'Status donasi berhasil diperbarui.',
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = { 
    getUsers, 
    searchUsersByName, 
    editUser, 
    deleteUser, 
    getAllRequests, 
    updateRequestStatus, 
    addDonationProgram,
    getDonation,
    updateDonationStatus
};