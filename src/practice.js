export class Practice {
  constructor(uid, name, address, phone, website, newPatients) {
    this.uid = uid;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.website = website;
    this.newPatients = newPatients;
  }

  static checkPracticeProperties(practice) {
    Practice.checkPhone(practice);
    Practice.checkWebsite(practice);
    Practice.checkNewPatients(practice);
  }

  static checkPhone(practice) {
    if (practice.phone === undefined) practice.phone = "No phone number listed.";
  }

  static checkWebsite(practice) {
    if (practice.website === undefined) practice.website = "No website listed.";
  }

  static checkNewPatients(practice) {
    if (practice.newPatients === true) {
      practice.newPatients = "Accepting new patients";
    } else {
      practice.newPatients = "Not accepting new patients";
    }
  }
}
