document.addEventListener('DOMContentLoaded', () => {
    const giftArr = [
        { title: "Скидка 20% на первую покупку в нашем магазине!", icon: "img/discount.svg" },
        { title: "Скидка 10% на всё!", icon: "img/discount_2.svg" },
        { title: "Подарок при первой покупке в нашем магазине!", icon: "img/gift.svg" },
        { title: "Бесплатная доставка для вас!", icon: "img/delivery.svg" },
        { title: "Сегодня день больших скидок!", icon: "img/discount_3.svg" }
    ];

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    function showGiftCard(gift) {
        const root = document.getElementById('gift-root');
        if (!root) return;

        root.innerHTML = `
      <div class="gift-overlay" role="dialog" aria-modal="true" aria-label="Подарок для вас">
        <article class="gift-card">
          <div class="gift-card__icon">
            <img src="${gift.icon}" alt="" onerror="this.style.display='none'">
          </div>
          <div class="gift-card__content">
            <h3 class="gift-card__title">${gift.title}</h3>
            <button type="button" class="gift-card__btn">Отлично!</button>
          </div>
        </article>
      </div>
    `;

        root.querySelector('.gift-card__btn')?.addEventListener('click', closeGift);
        
        const overlay = root.querySelector('.gift-overlay');
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) closeGift();
        });
        
        function onEsc(e) {
            if (e.key === 'Escape') closeGift();
        };
        document.addEventListener('keydown', onEsc, { once: true });
        function closeGift() {
            root.innerHTML = '';
        }
    }

    setTimeout(() => {
        const gift = pickRandom(giftArr);
        showGiftCard(gift);
    }, 3000);
});