function hello() {
  console.log('Skill');
}

try {
  hello();
} catch (err) {
  console.error('Ошибка в hello():', err);
  throw err;
} finally {
  console.log('complete');
}