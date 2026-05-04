import readline from 'readline';
import fs from 'fs/promises';
import chalk from 'chalk';

let users = [];
let currentUser = null;

async function loadUsers() {
  try {
    const data = await fs.readFile('./users.json', 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    console.log(chalk.red('Tidak ada file users.json, akan dibuat file baru'));
  }
}

async function ask(query) {
  return new Promise((resolve) => {
    rl.question(query, answer => resolve(answer));
  });
}

async function saveUsers() {
  await fs.writeFile('./users.json', JSON.stringify(users, null, 2));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function startMenu() {
  console.log(chalk.blue.bold('--- Guessing Game ---'));
  console.log(chalk.yellow('1. Login'));
  console.log(chalk.yellow('2. Register'));
  console.log(chalk.yellow('3. Keluar'));

  rl.question(chalk.magenta('Pilih opsi: '), (choice) => {
    switch(choice) {
      case '1': login(); 
        break;
      case '2': register(); 
        break;
      case '3': 
        console.log(chalk.green('Goodbye!'));
        rl.close();
        break;
      default: 
        console.log(chalk.red('Invalid choice. Please try again.'));
        rl.question(chalk.magenta('Apakah kamu ingin mencoba lagi? (Y/n): '), (answer) => {
          const jawaban = answer.trim().toLowerCase();
          if (jawaban === 'y' || jawaban === '') {
            startMenu();
          } else if (jawaban === 'n') {
              console.log(chalk.green('Baiklah, program dihentikan, Goodbye!'));
              rl.close();
          } else {
              console.log(chalk.red('Input tidak dikenali. Mengembalikan ke menu utama...'));
              setTimeout(() => startMenu(), 1500);
          }
        });
    }
  });
}

async function register() {
  console.clear();
  console.log(chalk.blue.bold('--- Register ---'));

  const username = await ask(chalk.yellow('Choose a Username: '));
  const password = await ask(chalk.yellow('Choose a Password: '));

  if (users.find(u => u.username === username)) {
    console.log(chalk.red('Username already exist'));
    return startMenu();
  }

  users.push({
    username: username,
    password: password,
    highestScore: null
  });
  await saveUsers();
  console.log(chalk.green(`Selamat! ${username} telah terdaftar!`));
  return startMenu();
}

async function login() {
  console.clear();
  console.log(chalk.blue.bold('--- Login ---'));

  const username = await ask(chalk.yellow('Username: '));
  const password = await ask(chalk.yellow('Password: '));

  if (users.find(u => u.username === username && u.password === password)) {
    console.log(chalk.green(`Login berhasil!, halo ${username} siap bermain!`));
    currentUser = username;
    return mainMenu();
  } else {
    console.log(chalk.red('Invalid username or password!'));
    return startMenu();
  }
}

async function mainMenu() {
  console.log(chalk.blue.bold('--- Main Menu ---'));
  console.log(chalk.yellow('1. Mulai Game'));
  console.log(chalk.yellow('2. Lihat Papan Skor'));
  console.log(chalk.yellow('3. Logout'));

  const choice = await ask(chalk.yellow('Pilih opsi: '));
  switch(choice) {
    case '1': playGame();
      break;
    case '2': showLeaderboard();
      break;
    case '3': startMenu();
      break;
    default:
      console.log(chalk.red('Invalid choice!'));
      return startMenu();
  }
}

async function playGame() {
  console.clear();
  console.log(chalk.blue.bold('--- Tebak Angka ---'));
  console.log(chalk.white('Tebak angka antara 1 dan 100'));

  const randomNumber = Math.floor(Math.random() * 100) + 1;
  let attemp = 0;

  while (true) {
    const answer = await ask(chalk.blueBright('Tebakan Anda: '));
    const konversiJawaban = parseInt(answer, 10);
    if (isNaN(konversiJawaban)) {
      console.log(chalk.red('Hanya masukan angka!, coba lagi.'));
      continue;
    }
    attemp++;
    if (konversiJawaban < randomNumber) {
      console.log(chalk.yellow('Terlalu rendah!'));
    } else if (konversiJawaban > randomNumber) {
      console.log(chalk.yellow('Terlalu tinggi!'));
    } else {
      console.log(chalk.green(`Selamat!, Anda menebak dengan benar dalam ${attemp} percobaan!`));
      break;
    }
  }

  const index = users.findIndex(u => u.username === currentUser);
  if (!users[index].highestScore || users[index].highestScore > attemp) {
    users[index].highestScore = attemp;
    await saveUsers();
    console.log(chalk.green('Ini adalah skor tertinggi baru Anda!'));
  } 
  startMenu();
}

async function showLeaderboard() {
  console.clear();
  console.log(chalk.blue.bold('--- Papan Skor (Top 10) ---'));

  const usersPlayAndSort = users.filter(u => u.highestScore !== null).sort((a, b) => a.highestScore - b.highestScore);
  
  for (let i = 0; i < usersPlayAndSort.length; i++) {
    if (i === 9) break;
    console.log(chalk.white(`${i + 1}. ${usersPlayAndSort[i].username}: ${usersPlayAndSort[i].highestScore} percobaan`));
  }
  startMenu();
}

async function main() {
  await loadUsers();
  startMenu();
}

main();
