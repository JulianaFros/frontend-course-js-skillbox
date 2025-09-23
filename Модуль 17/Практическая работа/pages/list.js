import { loadItems, removeItem } from "../modules/storage.js";
import { renderTable, sortItems } from "../components/table.js";
import { qs } from "../modules/utils.js";

export default function renderListPage(root) {
  const state = {
    items: loadItems(),
    sortKey: "name",
    sortDir: "asc",
  };

  const card = document.createElement("section");
  card.className = "card";
  card.innerHTML = `
    <h1>Склад</h1>
    <p class="help">Клик по названию колонки — сортировка, повторный клик меняет направление.</p>
    <div id="table-slot"></div>
  `;
  root.append(card);

  const slot = qs("#table-slot", card);
  mountTable();

  function mountTable() {
    slot.innerHTML = "";
    slot.append(renderTable(state, handleDelete, handleSort));
  }

  function handleDelete(id) {
    removeItem(id);
    state.items = loadItems();
    state.items = sortItems(state.items, state.sortKey, state.sortDir);
    mountTable();
  }

  function handleSort(key, dir) {
    state.sortKey = key;
    state.sortDir = dir;
    state.items = sortItems(state.items, key, dir);
    mountTable();
  }
}
