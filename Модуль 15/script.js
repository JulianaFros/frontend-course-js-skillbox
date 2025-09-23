const BASE_URL = "https://sb-film.skillbox.cc";
const EMAIL = "ovikdevil@gmail.com";

let filmsState = [];
const filters = { q: "", genre: "", year: "", watched: null };
let editingId = null;

function validateFilm({ title, genre, releaseYear }) {
  const now = new Date().getFullYear();
  const minYear = 1895;
  if (!title?.trim()) return "Введите название.";
  if (!genre?.trim()) return "Введите жанр.";
  const y = Number.parseInt(releaseYear, 10);
  if (Number.isNaN(y) || y < minYear || y > now) {
    return `Год должен быть числом в диапазоне ${minYear}–${now}.`;
  }
  return "";
}


function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const genre = document.getElementById("genre").value.trim();
  const releaseYear = document.getElementById("releaseYear").value.trim();
  const isWatched = document.getElementById("isWatched").checked;

  const film = { title, genre, releaseYear, isWatched };

  const err = validateFilm(film);
  if (err) {
    alert(err);
    return;
  }

  addFilm(film);
}


async function addFilm(film) {
  await fetch(`${BASE_URL}/films`, {
    method: "POST",
    headers: { "Content-Type": "application/json", email: EMAIL },
    body: JSON.stringify(film),
  });
  await loadFilms();
  renderTable();
  document.getElementById("film-form").reset();
}

async function updateFilm(id, film) {
  if (!id) {
    console.error("updateFilm: пустой id, обновление невозможно", id, film);
    return;
  }
  const url = `${BASE_URL}/films/${encodeURIComponent(id)}`;
  console.debug("PUT", url, "body:", film);
  console.debug("filmsState ids:", filmsState.map(f => getId(f)));
  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", email: EMAIL },
    body: JSON.stringify(film),
  });
  await loadFilms();
  renderTable();
  document.getElementById("film-form").reset();
}

async function loadFilms() {
  const res = await fetch(`${BASE_URL}/films`, { headers: { email: EMAIL } });
  const list = await res.json();
  filmsState = Array.isArray(list) ? list : [];
}

function renderTable() {
  const tbody = document.getElementById("film-tbody");
  tbody.innerHTML = "";

  let view = [...filmsState];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    view = view.filter(f => (f.title || "").toLowerCase().includes(q));
  }
  if (filters.genre) {
    const g = filters.genre.toLowerCase();
    view = view.filter(f => (f.genre || "").toLowerCase().includes(g));
  }
  if (filters.year) {
    view = view.filter(f => String(f.releaseYear) === String(filters.year));
  }
  if (typeof filters.watched === "boolean") {
    view = view.filter(f => !!f.isWatched === filters.watched);
  }

  if (!view.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#777">Список пуст</td></tr>`;
    return;
  }

  view.forEach((film) => {
    const id = getId(film);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(film.title || "")}</td>
      <td>${escapeHtml(film.genre || "")}</td>
      <td>${escapeHtml(film.releaseYear ?? "")}</td>
      <td>${film.isWatched ? "Да" : "Нет"}</td>
      <td>
        <!-- Кнопка редактирования удалена -->
        <button class="row-del"  data-id="${id}">Удалить</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getId(filmOrId) {
  if (!filmOrId && filmOrId !== 0) return "";
  if (typeof filmOrId === "string" || typeof filmOrId === "number") return String(filmOrId);
  return String(filmOrId._id ?? filmOrId.id ?? "");
}


document
  .getElementById("film-form")
  .addEventListener("submit", handleFormSubmit);

renderTable();

async function deleteFilm(id) {
  await fetch(`${BASE_URL}/films/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { email: EMAIL },
  });
  await loadFilms();
  renderTable();
}

async function deleteAllFilms() {
  if (!filmsState.length) return;
  if (!confirm("Точно удалить ВСЕ фильмы?")) return;

  for (const f of filmsState) {
    const id = f.id ?? f._id ?? null;
    if (id) await deleteFilm(id);
  }
}

document.getElementById("film-tbody").addEventListener("click", (e) => {
  const delBtn = e.target.closest(".row-del");
  if (delBtn) {
    const id = delBtn.dataset.id;
    if (id && confirm("Удалить этот фильм?")) deleteFilm(id);
  }
});

document.getElementById("delete-all").addEventListener("click", deleteAllFilms);

const filtersForm = document.getElementById("filters");
const qEl = document.getElementById("f-q");
const genreEl = document.getElementById("f-genre");
const yearEl = document.getElementById("f-year");
const watchedEl = document.getElementById("f-watched");
const resetBtn = document.getElementById("f-reset");

filtersForm.addEventListener("submit", (e) => {
  e.preventDefault();
  filters.q = (qEl.value || "").trim();
  filters.genre = (genreEl.value || "").trim();
  filters.year = (yearEl.value || "").trim();
  const w = watchedEl.value;
  filters.watched = w === "" ? null : w === "true";
  renderTable();
});

resetBtn.addEventListener("click", () => {
  qEl.value = "";
  genreEl.value = "";
  yearEl.value = "";
  watchedEl.value = "";
  filters.q = filters.genre = filters.year = "";
  filters.watched = null;
  renderTable();
});

loadFilms().then(renderTable);