//Сортировка

const a = [2, 10, 1, 5, 9, 3, 6, 13, 16];
console.log([...a].sort((x, y) => x - y))
console.log([...a].sort((a,b) => (a%2)-(b%2) || a-b))

const b = ['Юля', 'аня', 'Борис', 'анастасия', 'иван']
console.log([...b].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())))
console.log([...b].sort((a, b) => a.length - b.length))

const users = [{ name: 'Юлия', age: 21 }, { name: 'анна', age: 15 }, { name: 'Борис', age: 30 }]
const sortbyName = [...users].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
const sortbyAge = [...users].sort((x,y)=> x.age - y.age)
console.log(sortbyAge)
console.log(sortbyName)

//Фильтрация

const num = [1,2,3,4,5,6,7,8,9,10]
const filnum = [...num].filter(n => n%2 == 0)
console.log(filnum)
const filb = [...b].filter(n => n.length >= 5)
console.log(filb)

const usersList = [{ name: 'Юля',   age: 21, city: 'Moscow' },
    { name: 'Борис', age: 30, city: 'Moscow ' },
    { name: 'аня',   age: 22, city: 'moscow' },
    { name: 'Иван',  age: 19, city: 'Moscow' },
    { name: 'Олег',  age: 25, city: 'Saint Petersburg' },
    { name: 'Лена',  age: 35, city: 'MOSCOW' },    
    { name: 'Катя',  age: 23, city: '  Moscow' }];

const filusersList = [...usersList].filter(n => n.age >= 21 && n.city.trim().toLocaleLowerCase() === 'moscow')
console.log(filusersList)