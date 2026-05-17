class HospitalView {
    static registerView(employeeData) {
        console.log(`Sukses menyimpan data baru: { username: ${employeeData[0].username}, password: ${employeeData[0].password}, posititon: ${employeeData[0].position} }`);
        console.log(`Total karyawan: ${employeeData[1]}`);
    }

    static loginView(username) {
        console.log(`${username} berhasil login.`);
    }

    static addPatientView(patient) {
        console.log('Pasien baru telah terdaftar:');
        console.log(patient);
    }

    static logoutView(name) {
        console.log(`${name} telah logout.`);
    }

    static deleteView(id) {
        console.log(`Pasien dengan id ${id} berhasil dihapus.`);
    }

    static updateView(patient) {
        console.log('Data pasien berhasil diubah:');
        console.log(patient)
    }

    static showView(data) {
        for (const d of data) console.log(d);
    }

    static findPatientByView(data) {
        console.log(data);
    }

    static errorView(err) {
        console.log(err);
    }


    
    static helpView() {
        console.log('==========================');
        console.log('HOSPITAL INTERFACE COMMAND');
        console.log('==========================');
        console.log('node index.js register <username> <password> <jabatan>');
        console.log('node index.js login <username> <password>');
        console.log('node index.js addPatient <id> <namaPasien> <penyakit1> <penyakit2> ....');
        console.log('node index.js updatePatient <id> <namaPasien> <penyakit1> <penyakit2> ....');
        console.log('node index.js deletePatient <id>');
        console.log('node index.js logout');
        console.log('node index.js show <employee/patient>');
        console.log('node index.js findPatientBy: <name/id> <namePatient/idPatient>');
    }
}


module.exports = HospitalView;