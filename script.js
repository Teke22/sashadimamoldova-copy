// ⏳ Таймер до свадьбы
(function() {
  var wedding = new Date('2026-07-25T17:00:00');

  function updateCountdown() {
    var now = new Date();

    if (now >= wedding) {
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '0';
      document.getElementById('mins').textContent = '0';
      document.getElementById('secs').textContent = '0';
      return;
    }

    var d = wedding - now;

    document.getElementById('days').textContent = Math.floor(d / 86400000);
    document.getElementById('hours').textContent = String(Math.floor((d % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('mins').textContent = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('secs').textContent = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();


// ✨ Анимация появления
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-scroll]').forEach(function(el) {
    observer.observe(el);
  });
})();


// 💌 Отправка формы + Telegram
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var form = e.target;
  var data = new FormData(form);

  var fio = data.get('fio');
  var presence = data.get('presence');

  // 👉 ВСТАВЬ СЮДА СВОЙ НОВЫЙ TOKEN
  var TOKEN = '8028087308:AAG4TMJHn8wW2VUcO6wKce17YCYqzn8qio0';

  // 👉 ТВОЙ chat_id
  var CHAT_ID = '227522781';

  var presenceText = 'Не знает';
  if (presence === 'yes') presenceText = 'Будет';
  if (presence === 'no') presenceText = 'Не сможет';

  var text = `
💍 <b>Новая заявка на свадьбу!</b>

👤 <b>Имя:</b> ${fio}
📌 <b>Ответ:</b> ${presenceText}
`;

  // ✨ Плавное исчезновение
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '0';

  // 📩 Отправка в Telegram
  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    })
  });

  // 📩 Отправка в Formspree (чтобы была почта)
  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(function(response) {
    if (response.ok) {
      // 🚀 переход на красивую страницу
      window.location.href = 'https://dimasasha.github.io/wedding-site/thanks.html';
    } else {
      alert('Ошибка отправки формы');
      document.body.style.opacity = '1';
    }
  })
  .catch(function() {
    alert('Ошибка соединения');
    document.body.style.opacity = '1';
  });
});
