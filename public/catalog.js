  // ---------- Модальное окно ----------
  const modal = document.getElementById('requestModal');
  const openModalBtns = document.querySelectorAll('#openModalBtn, #heroModalBtn, #ctaModalBtn');
  const closeModalBtn = document.querySelector('.close-modal');

  function openModal() {
    if (modal) modal.style.display = 'flex';
  }

  function closeModal() {
    if (modal) modal.style.display = 'none';
  }

  openModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    window.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Модальное окно (аналогично главной) ----------
  const modal = document.getElementById('requestModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.querySelector('.close-modal');
  if (openModalBtn) openModalBtn.addEventListener('click', () => modal.style.display = 'flex');
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // ---------- Отправка формы (такая же) ----------
  const form = document.getElementById('modalRequestForm');
  const status = document.getElementById('modalFormStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('modalName').value.trim();
    const phone = document.getElementById('modalPhone').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const message = document.getElementById('modalMessage').value.trim();
    if (!name || !phone) {
      status.innerHTML = '<span style="color:#f87171;">Заполните имя и телефон</span>';
      return;
    }
    status.innerHTML = 'Отправка...';
    try {
      const resp = await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message })
      });
      const data = await resp.json();
      if (resp.ok) {
        status.innerHTML = '<span style="color:#4ade80;">✓ Заявка отправлена!</span>';
        form.reset();
        setTimeout(() => { modal.style.display = 'none'; status.innerHTML = ''; }, 2000);
      } else {
        status.innerHTML = `<span style="color:#f87171;">Ошибка: ${data.error}</span>`;
      }
    } catch (err) {
      status.innerHTML = '<span style="color:#f87171;">Ошибка сети</span>';
    }
  });

  // ---------- Загрузка всех категорий ----------
  const grid = document.getElementById('allCategoriesGrid');
  if (grid) {
    fetch('/api/categories')
      .then(res => res.json())
      .then(categories => {
        if (categories.length === 0) {
          grid.innerHTML = '<p style="color:#9ca3af; text-align:center; grid-column:1/-1;">Категории пока не добавлены</p>';
          return;
        }
        grid.innerHTML = categories.map(cat => `
          <a href="/category.html?id=${cat._id}" class="category-item" style="text-decoration:none; color:inherit;">
            <img src="${cat.image}" alt="${cat.name}" loading="lazy">
            <h4>${cat.name}</h4>
          </a>
        `).join('');
      })
      .catch(err => {
        console.error(err);
        grid.innerHTML = '<p style="color:#f87171; text-align:center; grid-column:1/-1;">Ошибка загрузки</p>';
      });
  }
});