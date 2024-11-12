const { query } = require('../config/db');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { nama, email, kata_sandi, informasi_pribadi, role } = req.body;

  try {
    if (!nama || !email || !kata_sandi || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await query('CALL RegisterUser($1, $2, $3, $4, $5);', [nama, email, kata_sandi, informasi_pribadi, role]);

    res.status(200).json({
      message: 'User registered successfully',
      data: { nama, email, role }
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

const loginUser = async (req, res) => {
  const { email, kata_sandi, role } = req.body;

  try {
    if (!email || !kata_sandi || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const result = await query('CALL LoginUser($1, $2, $3, $4, $5, $6);', [role, email, kata_sandi, null, null, null]);

    const { user_id, user_name, user_role } = result.rows[0];

    if (!user_id) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Menyimpan penerima_id atau admin_id dalam token, tergantung pada role
    let tokenPayload;
    if (user_role === 'penerima_manfaat') {
      tokenPayload = { penerima_id: user_id, role: user_role };
    } else {
      tokenPayload = { admin_id: user_id, role: user_role };
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { user_id, user_name, user_role, email }
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { registerUser, loginUser };
