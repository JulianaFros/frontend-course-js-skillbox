function sanitize(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.textContent;
}

let user;

const FILMS_REQUEST_TIMEOUT = 1000;

function setUser(userData) {
  user = userData;
}

function getUser() {
  return user;
}

async function getFilms() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FILMS_REQUEST_TIMEOUT);

  try {
    const user = getUser();
    const response = await fetch("https://sb-film.skillbox.cc/films", {
      headers: {
        email: user?.email
      },
      signal: controller.signal
    });

    const data = await response.json();

    if (!response.ok) {
      handleErrorResponse(data);
    }

    return data;
  } catch (error) {
    handleError(error);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

function handleErrorResponse(data) {
  const isNeedAuth = data.errors.some(error => error.location === 'headers' && error.param === 'email');

  if (isNeedAuth) {
    const err = new Error('Не передан email');
    err.name = 'AuthError';
    throw err;
  }
}

function handleError(error) {
  if (error.name === 'AuthError') {
    throw error;
  }

  if (error.name === 'AbortError') {
    try {
      setNetMessage('offline');
    } catch (e) {
    }

    const err = new Error('Проблемы с сетью');
    err.name = 'NetworkError';
    throw err;
  }

  console.error(error);
}

function renderTopBar(user) {
  const el = document.createElement('div');
  el.classList.add('topbar');

  el.innerHTML = `
    <span class="topbar-logo">Фильмотека</span>
    <div class="topbar-user user">
      <div class="user-name">${sanitize(user.name)}</div>
      <div class="user-email">${sanitize(user.email)}</div>
    </div>
  `;

  return el;
}

function renderFilms(films) {
  const el = document.createElement('div');
  el.classList.add('films');

  if (films.length === 0) {
    el.innerText = 'Список фильмов пока пуст';
    return el;
  }

  films.forEach((film) => {
    const filmEl = document.createElement('div');
    filmEl.classList.add('films-card');
    filmEl.dataset.watched = film.isWatched;

    filmEl.textContent = `${film.title} (${film.releaseYear})`;

    el.append(filmEl);
  });

  return el;
}

function renderGlobalError(message) {
  const el = document.createElement('div');

  el.innerHTML = `
    <div class="error">
      <div class="error-title">Упс... что-то пошло не так</div>
      <div class="error-message">${sanitize(message)}</div>
    </div>
  `;

  return el;
}

function renderAuthForm(props) {
  const form = document.createElement('form');
  form.classList.add('authForm')

  form.innerHTML = `
    <label for="name">Ваше имя</label>
    <input id="name" type="text" name="name" required="true" placeholder="Иван Иванов" />
    <label for="email">Эл. почта</label>
    <input id="email" type="text" name="email" required="true" placeholder="example@mail.com" />
    <button class="authForm-submit" type="submit">Войти</button>
  `;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);

    props.onSubmit(formProps);
  });

  return form;
}

function initAuth() {
  const app = document.getElementById("app");
  app.innerHTML = '';

  app.append(renderAuthForm({
    onSubmit: (user) => {
      setUser(user);
      initApp();
    }
  }));
}

async function initApp() {
  const app = document.getElementById("app");
  app.innerHTML = '';

  try {
    const user = getUser();
    if (!user) {
      initAuth();
      return;
    }
    const films = await getFilms();
    app.append(renderTopBar(user));
    app.append(renderFilms(films));
  } catch (error) {
    console.error(error);

    if (error.name === 'AuthError') {
      initAuth();
      return;
    }

    app.append(renderGlobalError(error.message));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  startNetMonitor();
});

const PING_URL = 'https://sb-film.skillbox.cc/ping';
const POLL_EVERY = 5000;
const SLOW_THRESHOLD = 500;
const REQUEST_TIMEOUT = 1000;

let netBox = null;
let lastNetState = 'ok';
let netTimer = null;

function setNetMessage(type) {
  if (!netBox) {
    netBox = document.getElementById('net-status');
    if (!netBox) return;
  }

  netBox.classList.remove('net-status--offline', 'net-status--slow');
  if (type === 'offline') {
    netBox.textContent = 'Соединение с интернетом потеряно';
    netBox.classList.add('net-status--offline');
    netBox.hidden = false;
  } else if (type === 'slow') {
    netBox.textContent = 'Соединение с интернетом нестабильно';
    netBox.classList.add('net-status--slow');
    netBox.hidden = false;
  } else {
    netBox.hidden = true;
  }
}

async function pingOnce() {
  const controller = new AbortController();
  const t0 = performance.now();
  const killer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const res = await fetch(PING_URL, { method: 'POST', signal: controller.signal });
    clearTimeout(killer);

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const dt = performance.now() - t0;

    if (dt > SLOW_THRESHOLD) {
      if (lastNetState !== 'slow') {
        setNetMessage('slow');
        lastNetState = 'slow';
      }
    } else {
      if (lastNetState !== 'ok') {
        setNetMessage('ok');
        lastNetState = 'ok';
      }
    }
  } catch (err) {
    clearTimeout(killer);
    if (lastNetState !== 'offline') {
      setNetMessage('offline');
      lastNetState = 'offline';
    }
  }
}

function startNetMonitor() {
  if (!netBox) netBox = document.getElementById('net-status');

  pingOnce();

  if (netTimer) clearInterval(netTimer);
  netTimer = setInterval(pingOnce, POLL_EVERY);

  window.addEventListener('online',  () => { lastNetState = 'ok'; setNetMessage('ok'); });
  window.addEventListener('offline', () => { lastNetState = 'offline'; setNetMessage('offline'); });
}

