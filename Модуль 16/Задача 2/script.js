function greeting() {
  const username = prompt("Введите имя пользователя");

  if (username === null || username.trim() === "") {
    throw new Error("Имя обязательно для заполнения");
  }
  console.log(`Привет, ${username.trim()}!`);
}

try {
  greeting();
} catch (error) {
  alert(error.message);
}
