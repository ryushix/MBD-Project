const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const penerimaRoutes = require('./routes/penerimaRoutes');
const adminMiddleware = require('./middlewares/adminMiddleware');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.use('/admin', adminMiddleware, userRoutes); 

// app.use('/penerima', authenticateToken, penerimaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
