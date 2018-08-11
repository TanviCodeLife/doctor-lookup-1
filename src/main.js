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
    hideElement('.processing-box');
    showElement('.results-box');
    displayError();
    console.log(error.message);
  });
}

function displayResults(doctors) {
  if (doctors.length === 0) noResultsFound();

  doctors.forEach((doctor, index) => {
    appendDoctor(doctor, index);
    appendPractices(doctor, index);
  });
}

function noResultsFound() {
  const doctorCard = `<div class='doctor-card'>
                        <p>No results match your search criteria. Please try again.</p>
                      </div>`;
  $('.results-box').append(doctorCard);
}

function appendDoctor(doctor, id) {
  const doctorCard = `<div class='doctor-card'>
                        <h2>${doctor.firstName} ${doctor.lastName}</h2>
                        <ul id='${id}'>
                        </ul>
                      </div>`;
  $('.results-box').append(doctorCard);
}

function appendPractices(doctor, id) {
  doctor.practices.forEach((practice) => {
    let phoneNumber = formattedPhone(practice.phone);
    let listItem = `<li class='practice-list-item'>
                      ${practice.name}<br/>
                      <a href='tel:${phoneNumber}'>${phoneNumber}</a><br/>
                      <a href='${practice.website}' target='_blank'>${practice.website}</a><br/>
                      ${practice.address.street}<br/>
                      ${practice.address.city}, ${practice.address.state} ${practice.address.zip}<br/>
                    </li>`;
    $(`#${id}`).append(listItem);
  });
}

function formattedPhone(phone) {
  const numbers = phone.split('');
  numbers.splice(3,0,'-');
  numbers.splice(7,0,'-');
  const newPhone = numbers.join('');
  return newPhone;
}

function resetResults() {
  $('.doctor-card').empty();
}

function displayError() {
  const doctorCard = `<div class='doctor-card'>
                        <p>There was an error processing your request. Please try again</p>
                      </div>`;
  $('.results-box').append(doctorCard);
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

  $('#conditions-select').click(function() {
    resetResults();
  });

  $('#search-by-condition-option').click(function() {
    showElement('#search-by-condition');
    hideElement('.search-by-box');
  });

  $('#search-by-doctor-option').click(function() {
    showElement('#search-by-doctor');
    hideElement('.search-by-box');
  });

  $('.btn-back').click(function() {
    hideElement('#search-by-doctor');
    hideElement('#search-by-condition');
    showElement('.search-by-box');
  });
});
