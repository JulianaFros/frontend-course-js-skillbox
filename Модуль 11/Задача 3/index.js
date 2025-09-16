document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('cardInput');
    const select = document.getElementById('colorSelect');
    const card = document.getElementById('card');

    const colors = {
        red: '#ef4444',
        blue: '#2563eb',
        green: '#16a34a',
    };

    input.addEventListener('input', () => {
        const text = input.value.trim();
        card.textContent = text || 'Ваша карта';
    });

    input.addEventListener('focus', () => {
        input.classList.add('is-focused');
    });

    input.addEventListener('blur', () => {
        input.classList.remove('is-focused');
    });

    select.addEventListener('change', () => {
        const val = select.value;
        card.style.backgroundColor = colors[val] || colors.blue;
    });

    card.style.backgroundColor = colors[select.value] || colors.blue;
});