const list = document.querySelector('.list');
const addBtn = document.querySelector('.add-btn');
const filterBtn = document.querySelector('.filter-btn');

const heights = [164, 157, 153, 170, 175];

function render(view = heights) {
    list.innerHTML = '';
    for (const n of view) {
        const li = document.createElement('li');
        li.textContent = n;
        list.append(li);
    }
}
render();

addBtn.addEventListener('click', () => {
    const input = prompt('Введите рост (см)');

    if (input === null) return;
    const s = input.trim();
    if (s === '') {
        alert('Рост не введен!');
        return;
    }

    const n = Number(s);
    if (!Number.isFinite(n)) {
        alert('Введите число');
        return;
    }

    heights.push(n);
    render();
})

filterBtn.addEventListener('click', () => {
    const input = prompt('Минимальный рост (см)');

    if (input === null) {
        render();
        return;
    }

    const s = input.trim();
    if (s === '') {
        render();
        return;
    }

    const min = Number(s);
    if (!Number.isFinite(min)) {
        alert('Введите число');
        render();
        return;
    }

    const view = heights.filter(h => h >= min);
    render(view);
})