export function renderLoading() {
    const wrap = document.createElement("div");
    wrap.className = "card center";
    wrap.innerHTML = `<div class="help">Загрузка…</div>`;
    return wrap;
}
