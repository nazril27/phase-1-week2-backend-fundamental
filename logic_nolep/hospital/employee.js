const { log } = require("console");
let fs = require("fs");

class Employee {
  constructor(username, password, position) {
    this.username = username
    this.password = password
    this.position = position
    this.login = false;
  }

  static register(name, password, role, callback) {
    this.findAll((err, data) => {
      if (err) {
        console.log('Tidak ada file json, membuat file json...');
        fs.writeFile("./employee.json", JSON.stringify([], null, 2), (err) => {
          if (!err) {
            console.log('berhasil membuat file json');
            this.register(name, password, role, callback);
          }
        });
      } else {
        let obj = new Employee(name, password, role);
        let newData = data;
        newData.push(obj);

        let objArr = [obj, newData.length];

        fs.writeFile("./employee.json", JSON.stringify(newData, null, 2), (err) => {
          if (err) {
            console.log(err);
          } else {
            callback(err, objArr);
          }
        });
      }
    });
  }

  static login(username, password, callback) {
    this.findAll((err, data) => {
      if (err) {
        console.log(err);
      } else {
        const isAnyoneLoggedIn = data.findIndex(u => u.login === true);
        if (isAnyoneLoggedIn) {
          return callback(`${data.username} sedang login, Anda harus menunggunya logout`);
        }

        const userIndex = data.findIndex(u => u.username === username && u.password === password);
        data[userIndex].login = true;

        fs.writeFile('./employee.json', JSON.stringify(data, null, 2), (err) => {
          if (err) {
            console.log(err);
          } else {
            callback(err, data[userIndex].username);
          }
        });
      }
    });
  }
 
  static findAll(callback) {
    fs.readFile("./employee.json", "utf-8", (err, data) => {
      if (err) {
        callback(err);
      } else {
        callback(err, JSON.parse(data));
      }
    });
  }

}



module.exports = Employee;