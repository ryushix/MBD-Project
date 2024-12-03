const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const registerUser = async (req, res) => {
    const { nama, email, kata_sandi, informasi_pribadi, role } = req.body;

    try {
        const [rows] = await pool.query('CALL registerUser(?, ?, ?, ?, ?)', [
            nama,
            email,
            kata_sandi,
            informasi_pribadi,
            role
        ]);

        if (rows[0][0].message) {
            return res.status(201).json({ message: rows[0][0].message });
        }

        return res.status(400).json({ message: 'Terjadi kesalahan saat registrasi.' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, kata_sandi } = req.body;

    try {
        const [rows] = await pool.query('CALL loginUser(?, ?)', [email, kata_sandi]);

        if (rows[0][0].message) {
            const user = {
                nama: rows[0][0].nama,
                email: rows[0][0].email,
                role: rows[0][0].role
            };

            const token = jwt.sign(
                { email: user.email, role: user.role},
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('authToken', token, {
                maxAge: 3600000
            });

            return res.status(200).json({
                message: rows[0][0].message,
                user
            });
        }

        return res.status(400).json({ message: 'login gagal.' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('authToken');
    return res.status(200).json({ message: 'logout berhasil.' });
};

module.exports = { registerUser, loginUser, logoutUser };