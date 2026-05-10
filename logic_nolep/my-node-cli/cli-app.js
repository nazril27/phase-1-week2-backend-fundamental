import fs from 'fs/promises';
import readline from 'readline';
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

const rl = readline.createInterface({ input: process.stdin, output: mutableStdout, terminal: true });

const dataFile = 'users.json';

async function loadUser() {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveUser(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function questionPassword(query) {
  return new Promise((resolve) => {
    mutableStdout.muted = false;

    rl.question(query, (answer) => {
      mutableStdout.muted = false;
      resolve(answer);
    });
    mutableStdout.muted = true;
  });
}

async function login() {
  console.clear();
  console.log(chalk.blue.bold('=== Login ==='));
  const username = await question(chalk.yellow('Username: '));
  const password = await questionPassword(chalk.yellow('Password: '));

  const users = await loadUser();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    user.status = 'online';
    user.lastLogin = new Date().toISOString();
    await saveUser(users);
    console.log(chalk.green('\nLogin successfull!'));
    console.log(chalk.cyan(`Welcome back, ${username}!`));
  } else {
    console.log(chalk.red('\nInvalid username or password'));
  }
}

async function register() {
  console.clear();
  console.log(chalk.blue.bold('=== Register ==='));
  const username = await question(chalk.yellow('Chose a username: '));
  const password = await questionPassword(chalk.yellow('Chose a password: '));

  const users = await loadUser();
  if (users.some(u => u.username === username)) {
    console.log(chalk.red('\nUsername already exists.'));
    return;
  } 

  users.push({
    username,
    password,
    status: 'offline',
    lastLogin: null
  });
  await saveUser(users);
  console.log(chalk.green('\nRegistration successfull!'));
}

async function logout() {
  console.clear();
  console.log(chalk.blue.bold('=== Logout ==='));
  const username = await question(chalk.yellow('Enter your username: '));

  const users = await loadUser();
  const user = users.find(u => u.username === username);

  if (user && user.status === 'online') {
    user.status = 'offline';
    await saveUser(users);
    console.log(chalk.green(`${username} has been logged out.`));
  } else {
    console.log(chalk.red('User not found or not logged in.'));
  }
}

async function listUsers() {
  console.clear();
  console.log(chalk.blue.bold('=== User List ==='));
  const users = await loadUser();
  users.forEach(user => {
    const statusColor = user.status === 'online' ? chalk.green : chalk.red;
    console.log(chalk.cyan(`Username: ${user.username}`));
    console.log(statusColor(`Status: ${user.status}`));
    console.log(chalk.yellow(`Last Login: ${user.lastLogin || 'Never'}`));
    console.log('-'.repeat(30));
  });
}

async function changePassword() {
  console.clear();
  console.log(chalk.blue.bold('=== Change Password ==='));
  const username = await question(chalk.yellow('Enter your username: '));

  const users = await loadUser();
  const user = users.findIndex(u => u.username === username);


  if (user === -1 || users[user].status === 'offline') {
    console.log(chalk.red('User does not exist or not logged in.'));
  }

  const newPassword = await questionPassword(chalk.yellow('Enter new password: '));
  let verifyPassword = await questionPassword(chalk.yellow('Please retype your new password: '));

  while (newPassword !== verifyPassword) {
    const tryAgain = await questionPassword(chalk.yellow('Password does not match!, please type again: '));
    verifyPassword = tryAgain;
  }

  users[user].password = newPassword;
  await saveUser(users);
  console.log(chalk.green(`\n${username}, your password has been changed!`));
}

async function main() {
  while (true) {
    console.log(chalk.blue.bold('=== Main Menu ==='));
    console.log(chalk.yellow('1. Login'));
    console.log(chalk.yellow('2. Register'));
    console.log(chalk.yellow('3. Logout'));
    console.log(chalk.yellow('4. List Users'));
    console.log(chalk.yellow('5. Exit'));
    console.log(chalk.yellow('6. Change Password'));
    const choice = await question(chalk.magenta('Enter your choice (1-6): '));

    switch (choice) {
      case '1':
        await login();
        break;
      case '2':
        await register();
        break;
      case '3':
        await logout();
        break;
      case '4':
        await listUsers();
        break;
      case '5':
        console.log(chalk.green('Goodbye!'));
        rl.close();
        return;
      case '6':
        await changePassword();
        break;
      default:
        console.log(chalk.red('Invalid choice. Please try again.'));
    }
  }
}

main();