const pAll = document.querySelector('.all-elements');
const numbers = [1, 24, 16, 9, 72, 45];
const btnmin = document.querySelector('.min');
const btnmax = document.querySelector('.max');
const outmin = document.querySelector('.minNumber');
const outmax = document.querySelector('.maxNumber');

pAll.textContent = numbers.join(', ');

let min = numbers[0];
let max = numbers[0];

for (const n of numbers) {
    if (n < min) min = n;
    if (n > max) max = n;
}

btnmin.addEventListener('click', () => { outmin.textContent = String(min)});
btnmax.addEventListener('click', () => { outmax.textContent = String(max)});