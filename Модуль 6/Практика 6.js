const nums = [10, 20, 30, 40];
nums.push(40);
nums.unshift(5);
nums.pop();
nums.shift();

let sum = 0;
for (let i = 0; i < nums.length; i++) {
    sum = sum + nums[i];
}
console.log('sum = ', sum);

let sum2 = 0;
for (const n of nums) {
    sum2 += n;
}
console.log('sum2 =', sum2);

let even = 0;
for (const n of nums) {
    if (n % 2 === 0) even++;
}
console.log('even =', even);

let k = 5;
while (k > 0) {
    console.log(k);
    k = k - 1;
}

let input;
do {
    input = prompt('Введите не пустую строку');
} while (input !== null && input.trim() === '');
console.log('Получили: ', input);

const data = [3, 11, 7, 15, 2];
const result = [];

for (const x of data) {
    if (x >= 10) {
        result.push(x);
    }
}
console.log(result);