const { query } = require('../config/db');

// Controller untuk membuat permintaan bantuan
const buatPermintaanBantuan = async (req, res) => {
  const penerima_id = req.penerima_id; // Ambil penerima_id dari middleware

  try {
    await query('CALL BuatPermintaanBantuan($1)', [penerima_id]);
    res.status(200).json({ message: 'Help request successfully created' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to create help request' });
  }
};

// Controller untuk melihat status permintaan bantuan
const lihatStatusPermintaanBantuan = async (req, res) => {
  const penerima_id = req.penerima_id;

  try {
    const result = await query('CALL LihatStatusPermintaanBantuan($1, $2, $3)', [penerima_id, null, null]);

    // Periksa apakah result kosong atau mengandung NULL
    if (!result.rows[0].o_penerima_id) {
      res.status(404).json({ message: 'No help requests found' });
    } else {
      const { o_penerima_id, o_status_permohonan } = result.rows[0];
      res.status(200).json({ penerima_id: o_penerima_id, status_permohonan: o_status_permohonan });
    }
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve help request status' });
  }
};


module.exports = { buatPermintaanBantuan, lihatStatusPermintaanBantuan };
