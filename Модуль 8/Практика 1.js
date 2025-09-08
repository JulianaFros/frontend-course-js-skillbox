function sportUsersOver25(users) {
    return users
      .filter(([name, age, sporty]) => age > 25 && sporty === true)
      .sort((a, b) => a[1] - b[1])
      .map(([name]) => name);
  }
  
  const users = [
    ["Alice", 25, true],
    ["Bob", 30, false],
    ["Charlie", 22, true],
    ["David", 27, true],
    ["Eve", 20, false]
  ];
  
    console.log(sportUsersOver25(users));
  
