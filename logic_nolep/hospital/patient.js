const fs = require('fs');
const Employee = require('./employee.js')

class Patient {
    constructor(id, name, penyakit) {
        this.id = id;
        this.name = name;
        this.penyakit = penyakit;
    }

    static addPatient(id, name, penyakit, callback) {
        this.findAllPatient((err, patient_data) => {
            if (err) {
                return callback(err);
            } 
            Employee.findAllEmployee((err, employee_data) => {
                if (err) return callback('Tidak bisa membaca data pegawai');

                const emIndex = employee_data.findIndex(u => u.login === true);
                if (emIndex === -1) return callback('Tidak ada yang login');

                if (employee_data[emIndex].position !== 'dokter') {
                    return callback('Anda bukan dokter, tidak bisa melakukan proses ini');
                }

                const isIdAvail = patient_data.some(p => p.id === id);
                if (isIdAvail) return callback(`Pasien dengan id ${id} sudah terdaftar`);

                const newPatient = new Patient(id, name, penyakit);
                patient_data.push(newPatient);

                fs.writeFile('./patient.json', JSON.stringify(patient_data, null, 2), (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(err, newPatient);
                    }
                });
            });  
        });
    }

    static deletePatient(id, callback) {
        this.findAllPatient((err, patient_data) => {
            if (err) return callback(err);

            Employee.findAllEmployee((err, employee_data) => {
                if (err) return callback(err);

                const emIndex = employee_data.findIndex(u => u.login === true);
                if (emIndex === -1) return callback('Tidak ada yang login');

                if (employee_data[emIndex].position !== 'dokter') {
                    return callback('Anda bukan dokter, tidak bisa melakukan proses ini');
                }

                const patientIndex = patient_data.findIndex(p => p.id === id);
                if (patientIndex === -1) return callback(`Pasien dengan id ${id} tidak tersedia.`);

                const newPatientData = patient_data.filter(p => p.id !== id);

                fs.writeFile('./patient.json', JSON.stringify(newPatientData, null, 2), (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(err, id);
                    }
                });
            });
        });
    }

    static updatePatient(id, name, penyakit, callback) {
        this.findAllPatient((err, patient_data) => {
            if (err) return callback(err);

            Employee.findAllEmployee((err, employee_data) => {
                if (err) return callback(err);

                const emIndex = employee_data.findIndex(u => u.login === true);
                if (emIndex === -1) return callback('Tidak ada yang login');

                if (employee_data[emIndex].position !== 'dokter') {
                    return callback('Anda bukan dokter, tidak bisa melakukan proses ini');
                }

                const patientIndex = patient_data.findIndex(p => p.id === id);
                if (patientIndex === -1) return callback(`Pasien dengan id ${id} tidak tersedia.`);

                patient_data[patientIndex].name = name;
                patient_data[patientIndex].penyakit = penyakit;

                fs.writeFile('./patient.json', JSON.stringify(patient_data, null, 2), (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(err, patient_data[patientIndex]);
                    }
                });
            });
        });
    }

    static findPatientBy(nameOrId, callback) {
        this.findAllPatient((err, data) => {
            if (err) return callback('Tidak dapat membaca data pasien');

            const search = data.filter(d => d.id === nameOrId || d.name.toLowerCase() === nameOrId.toLowerCase());
            if (!search) return callback('Data pasien tidak ditemukan.');

            callback(err, search);
        });
    }

    static findAllPatient(callback) {
        fs.readFile('./patient.json', 'utf-8', (err, data) => {
            if (err) {
                callback('Tidak dapat membaca file patient.json');
            } else {
                callback(err, JSON.parse(data));
            }
        });
    }

}

module.exports = Patient;