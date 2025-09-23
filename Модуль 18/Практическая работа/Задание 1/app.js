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

function fetchCats() {
  return new Promise(res => setTimeout(() => res(CAT_URLS), randomDelay(2000, 5000)));
}
function fetchDogs() {
  return new Promise(res => setTimeout(() => res(DOG_URLS), randomDelay(2000, 5000)));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCats().then(urls => renderRow("Кошки", urls));
  fetchDogs().then(urls => renderRow("Собаки", urls));
});