document.addEventListener('DOMContentLoaded', () => {
    const LS_KEY = 'app:movies';
    const SORT_KEY = 'app:sort';
    let movies = readJSON(LS_KEY, []);
    let editingId = null;
    let sortMode = localStorage.getItem(SORT_KEY) || 'title-asc';

    const form = document.getElementById('movie-form');
    const titleEl = document.getElementById('title');
    const genreEl = document.getElementById('genre');
    const yearEl = document.getElementById('year');
    const watchedEl = document.getElementById('watched');
    const errorEl = document.getElementById('form-error');

    const addBtn = document.getElementById('add-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    const sortSelect = document.getElementById('sort-select');
    const tbody = document.getElementById('movies-tbody');

    sortSelect.value = sortMode;

    function readJSON(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function uid() {
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    function escapeHtml(s) {
        return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function validateForm(fields) {
        const now = new Date().getFullYear();
        const minYear = 1895;

        [titleEl, genreEl, yearEl].forEach(el => el.removeAttribute('aria-invalid'));
        errorEl.textContent = '';

        if (!fields.title) {
            titleEl.setAttribute('aria-invalid', 'true');
            errorEl.textContent = 'Введите название фильма.';
            return false;
        }

        if (!fields.genre) {
            genreEl.setAttribute('aria-invalid', 'true');
            errorEl.textContent = 'Введите жанр.';
            return false;
        }

        if (!fields.yearRaw) {
            yearEl.setAttribute('aria-invalid', 'true');
            errorEl.textContent = 'Введите год.';
            return false;
        }

        const year = Number.parseInt(fields.yearRaw, 10);
        if (Number.isNaN(year) || year < minYear || year > now) {
            yearEl.setAttribute('aria-invalid', 'true');
            errorEl.textContent = `Год должен быть числом в диапазоне ${minYear}-${now}.`;
            return false;
        }
        return true;
    }

    function renderTable() {
        const data = sortMovies([...movies], sortMode);
        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="5" style="color:#9fb0d1">Список пуст</td></tr>`;
            return;
        }

        const rows = data.map(m => `
            <tr data-id="${m.id}">
              <td>${escapeHtml(m.title)}</td>
              <td>${escapeHtml(m.genre)}</td>
              <td>${m.year}</td>
              <td>${m.watched
                ? '<span class="badge badge--yes">Да</span>'
                : '<span class="badge badge--no">Нет</span>'
            }</td>
              <td>
                <button class="action action--edit" data-action="edit">Редактировать</button>
                <button class="action action--del"  data-action="del">Удалить</button>
              </td>
            </tr>
          `).join('');
        tbody.innerHTML = rows;
    }

    function sortMovies(arr, mode) {
        const byText = (a, b, key, dir = 1) =>
            a[key].localeCompare(b[key], 'ru', { sensitivity: 'base' }) * dir;
        const byNum = (a, b, key, dir = 1) => (a[key] - b[key]) * dir;

        switch (mode) {
            case 'title-asc': return arr.sort((a, b) => byText(a, b, 'title', 1));
            case 'title-desc': return arr.sort((a, b) => byText(a, b, 'title', -1));
            case 'genre-asc': return arr.sort((a, b) => byText(a, b, 'genre', 1));
            case 'year-asc': return arr.sort((a, b) => byNum(a, b, 'year', 1));
            case 'year-desc': return arr.sort((a, b) => byNum(a, b, 'year', -1));
            case 'watched-first': return arr.sort((a, b) => (b.watched - a.watched));
            case 'watched-last': return arr.sort((a, b) => (a.watched - b.watched));
            default: return arr;
        }
    }

    function getFormFields() {
        return {
            title: (titleEl.value || '').trim(),
            genre: (genreEl.value || '').trim(),
            yearRaw: (yearEl.value || '').trim(),
            watched: !!watchedEl.checked,
        };
    }

    function resetForm() {
        form.reset();
        errorEl.textContent = '';
        [titleEl, genreEl, yearEl].forEach(el => el.removeAttribute('aria-invalid'));
        editingId = null;
        addBtn.hidden = false;
        saveBtn.hidden = true;
        cancelBtn.hidden = true;
    }

    function fillForm(movie) {
        titleEl.value = movie.title;
        genreEl.value = movie.genre;
        yearEl.value = movie.year;
        watchedEl.checked = !!movie.watched;
    }

    function addMovie() {
        const fields = getFormFields();
        if (!validateForm(fields)) return;

        const movie = {
            id: uid(),
            title: fields.title,
            genre: fields.genre,
            year: Number.parseInt(fields.yearRaw, 10),
            watched: fields.watched,
        };
        movies.push(movie);
        writeJSON(LS_KEY, movies);
        renderTable();
        resetForm();
    }

    function startEdit(id) {
        const movie = movies.find(m => m.id === id);
        if (!movie) return;
        editingId = id;
        fillForm(movie);
        addBtn.hidden = true;
        saveBtn.hidden = false;
        cancelBtn.hidden = false;
        errorEl.textContent = '';
    }

    function saveEdit() {
        if (!editingId) return;
        const fields = getFormFields();
        if (!validateForm(fields)) return;

        const idx = movies.findIndex(m => m.id === editingId);
        if (idx === -1) return;

        movies[idx] = {
            ...movies[idx],
            title: fields.title,
            genre: fields.genre,
            year: Number.parseInt(fields.yearRaw, 10),
            watched: fields.watched,
        };

        writeJSON(LS_KEY, movies);
        renderTable();
        resetForm();
    }

    function deleteMovie(id) {
        const idx = movies.findIndex(m => m.id === id);
        if (idx === -1) return;
        if(!confirm('Удалить этот фильм?')) return;

        movies.splice(idx, 1);
        writeJSON(LS_KEY, movies);
        renderTable();

        if (editingId === id) resetForm();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (editingId) return;
        addMovie();
    });

    saveBtn.addEventListener('click', saveEdit);
    cancelBtn.addEventListener('click', resetForm);

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const tr = btn.closest('tr');
        const id = tr && tr.dataset ? tr.dataset.id : null;
        if(!id) return;

        if (btn.dataset.action === 'edit') startEdit(id);
        if (btn.dataset.action === 'del') deleteMovie(id);
    });

    sortSelect.addEventListener('change', () => {
        sortMode = sortSelect.value;
        localStorage.setItem(SORT_KEY, sortMode);
        renderTable();
    });

    renderTable();
});