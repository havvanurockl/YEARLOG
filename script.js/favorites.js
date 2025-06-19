// backend/public/script.js/favorites.js

const favoritesList = document.getElementById("favoritesList");
const toast = document.getElementById("toast");
const token = localStorage.getItem("token"); // Token'ı al

function showToast(message, type = 'success') { // Toast fonksiyonu güncellendi
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.style.display = 'none';
        }, { once: true });
    }, 3000);
}

// Favorileri yükleme fonksiyonu
async function loadFavorites() {
    favoritesList.innerHTML = ''; // Listeyi her zaman temizle
    
    if (!token) {
        showToast("Favorileri görmek için giriş yapmalısınız.", "error");
        favoritesList.innerHTML = "<p style='text-align:center; color: #888;'>Favorileri görmek için giriş yapmalısınız.</p>";
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/favorites", { // Backend'deki favori endpoint'ine istek
            headers: {
                Authorization: `Bearer ${token}` // Token'ı gönder
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Favoriler alınamadı.");
        }

        const favorites = await res.json(); // Backend'den gelen favori yıllık girişleri

        if (!favorites || favorites.length === 0) { // Favori yoksa mesajı göster
            favoritesList.innerHTML = "<p style='text-align:center; color: #888;'>Henüz favori eklemediniz.</p>";
            return;
        }

        favorites.forEach((entry) => { // Her bir favori yıllık girişi için kart oluştur
            const card = document.createElement("div");
            card.className = "favorite-card";
            card.id = `favorite-card-${entry._id}`; // Favoriden kaldırma işlemi için ID

            let mediaContent = '';
            if (entry.photo) {
                // Backend'deki public/uploads klasöründeki fotoğrafın tam yolu
                mediaContent += `<img class="favorite-photo" src="http://localhost:5000${entry.photo}" alt="${entry.name}">`;
            }
            if (entry.video) {
                // Backend'deki public/uploads klasöründeki videonun tam yolu
                mediaContent += `<video class="favorite-video" controls src="http://localhost:5000${entry.video}"></video>`;
            }

            
        card.innerHTML = `
            ${mediaContent}
            <div class="favorite-info">
                <h3>${entry.name || '-'} ${entry.surname || ''} (${entry.nickname || '-'})</h3>
                <p><strong>Sınıf:</strong> ${entry.class || '-'}</p>
                <p><strong>En Sevdiği Ders:</strong> ${entry.lesson || '-'}</p>
                <p><strong>Not:</strong> ${entry.note || '-'}</p>
            </div>
            <button class="remove-btn" data-id="${entry._id}"><i class="fas fa-trash-alt"></i> Favoriden Kaldır</button>
            `; // Buradaki hata düzeltildi

            // "Favoriden Kaldır" butonuna olay dinleyicisi ekle
            card.querySelector(".remove-btn").addEventListener("click", async () => {
                if (!confirm("Bu yıllık girişini favorilerinizden kaldırmak istediğinize emin misiniz?")) {
                    return;
                }
                try {
                    const res = await fetch(`http://localhost:5000/api/favorites/${entry._id}`, { // Backend'deki DELETE endpoint'ine istek
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}` // Token'ı gönder
                        }
                    });

                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.message || "Favoriden kaldırılamadı.");
                    }
                    showToast("Favoriden başarıyla kaldırıldı.", "success");
                    card.remove(); // Kartı DOM'dan kaldır

                    // Eğer favori listesi boşalırsa mesajı güncelle
                    if (favoritesList.children.length === 0) {
                        favoritesList.innerHTML = "<p style='text-align:center; color: #888;'>Henüz favori eklemediniz.</p>";
                    }

                } catch (err) {
                    showToast("Hata: " + err.message, "error");
                    console.error("Favoriden kaldırılırken hata:", err);
                }
            });

            favoritesList.appendChild(card);
        });
    } catch (err) {
        favoritesList.innerHTML = "<p style='text-align:center; color: #888;'>Favoriler yüklenirken bir hata oluştu.</p>";
        showToast("Favoriler yüklenirken hata: " + err.message, "error");
        console.error(err);
    }
}

// Sayfa yüklendiğinde favorileri getir
document.addEventListener('DOMContentLoaded', loadFavorites);