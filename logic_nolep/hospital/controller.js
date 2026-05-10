let Patient = require("./patient");
let Employee = require("./employee")
let HospitalView = require("./view");

class HospitalController {
    static register(name, password, role) {
        Employee.register(name, password, role, (err, employeeData) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.registerView(employeeData);
            }
        });
    }

    static login(username, password) {
        Employee.login(username, password, (err, username) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.loginView(username);
            }
        });
    }

    static addPatient(id, name, penyakit) {
        Patient.addPatient(id, name, penyakit, (err, patient) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.addPatientView(patient);
            }
        });
    }

    static deletePatient(id) {
        Patient.deletePatient(id, (err, id) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.deleteView(id);
            }
        });
    }

    static updatePatient(id, name, penyakit) {
        Patient.updatePatient(id, name, penyakit, (err, patient) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.updateView(patient);
            }
        });
    }

    static logout() {
        Employee.logout((err, username) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.logoutView(username);
            }
        });
    }

    static show(who) {
        Employee.show(who, (err, data) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.showView(data);
            }
        });
    }

    static findPatientBy(nameOrId) {
        Patient.findPatientBy(nameOrId, (err, data) => {
            if (err) {
                HospitalView.errorView(err);
            } else {
                HospitalView.findPatientByView(data);
            }
        }); 
    }

    static help() {
        HospitalView.helpView();
    }
}


module.exports = HospitalController;