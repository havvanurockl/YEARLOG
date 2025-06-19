// backend/models/User.js

const mongoose = require('mongoose');
// `Schema`'yı buradan çıkarmanıza gerek yok, direkt `mongoose.Schema.Types.ObjectId` kullanacağız.

const UserSchema = new mongoose.Schema({ // Şema adını "UserSchema" olarak güncelledim tutarlılık için
    name: { type: String, required: true },
    surname: { type: String, required: true },  
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{
        // `mongoose.Schema.Types.ObjectId` şeklinde doğru kullanımı
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YearbookEntry' // Favori olarak eklenecek belgenin modeli
    }]
});

module.exports = mongoose.model('User', UserSchema); // Modeli "UserSchema" adıyla dışa aktarın