import { addItem } from "../modules/storage.js";
import { uid, qs } from "../modules/utils.js";

export default function renderAddPage(root, navigate) {
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML = `
    <h1>Добавить запись</h1>
    <form class="stack" id="form">
      <input class="input" name="name"     placeholder="Название" />
      <input class="input" name="shelf"    placeholder="Полка" />
      <input class="input" name="weight"   placeholder="Вес" type="number" step="0.01" />
      <input class="input" name="storedAt" placeholder="дд.мм.гггг" type="date" />
      <button class="btn" type="submit">Добавить запись</button>
      <p class="help" id="errors"></p>
    </form>
  `;
    root.append(card);

    const form = qs("#form", card);
    const errors = qs("#errors", card);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errors.textContent = "";

        const fd = new FormData(form);
        const name = fd.get("name")?.toString().trim();
        const shelf = fd.get("shelf")?.toString().trim();
        const weight = Number(fd.get("weight"));
        const storedAt = fd.get("storedAt")?.toString();

        const err = validate({ name, shelf, weight, storedAt });
        if (err) { errors.textContent = err; return; }

        addItem({ id: uid(), name, shelf, weight, storedAt });
        navigate("#/list");
    });

    function validate({ name, shelf, weight, storedAt }) {
        if (!name) return "Введите название.";
        if (!shelf) return "Введите полку.";
        if (!Number.isFinite(weight) || weight <= 0) return "Вес должен быть положительным числом.";
        if (!storedAt) return "Укажите дату.";
        return "";
    }
}
