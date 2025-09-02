const list = document.querySelector('.products');
const products = ["Мышка", "Клавиатура", "Наушники"];
products.push("Монитор", "Принтер", "Флешка");

list.innerHTML = '';
for (const name of products) {
    const li = document.createElement('li');
    li.textContent = name;
    list.append(li);
}