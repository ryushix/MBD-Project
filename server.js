const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import rute user
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rute untuk autentikasi
app.use('/auth', authRoutes);

// Rute untuk admin dan user
app.use('/admin', authenticateToken, userRoutes); // Admin route yang memerlukan autentikasi

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
