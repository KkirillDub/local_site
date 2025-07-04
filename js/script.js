document.addEventListener('DOMContentLoaded', () => {
    // --- Тема ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const customColorInput = document.getElementById('custom-color');

    themeToggleBtn?.addEventListener('click', () => {
        themeMenu.classList.toggle('hidden');
    });

    themeMenu?.querySelectorAll('button[data-theme]').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            setTheme(theme);
            themeMenu.classList.add('hidden');
        });
    });

    themeMenu?.querySelectorAll('button[data-color]').forEach(button => {
        button.addEventListener('click', () => {
            const hue = getHueFromColorName(button.dataset.color);
            document.documentElement.style.setProperty('--primary-hue', hue);
            localStorage.setItem('colorHue', hue);
        });
    });

    customColorInput?.addEventListener('input', (e) => {
        const hue = getHueFromHex(e.target.value);
        if (hue !== null) {
            document.documentElement.style.setProperty('--primary-hue', hue);
            localStorage.setItem('colorHue', hue);
        }
    });

    function setTheme(theme) {
        if (theme === 'system') {
            localStorage.removeItem('theme');
            applySystemTheme();
        } else {
            localStorage.setItem('theme', theme);
            document.body.classList.toggle('dark-theme', theme === 'dark');
            if (theme === 'light') {
                document.body.classList.remove('dark-theme');
            }
        }
    }

    function applySystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
    }

    function getHueFromColorName(name) {
        return {
            blue: 210,
            green: 140,
            purple: 280
        }[name] || 210;
    }

    function getHueFromHex(hex) {
        if (!hex) return null;
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;
        if (max === min) h = 0;
        else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
        else if (max === g) h = (60 * ((b - r) / (max - min)) + 120) % 360;
        else h = (60 * ((r - g) / (max - min)) + 240) % 360;
        return Math.round(h);
    }

    // --- Фон ---
    document.querySelectorAll('[data-bg]').forEach(button => {
        button.addEventListener('click', () => {
            const bg = button.dataset.bg;
            if (bg === 'none') {
                document.body.style.backgroundImage = 'none';
                localStorage.removeItem('userBackground');
            } else {
                document.body.style.backgroundImage = `url('images/${bg}')`;
                localStorage.setItem('userBackground', bg);
            }
        });
    });

    // --- Язык ---
    const languageToggleBtn = document.getElementById('language-toggle');
    let currentLang = localStorage.getItem('lang') || 'ru';

    function updateLanguage(lang) {
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
        });
        languageToggleBtn.textContent = lang === 'ru' ? '🇷🇺 RU' : '🇺🇸 EN';
        document.documentElement.lang = lang;
    }

    languageToggleBtn?.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('lang', currentLang);
        updateLanguage(currentLang);
    });

    // --- Инициализация ---
    (function initPreferences() {
        const savedTheme = localStorage.getItem('theme');
        const savedHue = localStorage.getItem('colorHue');
        const savedBg = localStorage.getItem('userBackground');
        const savedLang = localStorage.getItem('lang');

        if (savedTheme) setTheme(savedTheme); else applySystemTheme();
        if (savedHue) document.documentElement.style.setProperty('--primary-hue', savedHue);
        if (savedBg) document.body.style.backgroundImage = `url('images/${savedBg}')`;
        updateLanguage(savedLang || 'ru');
    })();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!localStorage.getItem('theme')) applySystemTheme();
    });
});

// --- Google Sheets Webhook ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_757tNIpxltj7rJlR0H1HgfZUSaM1YoHqb3t7rilXKJ7yOvalsUzCVr-5rQEaUzQM/exec';

document.getElementById('testimonial-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !message) return;

    // 🔁 Отправляем в Google Sheets
    await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ name, message }),
        headers: { 'Content-Type': 'application/json' }
    });

    // ✏️ Добавляем на страницу
    renderTestimonial({ name, message, date: new Date().toLocaleDateString() });
    alert('Спасибо! Ваш отзыв успешно отправлен.');
    e.target.reset();
});

function renderTestimonial({ name, message, date }) {
    const container = document.getElementById('testimonial-list') || document.querySelector('.testimonials-sidebar');
    const item = document.createElement('div');
    item.className = 'testimonial-item';
    item.innerHTML = `
        <div class="testimonial-avatar" style="background-image:url('images/user-default.jpg');"></div>
        <div class="testimonial-content">
            <div class="stars">★★★★★</div>
            <div>${message}</div>
            <div class="testimonial-name">${name}</div>
            <div class="testimonial-date">${date}</div>
        </div>
    `;
    container.appendChild(item);
}

document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', function (e) {
        const url = link.getAttribute('href');
        if (url && !url.startsWith('#')) {
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = url;
            }, 500);
        }
    });
});

const backgroundColorMap = {
  'background1.jpg': 210, // синий
  'background2.jpg': 140, // зелёный
  'background3.jpg': 280, // фиолетовый
  'background4.jpg': 30   // тёплый оранжевый, например
};

document.querySelectorAll('[data-bg]').forEach(button => {
  button.addEventListener('click', () => {
    const bg = button.dataset.bg;
    if (bg === 'none') {
      document.body.style.backgroundImage = 'none';
      localStorage.removeItem('userBackground');
    } else {
      document.body.style.backgroundImage = `url('images/${bg}')`;
      localStorage.setItem('userBackground', bg);

      // 🎨 Заменим цвет акцента
      const hue = backgroundColorMap[bg];
      if (hue !== undefined) {
        document.documentElement.style.setProperty('--primary-hue', hue);
        localStorage.setItem('colorHue', hue);
      }
    }
  });
});
