const cars = {
    mercedes: {
        name: "Mercedes",
        doors: 4,
        wheel: 4,
        hp: 220,
        isStarted: false,
    },
    bmw: {
        name: "BMW",
        doors: 4,
        wheel: 4,
        hp: 330,
        isStarted: false,
    },
    audi: {
        name: "AUDI",
        doors: 4,
        wheel: 4,
        hp: 267,
        isStarted: false,
    },
};

function getCar(nameCar) {
    const raw = String(nameCar ?? '').trim().toLowerCase();
    const key = Object.keys(cars).find(k => k.toLowerCase() === raw);
    if (key !== undefined) {
        console.log(cars[key]);
        return cars[key];
    }
    console.log('Авто не найдено');
    return 'Авто не найдено';
}