import { formatDateISOToRu } from "../modules/utils.js";

export function renderTable(state, onDelete, onSort) {
  const table = document.createElement("table");
  table.className = "table";

  const columns = [
    { key: "name",     title: "Название" },
    { key: "shelf",    title: "Полка" },
    { key: "weight",   title: "Вес" },
    { key: "storedAt", title: "Время хранения" },
  ];

  const head = document.createElement("thead");
  const trh = document.createElement("tr");

  for (const col of columns) {
    const th = document.createElement("th");
    th.dataset.sort = col.key;

    const wrap = document.createElement("span");
    wrap.className = "th-sort";
    wrap.textContent = col.title;

    if (state.sortKey === col.key) {
      const arrow = document.createElement("span");
      arrow.className = "sort-arrow";
      arrow.textContent = state.sortDir === "desc" ? "▼" : "▲";
      wrap.appendChild(arrow);
    }
    th.appendChild(wrap);
    trh.appendChild(th);
  }

  const thActions = document.createElement("th");
  trh.appendChild(thActions);

  head.appendChild(trh);

  head.addEventListener("click", (e) => {
    const th = e.target.closest("[data-sort]");
    if (!th) return;

    const key = th.dataset.sort;
    const nextDir =
      state.sortKey === key
        ? (state.sortDir === "asc" ? "desc" : "asc")
        : "asc";

    onSort(key, nextDir);
  });

  const body = document.createElement("tbody");
  for (const item of state.items) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.shelf}</td>
      <td>${item.weight}</td>
      <td>${formatDateISOToRu(item.storedAt)}</td>
      <td><button class="btn" data-id="${item.id}">Удалить</button></td>`;
    body.appendChild(tr);
  }

  body.addEventListener("click", (e) => {
    const id = e.target?.dataset?.id;
    if (!id) return;
    onDelete(id);
  });

  table.append(head, body);
  return table;
}

export function sortItems(items, key, dir = "asc") {
  const copy = [...items];
  const mul = dir === "desc" ? -1 : 1;

  copy.sort((a, b) => {
    let A = a[key];
    let B = b[key];

    if (key === "weight") {
      A = Number(A);
      B = Number(B);
      return (A - B) * mul;
    }

    if (key === "storedAt") {
      const tA = new Date(A).getTime();
      const tB = new Date(B).getTime();
      return (tA - tB) * mul;
    }

    return String(A).localeCompare(String(B), "ru") * mul;
  });

  return copy;
}
