// backend/routes/class.js

const express = require('express');
const router = express.Router();
const Class = require('../models/Class'); // Class modelinizi dahil edin

// ROUTE 1: Yeni Sınıf Oluşturma (POST /api/classes)
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Sınıf adı gereklidir.' });
        }

        // Sınıfın zaten var olup olmadığını kontrol et
        const existingClass = await Class.findOne({ name });
        if (existingClass) {
            return res.status(409).json({ message: 'Bu sınıf adı zaten mevcut.' });
        }

        const newClass = new Class({ name });
        await newClass.save();
        res.status(201).json({ message: 'Sınıf başarıyla oluşturuldu.', class: newClass });
    } catch (error) {
        console.error("Sınıf oluşturulurken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Sınıf oluşturulamadı.', error: error.message });
    }
});

// ROUTE 2: Tüm Sınıfları Listeleme (GET /api/classes)
router.get('/', async (req, res) => {
    try {
        const classes = await Class.find().sort({ name: 1 }); // Alfabetik sıraya göre sırala
        res.json(classes);
    } catch (error) {
        console.error("Sınıflar getirilirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Sınıflar getirilemedi.', error: error.message });
    }
});

module.exports = router;