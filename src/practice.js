export class Practice {
  constructor(uid, name, address, phone, newPatients) {
    this.uid = uid;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.newPatients = newPatients;
  }

  static checkPhone(practice) {
    if (practice.phone === undefined) practice.phone = "No phone number listed.";
  }
}
