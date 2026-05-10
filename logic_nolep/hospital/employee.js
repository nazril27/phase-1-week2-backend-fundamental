const fs = require("fs");

class Employee {
  constructor(username, password, position) {
    this.username = username
    this.password = password
    this.position = position
    this.login = false;
  }

  static register(name, password, role, callback) {
    this.findAllEmployee((err, data) => {
      if (err) return callback(err);

      const isUsnExist = data.some(e => e.username === name);
      if (isUsnExist) return callback('Username tidak tersedia, silakan pilih yang lain.');

      const newEmployee = new Employee(name, password, role);
      data.push(newEmployee);

      const employeeData = [newEmployee, data.length];

      fs.writeFile('./employee.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
          callback('Gagal menambahkan data employee.');
        } else {
          callback(err, employeeData);
        }
      }); 
    });
  }

  static show(toShow, callback) {
    const show =  toShow === 'patient' ? './patient.json' : toShow === 'employee' ? './employee.json' : false;
    if (!show) return callback('Input tidak valid');

    this.findAllEmployee((err, data) => {
      if (err) return callback(err);

      const emIndex = data.findIndex(u => u.login === true);

      if (emIndex === -1) return callback('Tidak ada yang login.');

      if (show === './employee.json') {
        if (data[emIndex].position !== 'admin'){
          return callback('Anda bukan admin, tidak bisa melakukan proses ini');
        } 
      }

      fs.readFile(show, 'utf-8', (err, data) => {
        if (err) {
          callback('Gagal membaca data.');
        } else {
          callback(err, JSON.parse(data));
        }
      });
    });
  } 

  static login(username, password, callback) {
    this.findAllEmployee((err, data) => {
      if (err) return callback(err);

      const isAnyoneLoggedIn = data.some(u => u.login === true);
      if (isAnyoneLoggedIn) return callback('Tidak bisa login bersamaan!');

      const empIndex = data.findIndex(u => u.username === username && u.password === password);
      data[empIndex].login = true;

      fs.writeFile('./employee.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
          callback(err);
        } else {
          callback(err, data[empIndex].username);
        }
      });
    });
  }

  static logout(callback) {
    this.findAllEmployee((err, data) => {
      if (err) return callback(err);

      const empIndex = data.findIndex(u => u.login === true);
      if (empIndex === -1) return callback('Tidak ada yang login.');

      data[empIndex].login = false;
      
      fs.writeFile('./employee.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
          callback(err);
        } else {
          callback(err, data[empIndex].username);
        }
          
      });
    });
  }
 
  static findAllEmployee(callback) {
    fs.readFile("./employee.json", "utf-8", (err, data) => {
      if (err) {
        callback('Tidak dapat membaca file employee.json');
      } else {
        callback(err, JSON.parse(data));
      }
    });
  }

}



module.exports = Employee;