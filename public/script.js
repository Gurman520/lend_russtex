// Дождаться загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const statItems = document.querySelectorAll('.stat-item');
  let animated = false;

  // Функция анимации одного числа
  function animateNumber(element, target, duration = 2000) {
      const startTime = performance.now();
      const startValue = 0;

      function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentValue = Math.floor(progress * target);
          element.textContent = currentValue;

          if (progress < 1) {
              requestAnimationFrame(update);
          } else {
              element.textContent = target; // финальное значение
          }
      }
      requestAnimationFrame(update);
  }

  // Настройка IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
          animated = true;
          // Запускаем анимацию для каждого .stat-number
          document.querySelectorAll('.stat-number').forEach((el) => {
              const target = parseInt(el.dataset.target, 10);
              if (!isNaN(target)) {
                  animateNumber(el, target);
              }
          });
          observer.unobserve(entries[0].target);
      }
  }, { threshold: 0.3 });

  // Наблюдаем за первым элементом статистики (или оберткой)
  if (statItems.length) {
      observer.observe(statItems[0].closest('.hero-stats') || statItems[0]);
  }


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
})

// Инициализация карусели с логотипами
document.addEventListener('DOMContentLoaded', function () {
   const swiper = new Swiper('.partners-swiper', {
    slidesPerView: 5,
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: true },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        320: { slidesPerView: 2, spaceBetween: 12 },
        480: { slidesPerView: 3, spaceBetween: 16 },
        768: { slidesPerView: 4, spaceBetween: 18 },
        1024: { slidesPerView: 5, spaceBetween: 20 },
        1280: { slidesPerView: 6, spaceBetween: 24 },
    }
});
});
