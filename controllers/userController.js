const { query } = require('../config/db');

// Fungsi untuk melihat Donatur berdasarkan nama
const lihatDonatur = async (req, res) => {
  const { nama } = req.query; // Menangkap nama dari query parameter
  
  try {
    const result = await query('CALL LihatDonatur($1);', [nama]);
    
    res.status(200).json({
      message: 'Donatur retrieved successfully',
      data: result.rows
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve Donatur' });
  }
};

// Fungsi untuk melihat Penerima Manfaat berdasarkan nama
const lihatPenerimaManfaat = async (req, res) => {
  const { nama } = req.query; // Menangkap nama dari query parameter
  
  try {
    const result = await query('CALL LihatPenerimaManfaat($1);', [nama]);
    
    res.status(200).json({
      message: 'Penerima Manfaat retrieved successfully',
      data: result.rows
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve Penerima Manfaat' });
  }
};

// Fungsi untuk memperbarui Penerima Manfaat
const perbaruiPenerimaManfaat = async (req, res) => {
  const { admin_id, penerima_id, nama, email, informasi_pribadi } = req.body;

  try {
    await query('CALL PerbaruiPenerimaManfaat($1, $2, $3, $4, $5);', [
      admin_id, penerima_id, nama, email, informasi_pribadi
    ]);

    res.status(200).json({ message: 'Penerima Manfaat updated successfully' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to update Penerima Manfaat' });
  }
};

// Fungsi untuk menghapus Penerima Manfaat
const hapusPenerimaManfaat = async (req, res) => {
  const { penerima_id } = req.params;

  try {
    await query('CALL HapusPenerimaManfaat($1);', [penerima_id]);
    
    res.status(200).json({ message: 'Penerima Manfaat deleted successfully' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to delete Penerima Manfaat' });
  }
};

// Fungsi untuk memperbarui Donatur
const perbaruiDonatur = async (req, res) => {
  const { admin_id, donatur_id, nama, email } = req.body;

  try {
    await query('CALL PerbaruiDonatur($1, $2, $3, $4);', [
      admin_id, donatur_id, nama, email
    ]);

    res.status(200).json({ message: 'Donatur updated successfully' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to update Donatur' });
  }
};

// Fungsi untuk menghapus Donatur
const hapusDonatur = async (req, res) => {
  const { donatur_id } = req.params;

  try {
    await query('CALL HapusDonatur($1);', [donatur_id]);
    
    res.status(200).json({ message: 'Donatur deleted successfully' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to delete Donatur' });
  }
};

module.exports = {
  lihatDonatur,
  lihatPenerimaManfaat,
  perbaruiPenerimaManfaat,
  hapusPenerimaManfaat,
  perbaruiDonatur,
  hapusDonatur
};
