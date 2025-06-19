// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Route dosyalarınızı doğru adlarla ve yollarla dahil edin
const authRoutes = require('./routes/auth'); // Kullanıcı kayıt, giriş, profil
const yearbookRoutes = require('./routes/yearbook'); // Yıllık girişleri
const favoriteRoutes = require('./routes/favoriteRoutes'); 
const classRoutes = require('./routes/class'); // Sınıf işlemleri (Varsa ve bu şekilde dahil edildiğinden emin olun)

dotenv.config(); // .env dosyasındaki ortam değişkenlerini yükle

const app = express(); // Express uygulamasını başlat

// --- Yükleme Klasörünün Oluşturulması ---
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✓ uploads klasörü otomatik oluşturuldu.');
}

// --- CORS Ayarları ---
app.use(cors({
origin: ['http://localhost:5000', 'http://localhost:8000', 'null'], // Hem backend portuna, hem 8000'e hem de null'a izin ver
methods: ['POST', 'GET', 'PUT', 'DELETE'],
credentials: true
}));

// Express uygulamasına JSON ve URL-encoded gövdelerini parse etmesi için middleware ekle
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form verilerini işlemek için


// --- MongoDB Bağlantısı ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✓ MongoDB bağlantısı başarılı'))
    .catch(err => console.error('✗ MongoDB hatası:', err.message));

// --- API Route'ları ---
// Her route grubuna özel bir URL ön eki (prefix) atayın
app.use('/api', authRoutes); // '/api/register', '/api/login', '/api/profile'
app.use('/api/yearbook', yearbookRoutes); // '/api/yearbook/all', '/api/yearbook/create', '/api/yearbook/:id'
app.use('/api/favorites', favoriteRoutes); // '/api/favorites', '/api/favorites/:id'
app.use('/api/classes', classRoutes); // '/api/classes', '/api/classes/create'

// --- Static Dosyalar ---
// 'public' klasörünü static dosyaların sunulduğu dizin olarak belirle.
// Bu, HTML, CSS, JS dosyalarınızın ve yüklenen medya dosyalarının doğrudan erişilebilir olmasını sağlar.
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Yüklenen medya için ayrı bir static yol

// --- 404 Handler (Endpoint Bulunamadı) ---
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint bulunamadı. Lütfen URL\'i kontrol edin.' });
});

// --- Sunucuyu Başlat ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✓ Sunucu ${PORT} portunda çalışıyor`));