// ---------- ВСПОМОГАТЕЛЬНОЕ ----------

function randomDelay(minMs, maxMs) {
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function renderRow(title, urls) {
    const rows = document.getElementById("rows");
    const section = document.createElement("section");
    section.className = "row";
    section.innerHTML = `<h2 class="row__title">${title}</h2>`;
    const grid = document.createElement("div");
    grid.className = "grid";
    urls.forEach(src => {
        const img = document.createElement("img");
        img.className = "img";
        img.loading = "lazy";
        img.src = src;
        grid.appendChild(img);
    });
    section.appendChild(grid);
    rows.appendChild(section);
}

function createProgressUI(label) {
    const area = document.getElementById("progress-area");
    const wrap = document.createElement("div");
    wrap.className = "progress";

    const lbl = document.createElement("div");
    lbl.className = "progress__label";
    lbl.textContent = label;

    const track = document.createElement("div");
    track.className = "track";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.id = `bar-${Math.random().toString(36).slice(2)}`;

    const timer = document.createElement("div");
    timer.className = "timer";
    timer.id = `timer-${Math.random().toString(36).slice(2)}`;
    timer.textContent = "0 c";

    track.appendChild(bar);
    wrap.append(lbl, track, timer);
    area.appendChild(wrap);

    return { barId: bar.id, timerId: timer.id };
}

function progress(time, progressBarId, timerId) {
    const duration = Math.max(2, Number(time) || 0);
    const bar = document.getElementById(progressBarId);
    const timer = document.getElementById(timerId);

    bar.style.transform = "scaleX(0)";
    timer.textContent = "0 c";

    let activeRAF = null;
    let activeInterval = null;
    const start = performance.now();

    let shown = 0;
    activeInterval = setInterval(() => {
        shown += 1;
        if (shown <= duration) timer.textContent = `${shown} c`;
        if (shown >= duration) { clearInterval(activeInterval); activeInterval = null; }
    }, 1000);

    return new Promise((resolve) => {
        const tick = (now) => {
            const elapsed = (now - start) / 1000;
            const p = Math.min(elapsed / duration, 1);
            bar.style.transform = `scaleX(${p})`;

            if (p < 1) {
                activeRAF = requestAnimationFrame(tick);
            } else {
                bar.style.transform = "scaleX(1)";
                if (activeInterval) clearInterval(activeInterval);
                timer.textContent = `${duration} c`;
                activeRAF = null;
                resolve();
            }
        };
        activeRAF = requestAnimationFrame(tick);
    });
}


const CAT_URLS = [
    "./img/cat1.jpg",
    "./img/cat2.jpg",
    "./img/cat3.jpg",
];

const DOG_URLS = [
    "./img/dog1.jpg",
    "./img/dog2.jpg",
    "./img/dog3.jpg",
];

function fetchCats(durationMs) {
    return new Promise(resolve => {
        setTimeout(() => resolve(CAT_URLS), durationMs);
    });
}
function fetchDogs(durationMs) {
    return new Promise(resolve => {
        setTimeout(() => resolve(DOG_URLS), durationMs);
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    const catsTimeSec = randomDelay(2000, 5000) / 1000;
    const catsUI = createProgressUI("Загрузка котиков…");
    await Promise.all([
        progress(catsTimeSec, catsUI.barId, catsUI.timerId),
        fetchCats(catsTimeSec * 1000).then(urls => renderRow("Кошки", urls)),
    ]);

    const dogsTimeSec = randomDelay(2000, 5000) / 1000;
    const dogsUI = createProgressUI("Загрузка пёселей…");
    await Promise.all([
        progress(dogsTimeSec, dogsUI.barId, dogsUI.timerId),
        fetchDogs(dogsTimeSec * 1000).then(urls => renderRow("Собаки", urls)),
    ]);
});
