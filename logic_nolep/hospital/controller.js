let Patient = require("./patient");
let Employee = require("./employee")
let HospitalView = require("./view");

class HospitalController {
    static register(name, password, role) {
        Employee.register(name, password, role, (err, objArr) => {
            if (err) {
                HospitalView.ErrorView(err);
            } else {
                HospitalView.registerView(objArr);
            }
        });
    }

    static login(username, password) {
        Employee.login(username, password, (err, username) => {
            if (err) {
                HospitalView.ErrorView(err);
            } else {
                HospitalView.loginView(username);
            }
        });
    }

    static help() {
        HospitalView.helpView();
    }
}


module.exports = HospitalController;