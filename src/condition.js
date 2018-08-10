export class Condition {
  constructor() {
    this.conditionsList = [];
  }

  getConditions() {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/conditions?&user_key=${process.env.exports.apiKey}`;
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
  
  buildConditionsList(apiResponse) {
    const parsedResponse = JSON.parse(apiResponse);
    parsedResponse.data.forEach((condition) => {
      this.conditionsList.push(condition.name);
    });
    this.conditionsList.sort();
  }
}
