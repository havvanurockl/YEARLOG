// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken'); // JWT paketi dahil edildi
const User = require('../models/user'); // User modelinizi dahil edin
const dotenv = require('dotenv'); // <--- BU SATIRI EKLEYİN
dotenv.config(); // <--- VE BU SATIRI EKLEYİN (Ortam değişkenlerini yüklemek için)

// Kimlik doğrulama middleware'i
const authMiddleware = async (req, res, next) => {
    // İsteğin başlığından token'ı al
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN" formatından sadece TOKEN'ı al
    }

    // Token yoksa yetkisiz erişim hatası döndür
    if (!token) {
        return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı. Lütfen giriş yapın.' });
    }

    try {
        // Token'ı doğrula
        // Şimdi process.env.JWT_SECRET doğru değeri alacak!
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Token'daki kullanıcı ID'sini kullanarak kullanıcıyı bul
        req.user = await User.findById(decoded.id).select('-password'); // Şifre hariç kullanıcı bilgilerini al

        if (!req.user) {
            return res.status(401).json({ message: 'Geçersiz token. Kullanıcı bulunamadı.' });
        }

        next(); // Middleware'i geç ve bir sonraki işleyiciye devam et

    } catch (error) {
        console.error('Token doğrulama hatası:', error.message);
        // Hata mesajını daha spesifik hale getirebiliriz:
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Yetkilendirme token\'ının süresi dolmuş. Lütfen tekrar giriş yapın.' });
        }
        res.status(401).json({ message: 'Yetkilendirme token\'ı geçersiz.' }); // invalid signature buraya düşer
    }
};

module.exports = authMiddleware;