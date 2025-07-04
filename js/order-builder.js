document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('calculate-btn');
  const resultBlock = document.getElementById('calc-result');

  btn.addEventListener('click', () => {
    const type = document.getElementById('site-type').value;
    const sections = parseInt(document.getElementById('sections').value, 10);
    const adaptive = document.getElementById('adaptivity').checked;

    let basePrice, baseDays;
    if (type === 'store') {
      basePrice = 10000;
      baseDays = 10;
    } else if (type === 'promo') {
      basePrice = 7000;
      baseDays = 7;
    } else {
      basePrice = 5000;
      baseDays = 5;
    }

    const extraPrice = sections * 300;
    const extraDays = Math.ceil(sections / 3);
    const adaptBonus = adaptive ? 1500 : 0;

    const totalPriceRUB = basePrice + extraPrice + adaptBonus;
    const totalDays = baseDays + extraDays;

    // 💬 Определим текущий язык
    const lang = localStorage.getItem('lang') || 'ru';

    // 💱 Конвертация (пример: 1 $ ≈ 90 ₽ — можно подставить свой курс)
    const exchangeRate = 90;
    const totalPriceUSD = Math.round(totalPriceRUB / exchangeRate);

    // 🌐 Обновление результата
    resultBlock.querySelector('[data-lang="ru"]').textContent =
      `Итог: ${totalDays} дней / ${totalPriceRUB.toLocaleString()} ₽`;

    resultBlock.querySelector('[data-lang="en"]').textContent =
      `Result: ${totalDays} days / $${totalPriceUSD.toLocaleString()}`;
  });
});
