const list = document.querySelector('.list');
const searchBtn = document.querySelector('.search-btn');
const addBtn = document.querySelector('.add-btn');

const books = ['Мастер и Маргарита', 'Война и мир', '1984'];
let highlighted = null;

function render(view = books) {
    list.innerHTML = '';
    for (const title of view) {
        const li = document.createElement('li');
        li.textContent = title;
        if (highlighted && title.toLowerCase() === highlighted.toLowerCase()) {
            li.classList.add('highlight');
        }
        list.append(li);
    }
}
render();

addBtn.addEventListener('click', () => {
    const input = prompt('Введите название книги');
    
    if (input === null) return;
    const title = input.trim();
    if (title === '') {
        alert('Название книги не введено!');
        return;
    }
    
    const exists = books.some(b => b.toLowerCase() === title.toLowerCase());
    if (exists) {
        alert('Такая книга уже есть');
        return;
    }

    books.push(title);
    highlighted = null;
    render();
});

searchBtn.addEventListener('click', () => {
    const input = prompt('Введите название для поиска');

    if (input === null) return;
    const q = input.trim();
    if (q === '') {
        alert('Название книги не введено!');
        return;
    }

    const found = books.find(b => b.toLowerCase() === q.toLowerCase());
    if (!found) {
        alert('Книга не найдена!');
        highlighted = null;
        render();
        return;
    }

    highlighted = found;
    render();
})