// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

// ROUTES
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Sunucu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Sunucu ${PORT} portunda çalışıyor`));
