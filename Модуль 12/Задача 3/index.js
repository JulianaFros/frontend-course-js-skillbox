document.addEventListener('DOMContentLoaded', () => {
    const promocodeArr = [
        { promocode: 'PROM10', gift: 'Скидка 10%' },
        { promocode: 'PROM50', gift: 'Скидка 50%' },
        { promocode: 'GIFT', gift: 'Подарок в корзине' },
    ];

    const normalize = s => (s ?? '').trim().toUpperCase();
    function findPromo(code) {
        const norm = normalize(code);
        return promocodeArr.find(p => normalize(p.promocode) === norm);
    }

    const form = document.getElementById('promo-form');
    const input = document.getElementById('promo-input');
    const btn = document.getElementById('promo-btn');
    const msg = document.getElementById('promo-msg');
    const resetBtn = document.getElementById('promo-reset');

    function setCookie(name, value, days = 30) {
        const d = new Date();
        d.setTime(d.getTime() + days * 864e5);
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
    }
    function getCookieMap() {
        return document.cookie.split('; ').filter(Boolean).reduce((acc, item) => {
            const eq = item.indexOf('=');
            const k = decodeURIComponent(eq > -1 ? item.slice(0, eq) : item);
            const v = decodeURIComponent(eq > -1 ? item.slice(eq + 1) : '');
            acc[k] = v;
            return acc;
        }, {});
    }
    function getCookie(name) {
        return getCookieMap()[name];
    }

    function renderApplied(code) {
        form.classList.add('promo--applied');
        input.value = promo.promocode;
        input.setAttribute('readonly', 'true');
        btn.textContent = 'Активирован';
        btn.setAttribute('disabled', 'true');

        msg.textContent = `Промокод активирован: ${promocodeObj.gift}`;
        msg.hidden = false;

        resetBtn.hidden = false;
    }

    function renderDefault() {
        form.classList.remove('promo--applied');
        input.removeAttribute('readonly');
        input.value = '';
        btn.textContent = 'Примерить';
        btn.removeAttribute('disabled');

        msg.textContent = '';
        msg.hidden = true;

        resetBtn.hidden = true;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = (input.value || '').trim();
        const promo = findPromo(code);

        if (promo) {
            setCookie('promo', promo.promocode, 30);
            renderApplied(promo);
        } else {
            renderDefault();
            input.focus();
            input.select();
        }
    });

    const savedCode = getCookie('promo');
    const savedPromo = findPromo(savedCode);
    if (savedPromo) {
        renderApplied(savedPromo);
    } else {
        renderDefault();
    }

    function deleteCookie(name) {
        document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/`;
    }

    resetBtn.addEventListener('click', () => {
        deleteCookie('promo');
        renderDefault();
        input.focus();
    });
});