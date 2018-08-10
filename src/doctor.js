import { Practice } from './practice';

export class Doctor {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.practices = [];
  }

  static getByCondition(condition) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/doctors?query=${condition}&location=or-portland&user_location=45.5122%2C%20122.6587&sort=last-name-asc&skip=0&limit=100&user_key=${process.env.exports.apiKey}`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open('GET', url, true);
      request.send();
    });
  }

  static getDoctorList(response) {
    const doctorList = [];
    const parsedResponse = JSON.parse(response);
    parsedResponse.data.forEach((record) => {
      if (record.profile !== undefined) {
        let doctor = new Doctor(record.profile.first_name, record.profile.last_name);
        Doctor.addPractices(doctor, record.practices);
        doctorList.push(doctor);
      }
    });
    return doctorList;
  }

  static addPractices(doctor, practiceList) {
    practiceList.forEach((practice) => {
      let newPractice = new Practice(
        practice.uid,
        practice.name,
        practice.visit_address,
        practice.phones[0].number,
        practice.website,
        practice.accepts_new_patients
      );
      Practice.checkPhone(newPractice);
      Practice.checkWebsite(newPractice);
      doctor.practices.push(newPractice);
    });
  }
}
