document.addEventListener('DOMContentLoaded', () => {
  // ---------- Получаем id категории из URL ----------
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get('id');
  if (!categoryId) {
    document.getElementById('categoryContent').innerHTML = '<p style="color:#f87171;">Категория не указана</p>';
    return;
  }

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

  // ---------- Отправка формы модального окна (fetch) ----------
  const modalForm = document.getElementById('modalRequestForm');
  const modalStatus = document.getElementById('modalFormStatus');

  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const email = document.getElementById('modalEmail').value.trim();
      const company = document.getElementById('modalNameCompany').value.trim();
      const message = document.getElementById('modalMessage').value.trim();

      if (!name || !phone || !company) {
        if (modalStatus) modalStatus.innerHTML = '<span style="color:#f87171;">Заполните имя, телефон и название компании</span>';
        return;
      }

      if (modalStatus) modalStatus.innerHTML = 'Отправка...';
      try {
        const response = await fetch('/api/send-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, company, message})
        });
        const data = await response.json();
        if (response.ok) {
          if (modalStatus) modalStatus.innerHTML = '<span style="color:#4ade80;">✓ Заявка отправлена! Мы свяжемся с вами.</span>';
          modalForm.reset();
          setTimeout(() => {
            closeModal();
            if (modalStatus) modalStatus.innerHTML = '';
          }, 2000);
        } else {
          if (modalStatus) modalStatus.innerHTML = `<span style="color:#f87171;">Ошибка: ${data.error || 'попробуйте позже'}</span>`;
        }
      } catch (err) {
        if (modalStatus) modalStatus.innerHTML = '<span style="color:#f87171;">Ошибка сети. Проверьте соединеsние.</span>';
      }
    });
  }

  // ---------- Загрузка данных категории ----------
  const content = document.getElementById('categoryContent');

  async function loadCategory() {
    try {
      const resp = await fetch(`/api/categories/${categoryId}`);
      if (!resp.ok) throw new Error('Категория не найдена');
      const { category, children } = await resp.json();

      // Выводим заголовок и описание
      let html = `
        <div class="category-info-box">
          <div class="category-header">
            <h1>${category.name}</h1>
            <div class="desc">${category.description || 'Описание отсутствует'}</div>
          </div>
        </div>
      `;

      // Если есть подкатегории -> показываем их
      if (children && children.length > 0) {
        // html += `<h2 style="margin: 30px 0 20px; color: #eef2ff;">Подкатегории</h2>`;
        html += `<div class="subcategory-grid">`;
        children.forEach(sub => {
          html += `
            <a href="/category.html?id=${sub._id}" class="subcategory-item">
              ${sub.image ? `<img src="${sub.image}" alt="${sub.name}">` : ''}
              <h4>${sub.name}</h4>
            </a>
          `;
        });
        html += `</div>`;
        content.innerHTML = html;
        return; // товары не показываем, т.к. есть подкатегории
      }

      // Если подкатегорий нет -> загружаем товары с пагинацией
      await loadProducts(1);
    } catch (err) {
      content.innerHTML = `<p style="color:#f87171;">Ошибка загрузки: ${err.message}</p>`;
    }
  }

  async function loadProducts(page) {
    try {
      const resp = await fetch(`/api/categories/${categoryId}/products?page=${page}&limit=40`);
      if (!resp.ok) throw new Error('Не удалось загрузить товары');
      const { products, total, page: currentPage, totalPages } = await resp.json();

      let html = `
        <div class="category-header">
          <h1>${document.querySelector('h1')?.textContent || 'Товары'}</h1>
          <div class="desc">${document.querySelector('.desc')?.textContent || ''}</div>
        </div>
      `;

      if (products.length === 0) {
        html += `<p style="color:#9ca3af; text-align:center;">Товаров в этой категории пока нет.</p>`;
      } else {
        html += `<div class="product-grid">`;
        products.forEach(p => {
          html += `
            <div class="product-card">
              ${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}
              <h4>${p.name}</h4>
              <div class="article">Артикул: ${p.article || '—'}</div>
              <div style="font-size:0.85rem; color:#9ca3af;">${p.manufacturer || ''}</div>
            </div>
          `;
        });
        html += `</div>`;
      }

      // Пагинация
      if (totalPages > 1) {
        html += `<div class="pagination">`;
        for (let i = 1; i <= totalPages; i++) {
          if (i === currentPage) {
            html += `<span class="active">${i}</span>`;
          } else {
            html += `<a href="#" data-page="${i}">${i}</a>`;
          }
        }
        html += `</div>`;
      }

      // Сохраняем текущий контент, заменяя только товары и пагинацию
      const header = document.querySelector('.category-header');
      if (header) {
        // Заменяем только нижнюю часть
        const existingGrid = document.querySelector('.product-grid');
        const existingPagination = document.querySelector('.pagination');
        if (existingGrid) existingGrid.remove();
        if (existingPagination) existingPagination.remove();
        // Вставляем новые
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const newGrid = tempDiv.querySelector('.product-grid');
        const newPagination = tempDiv.querySelector('.pagination');
        if (newGrid) header.after(newGrid);
        if (newPagination) {
          if (newGrid) newGrid.after(newPagination);
          else header.after(newPagination);
        }
        // Обновляем обработчики для пагинации
        document.querySelectorAll('.pagination a[data-page]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageNum = parseInt(e.target.dataset.page);
            loadProducts(pageNum);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        });
      } else {
        // Если заголовка нет, просто заменяем весь контент
        content.innerHTML = html;
        document.querySelectorAll('.pagination a[data-page]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageNum = parseInt(e.target.dataset.page);
            loadProducts(pageNum);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        });
      }

    } catch (err) {
      content.innerHTML += `<p style="color:#f87171;">Ошибка загрузки товаров: ${err.message}</p>`;
    }
  }

  // Запускаем
  loadCategory();
});