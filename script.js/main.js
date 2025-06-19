// ✅ Toast mesajı gösterme
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), duration);
}

// ✅ Dosya base64 okuma
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ✅ Sınıf ekleme
const classForm = document.getElementById("classForm");
if (classForm) {
  classForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const classNameInput = document.getElementById("className");
    const className = classNameInput.value.trim();
    if (!className) return showToast("Sınıf adı boş olamaz!");

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: className }),
      });

      if (!response.ok) throw new Error("Sınıf eklenemedi.");
      showToast("Sınıf eklendi!");
      classNameInput.value = "";
      loadClassOptions();
    } catch (error) {
      console.error(error);
      showToast("Sınıf eklenirken hata oluştu.");
    }
  });
}

// ✅ Sınıf seçeneklerini yükle
async function loadClassOptions() {
  const select = document.getElementById("classSelect");
  if (!select) return;
  select.innerHTML = '<option value="">-- Sınıf seçin --</option>';

  try {
    const response = await fetch("/api/classes");
    const classes = await response.json();
    classes.forEach(cls => {
      const option = document.createElement("option");
      option.value = cls._id;
      option.textContent = cls.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Sınıflar yüklenemedi:", error);
  }
}
loadClassOptions();

// ✅ Yıllık formu gönder
const yearbookForm = document.getElementById("yearbookForm");
if (yearbookForm) {
  yearbookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const classId = document.getElementById("classSelect").value;
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const lesson = document.getElementById("lesson").value.trim();
    const note = document.getElementById("note").value.trim();
    const photoFile = document.getElementById("photo").files[0];
    const videoFile = document.getElementById("video").files[0];

    if (!classId) return showToast("Lütfen sınıf seçin!");
    if (!photoFile) return showToast("Fotoğraf eklemelisiniz!");

    try {
      const photoBase64 = await readFileAsBase64(photoFile);
      const videoBase64 = videoFile ? await readFileAsBase64(videoFile) : "";

      const response = await fetch(`/api/classes/${classId}/yearbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname,
          nickname,
          lesson,
          note,
          photoBase64,
          videoBase64,
        }),
      });

      if (!response.ok) throw new Error("Yıllık eklenemedi.");

      showToast("Yıllık eklendi");
      yearbookForm.reset();
    } catch (error) {
      console.error(error);
      showToast("Yıllık eklenirken hata oluştu!");
    }
  });
}

// ✅ Giriş yap
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) return showToast("Email ve şifre boş olamaz!");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Giriş başarısız");

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      showToast("Giriş başarılı!");
      setTimeout(() => (window.location.href = "create.html"), 1500);
    } catch (error) {
      console.error("Giriş hatası:", error);
      showToast("Giriş başarısız: " + error.message);
    }
  });
}

// ✅ Yıllık listesi
async function listYearbooksForClass(classId) {
  const yearbookListDiv = document.getElementById("yearbookList");
  yearbookListDiv.innerHTML = "Yükleniyor...";
  if (!classId) return (yearbookListDiv.textContent = "Lütfen sınıf seçin.");

  try {
    const response = await fetch(`/api/classes/${classId}/yearbook`);
    const yearbooks = await response.json();
    yearbookListDiv.innerHTML = "";

    if (!yearbooks.length) {
      yearbookListDiv.textContent = "Bu sınıfa ait yıllık bulunamadı.";
      return;
    }

    yearbooks.forEach((data) => {
      const card = document.createElement("div");
      card.className = "yearbook-card";
      card.innerHTML = `
        <img src="${data.photoBase64 || ''}" alt="Fotoğraf" class="yearbook-photo" style="max-width:150px; border-radius:8px;" />
        <div class="yearbook-info">
          <p><strong>Ad:</strong> ${data.name || '-'}</p>
          <p><strong>Soyad:</strong> ${data.surname || '-'}</p>
          <p><strong>Lakap:</strong> ${data.nickname || '-'}</p>
          <p><strong>Sevdiği Ders:</strong> ${data.lesson || '-'}</p>
          <p><strong>Not:</strong> ${data.note || '-'}</p>
        </div>
        <button class="favorite-btn">⭐ Favori</button>
        <button class="delete-btn">Sil</button>
      `;

      const favoriteBtn = card.querySelector('.favorite-btn');
      favoriteBtn.addEventListener('click', async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return alert("Giriş yapmalısınız!");

        try {
          await fetch(`/api/users/${user._id}/favorites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ classId, yearbookId: data._id, ...data }),
          });
          showToast("Favorilere eklendi!");
        } catch (error) {
          console.error("Favori ekleme hatası:", error);
          showToast("Favori eklenemedi.");
        }
      });

      const deleteBtn = card.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', async () => {
        if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

        try {
          await fetch(`/api/classes/${classId}/yearbook/${data._id}`, {
            method: "DELETE",
          });
          showToast("Yıllık silindi.");
          listYearbooksForClass(classId);
        } catch (error) {
          console.error("Silme hatası:", error);
          showToast("Yıllık silinirken hata oluştu.");
        }
      });

      yearbookListDiv.appendChild(card);
    });
  } catch (error) {
    console.error("Yıllıklar yüklenemedi:", error);
    yearbookListDiv.textContent = "Yıllıklar yüklenirken hata oluştu.";
  }
}

// ✅ Sayfa yüklendiğinde yapılacaklar
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const searchBtn = document.getElementById("searchBtn");
  const showListBtn = document.getElementById("showYearbookListBtn");
  const pdfButton = document.getElementById("downloadPdfLink");
  const classSelect = document.getElementById("classSelect");

  // Menü
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Arama
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const term = prompt("Sayfa içinde aramak istediğiniz kelime nedir?");
      if (term) {
        const elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
        let found = false;
        elements.forEach(el => {
          if (el.textContent.toLowerCase().includes(term.toLowerCase())) {
            el.scrollIntoView({ behavior: "smooth" });
            el.style.backgroundColor = "#ffff99";
            found = true;
          }
        });
        if (!found) alert("Aradığınız kelime bulunamadı.");
      }
    });
  }

  // Liste sayfasına yönlendir
  if (showListBtn) {
    showListBtn.addEventListener("click", () => {
      window.location.href = "yearbookList.html";
    });
  }

  // PDF indir
  if (pdfButton) {
    pdfButton.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedClass = classSelect?.value;
      const element = document.getElementById("yearbookList");
      if (!selectedClass) return alert("Lütfen önce bir sınıf seçin.");
      if (!element || element.innerHTML.trim() === "") return alert("İndirilecek içerik yok.");

      html2pdf().set({
        margin: 10,
        filename: `yillik-${selectedClass}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(element).save();
    });
  }

  // Sınıf seçimiyle yıllıkları listele
  if (classSelect) {
    classSelect.addEventListener("change", () => {
      listYearbooksForClass(classSelect.value);
    });
  }
});
