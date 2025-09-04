const list = document.querySelector('.list');
const addBtn = document.querySelector('.add-btn');

const items = ['Яблоко', 'Груша', 'Арбуз', 'Апельсин', 'Клубника', 'Лимон', 'Огурец'];

const byRu = (a, b) => a.localeCompare(b, 'ru', { sensitvity: 'base'});

function render() {
    list.innerHTML = '';

    view = [...items].sort(byRu);

    for (const title of view) {
        const li = document.createElement('li');
        li.textContent = title;
        list.append(li);
    }
}
render();

addBtn.addEventListener('click', () => {
    const input = prompt('Введите название товара');

    if (input === null) return;
    const s = input.trim();
    if (s === '') {
        alert('Название товара не введено!');
        return;
    }

    const exists = items.some(b => b.toLowerCase() === s.toLowerCase());
    if (exists) {
        alert('Такой товар уже есть');
    }

    items.push(s);
    render();
})