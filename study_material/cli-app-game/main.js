import readline from 'readline';
import fs from 'fs/promises';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let users = [];
let currentUser = null;

// Baca data pengguna dari file JSON
async function loadUsers() {
  try {
    const data = await fs.readFile('users.json', 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    console.log('Tidak ada file users.json. Akan dibuat file baru.');
  }
}

async function saveUsers() {
  await fs.writeFile('users.json', JSON.stringify(users, null, 2));
}

function question(query, callback) {
  rl.question(query, (answer) => {
    callback(answer);
  });
}

async function login() {
  console.clear();

  const users = await loadUsers();

  question(chalk.yellow('Username: '), (username) => {
    question(chalk.yellow('Password: '), (password) => {
      let user = users.find(u => u.username === username && u.password === password);
      if (user) {
        console.log(chalk.green('Login successfull!'));
        console.log(chalk.cyan(`Welcome ${username}`));
        currentUser = username;
        setTimeout(() => mainMenu(), 1500);
      } else {
        console.log(chalk.red('Invalid username or password'));
        setTimeout(() => startMenu(), 1500);
      }
    });
  });
}

async function register() {
  console.clear();
  const users = await loadUsers();
  console.log(chalk.blue.bold('--- Register ---'));
  question(chalk.yellow('Chose Username: '), (username) => {
    const user = users.find(u => u.username);
    if (!user) {
      console.log(chalk.red('Username aleady exist'));
      setTimeout(() => register(), 1500);
    } else {
      question(chalk.yellow('Chose Password: '), (password) => {
        users.push({
          username: username,
          password: password,
          highestScore: null
        });
        saveUsers(users);
        console.log(chalk.green('Registration Successfull!'));
      });
    }
  });
}

function startMenu() {
  console.clear();
  console.log(chalk.blue.bold('--- Guessing Game ---'));
  console.log(chalk.yellow('1. Login'));
  console.log(chalk.yellow('2. Register'));
  console.log(chalk.yellow('3. Keluar'));
  question(chalk.magenta('Pilih opsi:'), (choice) => {
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
        question(chalk.gray('Apakah kamu ingin mencoba lagi? (Y/n): '), (answer) => {
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

function mainMenu() {
  console.clear();
  console.log(chalk.blue.bold('--- Main Menu ---'));
  console.log(chalk.yellow('1. Mulai Game'));
  console.log(chalk.yellow('2. Lihat Papan Skor'));
  console.log(chalk.yellow('3. Logout'));
  question(chalk.magenta('Pilih opsi: '), (choice) => {
    switch (choice) {
      case '1': playGame();
        break;
      case '2': showLeaderboard();
        break;
      case '3': startMenu();
        break;
      default:
        console.log(chalk.red('Invalid choice. Please try again.'));
        setTimeout(() => mainMenu(), 1500);
    }
  });
}

async function showLeaderboard() {
  console.clear();
  console.log(chalk.blue.bold('--- Papan Skor (Top 10) ---'));

  const users = await loadUsers();
  const usersPlayAndSort = users.filter(u => u.highestScore !== null).sort((a, b) => a.highestScore - b.highestScore);

  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  for (let i = 1; i <= usersPlayAndSort.length; i++) {
    if (i === 11) break;
    console.log(chalk.rgb(r, g, b)(`${i}. ${usersPlayAndSort[i]}: ${highestScore} percobaan`));
  }

}

async function playGame() {
  console.clear();
  console.log(chalk.blue.bold('--- Tebak Angka ---'));
  console.log(chalk.white('Tebak angka antara 1 dan 100'));

  const randomNumber = Math.floor(Math.random() * 100) + 1;
  let attemp = 1;

  function makeGuess() {
    question(chalk.blueBright('Tebakan Anda: '), (jawaban) => {
      const konversiJawaban = parseInt(jawaban, 10);

      if (isNaN(konversiJawaban)) {
        console.log(chalk.red('Hanya masukan angka! coba lagi.'));
        makeGuess();
      }
      attemp++;

      if (konversiJawaban < randomNumber) {
        console.log(chalk.yellow('Terlalu rendah!'));
      } else if (konversiJawaban > randomNumber) {
        console.log(chalk.yellow('Terlalu tinggi!'));
      } else {
        console.log(chalk.green(`Selamat! anda menjawab dengan benar, dalam ${attemp} percobaan`));
      }
    });
  }
}

// Fungsi utama untuk menjalankan aplikasi
async function main() {
  await loadUsers();
  startMenu();
}

main();