// Дождаться загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Плавный скролл для ссылок ----------
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

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

      if (!name || !phone) {
        if (modalStatus) modalStatus.innerHTML = '<span style="color:#f87171;">Заполните имя и телефон</span>';
        return;
      }

      if (modalStatus) modalStatus.innerHTML = 'Отправка...';
      try {
        const response = await fetch('/api/send-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email})
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
})
