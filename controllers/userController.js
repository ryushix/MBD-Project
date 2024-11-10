const { query } = require('../config/db');

const lihatDonatur = async (req, res) => {
    const { nama } = req.query; // Menangkap nama dari query parameter
    
    try {
      const result = await query('CALL LihatDonatur($1, $2, $3, $4, $5, $6);', [nama, null, null, null, null, null]);
  
      // Result.rows akan berisi data sesuai dengan parameter OUT yang disetel di prosedur
      res.status(200).json({
        message: 'Donatur retrieved successfully',
        data: result.rows
      });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Failed to retrieve Donatur' });
    }
  };

const lihatPenerimaManfaat = async (req, res) => {
    const { nama } = req.query; // Menangkap nama dari query parameter
    
    try {
      const result = await query('CALL LihatPenerimaManfaat($1, $2, $3, $4, $5, $6);', [nama, null, null, null, null, null]
      );
      
      res.status(200).json({
        message: 'Penerima Manfaat retrieved successfully',
        data: result.rows
      });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Failed to retrieve Penerima Manfaat' });
    }
  };

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

const perbaruiDonatur = async (req, res) => {
  const { admin_id, donatur_id, nama, email , informasi_pribadi} = req.body;

  try {
    await query('CALL PerbaruiDonatur($1, $2, $3, $4, $5);', [
      admin_id, donatur_id, nama, email, informasi_pribadi
    ]);

    res.status(200).json({ message: 'Donatur updated successfully' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to update Donatur' });
  }
};

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
