import readline from 'readline';
import fs from 'fs/promises';
import chalk from 'chalk';
import { Writable } from 'stream';

const mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding);
    } else {
      const char = chunk.toString();
      if (char !== '\n' && char !== '\r' && char !== '\r\n') {
        process.stdout.write('*');
      }
    }
    callback();
  }
});

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

async function askPassword(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
            console.log();
            mutableStdout.muted = false;
        });
        mutableStdout.muted = true;
    });
}

async function saveUsers() {
  await fs.writeFile('./users.json', JSON.stringify(users, null, 2));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

async function startMenu() {
  while(true) {
    console.log(chalk.blue.bold('--- Guessing Game ---'));
    console.log(chalk.yellow('1. Login'));
    console.log(chalk.yellow('2. Register'));
    console.log(chalk.yellow('3. Keluar'));

    const choice = await ask(chalk.magenta('Pilih opsi: '));

    switch(choice) {
        case '1': await login(); 
            break;
        case '2': await register(); 
            break;
        case '3': 
            console.log(chalk.green('Goodbye!'));
            rl.close();
            return;
        default: 
            console.log(chalk.red('Invalid choice. Please try again.'));
    }
  }
}

async function register() {
  console.clear();
  console.log(chalk.blue.bold('--- Register ---'));

  const username = await ask(chalk.yellow('Choose a Username: '));
  const password = await askPassword(chalk.yellow('Choose a Password: '));

  if (users.find(u => u.username === username)) {
    console.log(chalk.red('Username already exist'));
    return;
  }

  users.push({
    username: username,
    password: password,
    highestScore: null
  });
  await saveUsers();
  console.log(chalk.green(`Selamat! ${username} telah terdaftar!`));
}

async function login() {
  console.clear();
  console.log(chalk.blue.bold('--- Login ---'));

  const username = await ask(chalk.yellow('Username: '));
  const password = await askPassword(chalk.yellow('Password: '));

  if (users.find(u => u.username === username && u.password === password)) {
    console.log(chalk.green(`Login berhasil!, halo ${username} siap bermain!`));
    currentUser = username;
    await mainMenu();
  } else {
    console.log(chalk.red('Invalid username or password!'));
  }
}

async function mainMenu() {
  console.log(chalk.blue.bold('--- Main Menu ---'));
  console.log(chalk.yellow('1. Mulai Game'));
  console.log(chalk.yellow('2. Lihat Papan Skor'));
  console.log(chalk.yellow('3. Logout'));

  const choice = await ask(chalk.yellow('Pilih opsi: '));
  switch(choice) {
    case '1': await playGame();
      break;
    case '2': await showLeaderboard();
      break;
    case '3': await startMenu();
      break;
    default:
      console.log(chalk.red('Invalid choice!'));
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
      console.log(chalk.green(`Selamat!, Anda menebak dengan benar dalam ${attemp}x percobaan!`));
      break;
    }
  }

  const userIndex = users.findIndex(u => u.username === currentUser);
    if (!users[userIndex].highestScore || users[userIndex].highestScore > attemp) {
      users[userIndex].highestScore = attemp;
      await saveUsers();
      console.log(chalk.green('Ini adalah skor tertinggi baru Anda!'));
    }
}

async function showLeaderboard() {
  console.clear();
  console.log(chalk.blue.bold('--- Papan Skor (Top 10) ---'));

  const usersPlayAndSort = users.filter(u => u.highestScore !== null).sort((a, b) => a.highestScore - b.highestScore);
  if (usersPlayAndSort.length === 0) {
    console.log(chalk.red('Belum ada player yang memainkan game.'));
    return;
  }
  
  for (let i = 0; i < usersPlayAndSort.length; i++) {
    if (i === 9) break;
    console.log(chalk.white(`${i + 1}. ${usersPlayAndSort[i].username}: ${usersPlayAndSort[i].highestScore} percobaan`));
  }
}

async function main() {
  await loadUsers();
  startMenu();
}

main();