import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';
import './styles/minty.min.css';
import { Condition } from './condition';
import { Doctor } from './doctor';

function showElement(element) {
  $(element).show();
}

function hideElement(element) {
  $(element).hide();
}

function loadConditions() {
  const condition = new Condition();
  let allConditionsPromise = condition.getConditions();

  allConditionsPromise.then((response) => {
    condition.buildConditionsList(response);
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
    hideElement('.processing-box');
    showElement('.search-box');
    showElement('.results-box');
    console.log(doctorList);
    displayResults(doctorList);
  }, (error) => {
    console.log(error.message);
  });
}

function displayResults(doctors) {
  doctors.forEach((doctor) => {
    appendDoctor(doctor);
    appendPractices(doctor);
  });
}

function appendDoctor(doctor) {
  const doctorCard = `<div class='doctor-card'>
                        <h2>${doctor.firstName} ${doctor.lastName}</h2>
                        <ul id='${doctor.firstName}-${doctor.lastName}-practices'>
                        </ul>
                      </div>`;
  $('.results-box').append(doctorCard);
}

function appendPractices(doctor) {
  doctor.practices.forEach((practice) => {
    let listItem = `<li class='practice-list-item'>
                      ${practice.name}<br/>
                      ${practice.phone}<br/>
                      ${practice.address.street}<br/>
                      ${practice.address.city}, ${practice.address.state} ${practice.address.zip}<br/>
                    </li>`;
    $(`#${doctor.firstName}-${doctor.lastName}-practices`).append(listItem);
  });
}

$(document).ready(function() {
  loadConditions();

  $('#search-conditions').click(function() {
    hideElement('.search-box');
    hideElement('.results-box');
    showElement('.processing-box');
    let condition = $('#conditions-select').val();
    resultsByCondition(condition);
  });
});
