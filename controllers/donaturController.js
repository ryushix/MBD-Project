const pool = require('../config/db');

const getPenerimaManfaatById = async (req, res) => {
    const { penerima_id } = req.params;

    try {
        const [rows] = await pool.query('CALL getRecipientInfo(?)', [penerima_id]);
        if (rows[0].length === 0) {
            return res.status(404).json({
                message: 'Data penerima manfaat tidak ditemukan.'
            });
        }
        return res.status(200).json({
            message: 'Data penerima manfaat berhasil diambil.',
            data: rows[0][0]
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const donate = async (req, res) => {
    const { donatur_id, program_id, jumlah_donasi } = req.body;
    try {
        await pool.query('CALL donate(?, ?, ?)', [donatur_id, program_id, jumlah_donasi]);

        return res.status(200).json({
            message: 'Donasi berhasil dilakukan.',
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { getPenerimaManfaatById, donate };
