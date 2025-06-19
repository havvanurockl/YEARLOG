// backend/public/script.js/profile.js

document.addEventListener('DOMContentLoaded', async () => {
    const profileForm = document.getElementById('profileForm');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const deleteAccountBtn = document.getElementById('deleteAccount');
    const toast = document.getElementById('toast'); // Toast elementi için

    // Toast bildirim fonksiyonu
    function showToast(message, type = 'success') {
        if (!toast) return; // Toast elementi yoksa hata vermesin
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.style.display = 'none';
            }, { once: true });
        }, 3000);
    }

    const token = localStorage.getItem('token'); // Token'ı localStorage'dan al

    // Eğer token yoksa, kullanıcıyı login sayfasına yönlendir
    if (!token) {
        showToast("Profil bilgileri için giriş yapmalısınız.", "error");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500); // 1.5 saniye sonra yönlendir
        return; // Fonksiyonu durdur
    }

    // Profil bilgilerini yükle
    async function loadProfile() {
        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Token'ı gönder
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Profil bilgileri getirilirken hata oluştu.');
            }

            const user = await response.json();
            nameInput.value = user.name;
            surnameInput.value = user.surname;
            emailInput.value = user.email; // Email disabled olduğu için sadece gösterilecek
            // Diğer alanlar varsa onları da buraya ekleyebilirsiniz (örn: user.username)

        } catch (error) {
            console.error("Profil yüklenirken hata:", error);
            showToast(`Profil yüklenirken hata: ${error.message}`, "error");
            // Hata durumunda belki de kullanıcıyı çıkış yapmaya zorlayabilirsiniz
            localStorage.removeItem('token');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    // Profil güncelleme submit olayı
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Formun varsayılan gönderimini engelle

        const updatedName = nameInput.value;
        const updatedSurname = surnameInput.value;
        // E-posta alanı disabled olduğu için genelde güncellenmez.
        // Eğer güncellenebilir olsaydı, emailInput.value'yu alırdık.

        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: updatedName, surname: updatedSurname })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Profil güncellenirken bir hata oluştu.');
            }

            const data = await response.json();
            showToast(data.message, "success");
            // UI'ı güncelleyebilirsiniz, ancak input'lar zaten yeni değerleri tutuyor.

        } catch (error) {
            console.error("Profil güncellenirken hata:", error);
            showToast(`Profil güncellenirken hata: ${error.message}`, "error");
        }
    });

    // Hesabı sil butonu olayı
    deleteAccountBtn.addEventListener('click', async () => {
        if (!confirm("Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
            return; // Kullanıcı iptal etti
        }

        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hesap silinirken bir hata oluştu.');
            }

            showToast("Hesabınız başarıyla silindi.", "success");
            localStorage.removeItem('token'); // Token'ı kaldır

            // Kullanıcıyı ana sayfaya veya login sayfasına yönlendir
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            console.error("Hesap silinirken hata:", error);
            showToast(`Hesap silinirken hata: ${error.message}`, "error");
        }
    });

    // Sayfa yüklendiğinde profili yükle
    await loadProfile();
});