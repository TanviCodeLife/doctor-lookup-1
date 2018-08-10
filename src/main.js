import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Condition } from './condition';
import { Doctor } from './doctor';

function loadConditions() {
  const condition = new Condition();
  let allConditionsPromise = condition.getConditions();

  allConditionsPromise.then((response) => {
    condition.buildConditionsList(response);
    console.log(condition.conditionsList);
    addToSelect(condition.conditionsList);
  }, (error) => {
    console.log(error.message);
  });
}

function addToSelect(conditions) {
  conditions.forEach((condition) => {
    $('#conditions-select').append(`<option value='${condition}'>${condition}</option>`);
  });
}

function resultsByCondition(condition) {
  let doctorsPromise = Doctor.getByCondition(condition);

  doctorsPromise.then((response) => {
    const doctorList = Doctor.getDoctorList(response);
    console.log(doctorList);
  }, (error) => {
    console.log(error.message);
  });
}

$(document).ready(function() {
  loadConditions();

  $('#search-conditions').click(function() {
    let condition = $('#conditions-select').val();
    console.log(condition);
    resultsByCondition(condition);
  });
});
