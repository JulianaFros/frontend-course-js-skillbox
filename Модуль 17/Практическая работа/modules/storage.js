const KEY = "warehouseItems";

export function loadItems() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}

export function saveItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addItem(item) {
  const items = loadItems();
  items.push(item);
  saveItems(items);
  return item;
}

export function removeItem(id) {
  const items = loadItems().filter(i => i.id !== id);
  saveItems(items);
}

export function clearAll() {
  localStorage.removeItem(KEY);
}
