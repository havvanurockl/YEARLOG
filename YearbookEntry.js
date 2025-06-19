// backend/models/YearbookEntry.js

const mongoose = require('mongoose');

// Mongoose Şeması tanımlanıyor. Adı YearbookEntrySchema olarak kalabilir.
const YearbookEntrySchema = new mongoose.Schema({
  // Sınıf alanı (zorunlu)
  class: {
    type: String,
    required: true
  },
  // Ad alanı (zorunlu)
  name: {
    type: String,
    required: true
  },
  // Soyad alanı (zorunlu)
  surname: {
    type: String,
    required: true
  },
  // Lakap alanı (zorunlu)
  nickname: {
    type: String,
    required: true
  },
  // En sevdiği ders alanı (zorunlu)
  lesson: {
    type: String,
    required: true
  },
  // Not alanı (zorunlu)
  note: {
    type: String,
    required: true
  },
  // FOTOĞRAF YOLU ALANI:
  // Daha önceki kodunuzda 'photoUrl' idi. Artık 'photo' olarak değiştiriyoruz.
  // Bu, `routes/yearbook.js` dosyasındaki dosya yükleme mantığıyla uyumlu olacak.
  photo: {
    type: String,
    required: true // Fotoğraf yolu zorunlu
  },
  // VİDEO YOLU ALANI:
  // Daha önceki kodunuzda 'videoUrl' idi. Artık 'video' olarak değiştiriyoruz.
  // Bu da `routes/yearbook.js` ile uyumlu olacak.
  video: {
    type: String,
    default: null // Video yolu isteğe bağlı, varsayılanı boş (null)
  },
  // Girişin oluşturulma tarihi
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mongoose modeli oluşturuluyor.
// Model adı 'YearbookEntry' olarak KALIYOR.
// MongoDB'de 'yearbookentries' adında bir koleksiyon oluşturacak (otomatik çoğul).
module.exports = mongoose.model('YearbookEntry', YearbookEntrySchema);
