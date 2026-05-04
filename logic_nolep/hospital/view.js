class HospitalView {
    static registerView(objArr) {
        console.log(`save data success {"username":${objArr[0].username},"password":${objArr[0].password},"role":${objArr[0].position}. Total employee : ${objArr[1]}`)
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
        console.log('node index.js addPatient <namaPasien> <penyakit1> <penyakit2> ....');
        console.log('node index.js updatePatient <namaPasien> <penyakit1> <penyakit2> ....');
        console.log('node index.js deletePatient <id>');
        console.log('node index.js logout');
        console.log('node index.js show <employee/patient>');
        console.log('node index.js findPatientBy: <name/id> <namePatient/idPatient>');
    }
}


module.exports = HospitalView;