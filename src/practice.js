import { Doctor } from './doctor';

export class Practice {
  constructor(name, address, phone, newPatients) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.newPatients = newPatients;
    this.doctors = [];
  }

  static getPracticeByCondition(condition) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/doctors?query=${condition}&location=or-portland&user_location=45.5122%2C%20122.6587&sort=last-name-asc&skip=0&limit=100&user_key=${process.env.exports.apiKey}`;
      console.log(url);
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

  static getPracticeList(response) {
    const practiceList = [];
    const parsedResponse = JSON.parse(response);
    console.log(parsedResponse);
    parsedResponse.data.forEach((record) => {
      let practice = this.buildPractice(record);
      practiceList.push(practice);
    });
    return practiceList;
  }

  static buildPractice(record) {
    const practice = new Practice(
      record.practices[0].name,
      record.practices[0].visit_address,
      record.practices[0].phones[0].number,
      record.practices[0].accepts_new_patients
    );

    if (record.profile !== undefined) {
      const doctor = new Doctor(record.profile.first_name, record.profile.last_name);
      practice.doctors.push(doctor);
    }
    return practice;
  }
}
