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