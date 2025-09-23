import { renderLoading } from "../components/loading.js";

const routes = {
    "#/list": () => import("../pages/list.js"),
    "#/add": () => import("../pages/add.js"),
};

const app = document.getElementById("app");

function navigate(hash) {
    if (location.hash !== hash) location.hash = hash;
    else handleRoute();
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("DOMContentLoaded", handleRoute);

async function handleRoute() {
    const hash = location.hash || "#/list";
    app.innerHTML = "";
    app.append(renderLoading());

    const loaderFn = routes[hash] ?? routes["#/list"];

    try {
        const mod = await loaderFn();
        app.innerHTML = "";
        if (hash === "#/add") mod.default(app, navigate);
        else mod.default(app);
    } catch (e) {
        app.innerHTML = `<div class="card"><h1>Ошибка</h1><p class="help">${e?.message ?? e}</p></div>`;
    }
}

export { navigate };
