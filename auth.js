const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

// JWT secret key kontrolü
const JWT_SECRET = process.env.JWT_SECRET || 'güvenli_bir_secret_key_oluşturun'; // Burası önemli!

// Kullanıcı Kayıt Endpoint'i
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    // Gelişmiş validasyon
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ 
        success: false,
        error: 'Geçerli bir email adresi giriniz' 
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    // Kullanıcı var mı kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Bu email adresi zaten kayıtlı'
      });
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 12);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // JWT token oluştur
    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Başarılı yanıt
    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası',
      details: error.message
    });
  }
});

// Kullanıcı Giriş Endpoint'i
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Giriş bilgilerini kontrol et
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email ve şifre gereklidir'
      });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz email veya şifre'
      });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz email veya şifre'
      });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Başarılı yanıt
    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası',
      details: error.message
    });
  }
});

// ROUTE 3: Kullanıcının Kendi Profil Bilgilerini Getir (GET /api/profile)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // authMiddleware'den gelen req.user.id ile kullanıcıyı bul
        // Şifre ve favoriler hariç diğer bilgileri döndür.
        const user = await User.findById(req.user.id).select('-password -favorites');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        res.json(user);
    } catch (error) {
        console.error("Profil bilgileri getirilirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Profil bilgileri getirilemedi.', error: error.message });
    }
});

// ROUTE 4: Kullanıcının Kendi Profil Bilgilerini Güncelle (PUT /api/profile)
router.put('/profile', authMiddleware, async (req, res) => {
    const { name, surname, email } = req.body; // Güncellenecek bilgiler

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Eğer email güncelleniyorsa ve başka bir kullanıcı tarafından kullanılıyorsa kontrol et
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && String(existingUser._id) !== String(user._id)) { // Kendi e-postamız dışında başka birinin kullanıp kullanmadığını kontrol et
                return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
            }
        }

        // Bilgileri güncelle
        user.name = name || user.name;
        user.surname = surname || user.surname;
        // Frontend'de email alanı disabled olduğu için genelde bu kısım çalışmaz,
        // ama yine de backend'de bir güvenlik önlemi olarak dursun.
        user.email = email || user.email;

        await user.save();
        res.json({ message: 'Profil başarıyla güncellendi.', user: { name: user.name, surname: user.surname, email: user.email } });

    } catch (error) {
        console.error("Profil güncellenirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Profil güncellenemedi.', error: error.message });
    }
});

// ROUTE 5: Kullanıcının Hesabını Sil (DELETE /api/profile)
router.delete('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Kullanıcının hesabını sil
        await User.findByIdAndDelete(req.user.id);

        // Opsiyonel: Kullanıcının oluşturduğu yıllık kayıtlarını da silmek isteyebilirsiniz.
        // Bunun için `YearbookEntry` modelini de dahil etmeniz ve burada bir `deleteMany` işlemi yapmanız gerekebilir.
        // Örneğin: const YearbookEntry = require('../models/YearbookEntry');
        // await YearbookEntry.deleteMany({ createdBy: req.user.id }); // Eğer yıllık kayıtlarında `createdBy` alanı varsa

        res.json({ message: 'Hesabınız başarıyla silindi.' });
    } catch (error) {
        console.error("Hesap silinirken hata:", error);
        res.status(500).json({ message: 'Sunucu hatası: Hesap silinemedi.', error: error.message });
    }
});

module.exports = router;