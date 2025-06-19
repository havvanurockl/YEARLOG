// backend/routes/yearbook.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// MongoDB Modellerini dahil ediyoruz
// Bu modellerin backend/models klasöründe doğru tanımlandığından emin olun.
const YearbookEntry = require('../models/YearbookEntry'); // YearbookEntry.js'den import
const Class = require('../models/Class');             // Class.js'den import

// --- Multer Depolama Ayarları ---
// Yüklenen dosyaların sunucuda nereye ve hangi isimle kaydedileceğini belirler.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Dosyaları 'public/uploads/' klasörüne kaydet
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- API Endpoint'leri ---

// ROUTE 1: Yeni Bir Sınıf Ekleme (POST /api/classes)
router.post('/classes', async (req, res) => {
  try {
    const { className } = req.body;

    if (!className) {
      return res.status(400).json({ message: 'Sınıf adı boş olamaz.' });
    }

    const newClass = new Class({ name: className });
    await newClass.save();

    res.status(201).json(newClass); // Yeni oluşturulan sınıfı geri döndür

  } catch (error) {
    if (error.code === 11000) { // Duplicate key error (aynı isimde sınıf varsa)
      return res.status(409).json({ message: 'Bu sınıf adı zaten mevcut.' });
    }
    console.error("Sınıf eklenirken hata:", error);
    res.status(500).json({ message: 'Sınıf eklenirken bir hata oluştu.', error: error.message });
  }
});

// ROUTE 2: Tüm Sınıfları Listeleme (GET /api/classes)
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find({}); // MongoDB'den tüm sınıfları çek
    res.status(200).json(classes); // Sınıflar dizisini geri döndür

  } catch (error) {
    console.error("Sınıflar getirilirken hata:", error);
    res.status(500).json({ message: 'Sınıflar getirilirken bir hata oluştu.', error: error.message });
  }
});

// ROUTE 3: Yeni Bir Yıllık Girişi Oluşturma (POST /api/yearbook)
// Formdan gelen 'photo' ve 'video' dosyalarını Multer ile işle
router.post('/yearbook', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { class: className, name, surname, nickname, lesson, note } = req.body;

    // Yüklenen dosya yollarını al
    const photoPath = req.files['photo'] ? `/uploads/${req.files['photo'][0].filename}` : null;
    const videoPath = req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;

    if (!className || !name || !surname || !nickname || !lesson || !note || !photoPath) {
        return res.status(400).json({ message: 'Tüm zorunlu alanlar doldurulmalıdır (Fotoğraf dahil).' });
    }

    const newYearbookEntry = new YearbookEntry({ // YearbookEntry modelini kullandık
      class: className,
      name,
      surname,
      nickname,
      lesson,
      note,
      photo: photoPath, // Modeldeki 'photo' alanına atıyoruz
      video: videoPath  // Modeldeki 'video' alanına atıyoruz
    });

    await newYearbookEntry.save();
    res.status(201).json({ message: 'Yıllık başarıyla oluşturuldu!', entry: newYearbookEntry });

  } catch (error) {
    console.error("Yıllık oluşturulurken hata:", error);
    res.status(500).json({ message: 'Yıllık oluşturulurken bir hata oluştu.', error: error.message });
  }
});
// ROUTE 4: Tüm Yıllık Girişlerini Listeleme (GET /api/yearbook/all)
router.get('/yearbook/all', async (req, res) => {
    try {
        // YearbookEntry modelini kullanarak tüm yıllık girişlerini bul
        const yearbookEntries = await YearbookEntry.find({});

        // Başarılı olursa 200 OK durum koduyla yıllık girişlerini döndür
        res.status(200).json(yearbookEntries);
    } catch (error) {
        // Hata oluşursa konsola yaz ve 500 Internal Server Error döndür
        console.error("Yıllık girişleri getirilirken hata:", error);
        res.status(500).json({ message: 'Yıllık girişleri getirilirken bir hata oluştu.', error: error.message });
    }
});
// Router'ı dışa aktar
module.exports = router;