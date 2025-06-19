document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); 
  
  const toast = document.getElementById('toast');
  const showToast = (msg, isError = false) => {
    toast.textContent = msg;
    toast.style.background = isError ? '#ff4444' : '#4CAF50';
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
  };

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });

    // Yanıtı JSON olarak direkt alıyoruz
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Giriş başarısız');
    }

localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
showToast('Giriş başarılı! Yönlendiriliyorsunuz...');

setTimeout(() => {
  window.location.href = 'create.html'; 
}, 2000);

  } catch (error) {
    console.error('Hata detayı:', error);
    showToast(error.message || 'Sistemsel hata!', true);
  }
});