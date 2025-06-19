// backend/routes/favoriteRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // User modelinizi dahil edin
const YearbookEntry = require('../models/YearbookEntry'); // YearbookEntry modelinizi dahil edin
const authMiddleware = require('../middleware/authMiddleware'); // authMiddleware'inizi dahil edin

// ROUTE 1: Kullanıcının Tüm Favorilerini Getir (GET /api/favorites)
// favorites.js bu endpoint'i kullanacak.
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Kullanıcıyı bul ve favorilerindeki YearbookEntry'leri populate et (doldur)
        // populate(): Sadece ID'yi değil, o ID'ye ait tüm belgeyi getirir
        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        res.json(user.favorites); // Populate edilmiş favori yıllık girişlerini gönder
    } catch (error) {
        console.error("Favorileri getirirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Favoriler getirilemedi.', error: error.message });
    }
});

// ROUTE 2: Favoriye Yıllık Ekle (POST /api/favorites)
// yearbookList.html'deki "Favorilere Ekle" butonu bu endpoint'i kullanacak.
router.post('/', authMiddleware, async (req, res) => {
    const { yearbookEntryId } = req.body; // İstek gövdesinden yıllık girişinin ID'sini al

    // ID gelip gelmediğini kontrol et
    if (!yearbookEntryId) {
        return res.status(400).json({ message: 'Favoriye eklenecek yıllık girişinin ID\'si gereklidir.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Yıllık girişinin veritabanında var olup olmadığını kontrol et
        const yearbookEntry = await YearbookEntry.findById(yearbookEntryId);
        if (!yearbookEntry) {
            return res.status(404).json({ message: 'Belirtilen yıllık girişi bulunamadı.' });
        }

        // Yıllık girişinin zaten kullanıcının favorilerinde olup olmadığını kontrol et
        if (user.favorites.includes(yearbookEntryId)) {
            return res.status(400).json({ message: 'Bu yıllık girişi zaten favorilerinizde.' });
        }

        // Favorilere ekle ve kaydet
        user.favorites.push(yearbookEntryId);
        await user.save();
        res.status(201).json({ message: 'Yıllık favorilere başarıyla eklendi.', yearbookEntryId: yearbookEntryId });

    } catch (error) {
        console.error("Favoriye eklenirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Favoriye eklenemedi.', error: error.message });
    }
});

// ROUTE 3: Favoriden Yıllık Kaldır (DELETE /api/favorites/:id)
// favorites.js'deki "Kaldır" butonu bu endpoint'i kullanacak.
router.delete('/:id', authMiddleware, async (req, res) => {
    const favoriteId = req.params.id; // URL parametresinden (yıllık girişinin ID'si) al

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Favoriler dizisinden ID'yi filtreleyerek kaldır
        const initialLength = user.favorites.length; // Kaldırmadan önceki uzunluk
        user.favorites = user.favorites.filter(
            (favYearbookId) => favYearbookId.toString() !== favoriteId // ID'leri stringe çevirerek karşılaştır
        );

        // Eğer dizi uzunluğu değişmediyse, kaldırılacak favori bulunamadı demektir
        if (user.favorites.length === initialLength) {
            return res.status(404).json({ message: 'Favorilerinizde böyle bir yıllık girişi bulunamadı.' });
        }

        await user.save();
        res.json({ message: 'Yıllık favorilerden başarıyla kaldırıldı.' });
    } catch (error) {
        console.error("Favoriden kaldırılırken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Favoriden kaldırılamadı.', error: error.message });
    }
});

module.exports = router;