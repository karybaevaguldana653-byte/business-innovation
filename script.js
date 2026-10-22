/* Business Innovation — скрипты лендинга */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== Шапка: фон при прокрутке ===== */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===== Мобильное меню ===== */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ===== Появление элементов при прокрутке ===== */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // небольшая задержка для соседних карточек
          const siblings = [...entry.target.parentElement.children];
          entry.target.style.transitionDelay = `${(siblings.indexOf(entry.target) % 5) * 80}ms`;
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ===== Счётчики статистики ===== */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // плавное замедление
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count + (c.dataset.suffix || ''));
  }

  /* ===== Проверка формы ===== */
  const form = document.getElementById('form');
  const success = document.getElementById('success');

  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Введите имя (не менее 2 символов).',
    phone: v => /^\+?[\d\s()-]{10,18}$/.test(v.trim()) && v.replace(/\D/g, '').length >= 10
      ? '' : 'Введите телефон в формате +7 900 123-45-67.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Введите корректный адрес, например name@company.ru.',
    message: v => v.trim().length >= 10 ? '' : 'Опишите задачу подробнее (не менее 10 символов).'
  };

  const validateField = (input) => {
    const msg = rules[input.name](input.value);
    const field = input.closest('.field');
    field.classList.toggle('invalid', !!msg);
    field.querySelector('.error').textContent = msg;
    return !msg;
  };

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.hidden = true;
    const fields = [...form.querySelectorAll('input, textarea')];
    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      return;
    }
    // Здесь можно отправить данные на сервер (fetch / Formspree и т.п.)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Отправляем…';
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Отправить заявку';
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });

  /* ===== Окно «Подробнее» для проектов ===== */
  const projects = [
    { title: 'FreshBox — доставка продуктов',
      text: 'Интернет-магазин с подпиской на еженедельные наборы продуктов и личным кабинетом.',
      list: ['Онлайн-оплата и интеграция со складом', 'Рост заказов в 2,4 раза за 6 месяцев', 'Срок запуска — 6 недель'] },
    { title: 'MedAssist — бот для клиники',
      text: 'Чат-бот в Telegram и на сайте: запись на приём, напоминания и ответы на частые вопросы.',
      list: ['Нагрузка на администраторов ниже на 45%', 'Снижение неявок на приём на 30%', 'Срок запуска — 4 недели'] },
    { title: 'LogiTrack — аналитика логистики',
      text: 'Панель на основе Big Data: маршруты, расход топлива и загрузка автопарка в реальном времени.',
      list: ['Затраты на топливо ниже на 18%', 'Автоматические еженедельные отчёты', 'Окупилась за 2 месяца'] }
  ];
  const modal = document.getElementById('modal');
  document.querySelectorAll('[data-project]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = projects[+btn.dataset.project];
      document.getElementById('modal-title').textContent = p.title;
      document.getElementById('modal-text').textContent = p.text;
      document.getElementById('modal-list').innerHTML = p.list.map(i => `<li>${i}</li>`).join('');
      modal.showModal();
    });
  });
  document.getElementById('modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); }); // клик по фону

  /* ===== Год в подвале ===== */
  document.getElementById('year').textContent = new Date().getFullYear();
});
