const pool = require('../config/db');

const requestAssistance = async (req, res) => {
    const { penerima_id, keluhan } = req.body;

    try {
        await pool.query('CALL requestAssistance(?, ?)', [penerima_id, keluhan]);
        return res.status(200).json({
            message: 'Permintaan bantuan berhasil diajukan.'
        });
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message || 'Terjadi kesalahan saat memproses permintaan bantuan.'
        });
    }
};

const getRequestStatus = async (req, res) => {
    const { email } = req.user;

    try {
        const [rows] = await pool.query('CALL getRequestStatus(?)', [email]);

        if (rows[0].length === 0) {
            return res.status(404).json({
                message: 'Tidak ada data permintaan bantuan ditemukan untuk email ini.'
            });
        }

        return res.status(200).json({
            message: 'Data permintaan bantuan berhasil diambil.',
            data: rows[0]
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { requestAssistance, getRequestStatus };
