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

function showResultsUi() {
  hideElement('.processing-box');
  showElement('.search-box');
  showElement('.results-box');
}

function showErrorUi() {
  hideElement('.processing-box');
  showElement('.results-box');
}

function showSearchingUi() {
  hideElement('.search-box');
  hideElement('.results-box');
  showElement('.processing-box');
}

function showByConditionUi() {
  showElement('#search-by-condition');
  hideElement('.search-by-box');
}

function showByDoctorUi() {
  showElement('#search-by-doctor');
  hideElement('.search-by-box');
}

function showHomeUi() {
  hideElement('#search-by-doctor');
  hideElement('#search-by-condition');
  showElement('.search-by-box');
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
    showResultsUi();
    displayResults(doctorList);
  }, (error) => {
    showErrorUi();
    displayError(error.message);
  });
}

function resultsByDoctorName(name) {
  let doctorsPromise = Doctor.getByName(name);

  doctorsPromise.then((response) => {
    const doctorList = Doctor.getDoctorList(response);
    showResultsUi();
    displayResults(doctorList);
  }, (error) => {
    showErrorUi();
    displayError(error.message);
  });
}

function displayResults(doctors) {
  if (doctors.length === 0) return noResultsFound();

  doctors.forEach((doctor, index) => {
    appendDoctor(doctor, index);
    appendPractices(doctor, index);
  });
}

function noResultsFound() {
  const doctorCard = `<div class='doctor-card'>
                        <p><i class="fas fa-exclamation-triangle"></i> No results match your search criteria. Please try again.</p>
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
    let phoneNumber = formatNumber(practice.phone);
    let listItem = `<li class='practice-list-item'>
                      <h5>${practice.name}</h5>
                      ${practice.newPatients}<br/>
                      <a href='tel:${phoneNumber}'>${phoneNumber}</a><br/>
                      <a href='${practice.website}' target='_blank'>${practice.website}</a><br/>
                      ${practice.address.street}<br/>
                      ${practice.address.city}, ${practice.address.state} ${practice.address.zip}<br/>
                    </li>`;
    $(`#${id}`).append(listItem);
  });
}

function formatNumber(phone) {
  const numbers = phone.split('');
  numbers.splice(3,0,'-');
  numbers.splice(7,0,'-');
  const newPhone = numbers.join('');
  return newPhone;
}

function resetResults() {
  $('.doctor-card').empty();
}

function displayError(message) {
  const doctorCard = `<div class='doctor-card'>
                        <p><i class="fas fa-exclamation-triangle"></i> There was an error processing your request: ${message}.</p>
                      </div>`;
  $('.results-box').append(doctorCard);
}

$(document).ready(function() {
  loadConditions();

  $('#search-conditions').click(function() {
    resetResults();
    if ($('#conditions-select').val() === '') {
      showErrorUi();
      return displayError('Please select an option from the list');
    }

    showSearchingUi();
    let condition = $('#conditions-select').val();
    resultsByCondition(condition);
  });

  $('#search-doctors').click(function() {
    resetResults();
    if ($('#doctor-name').val() === '') {
      showErrorUi();
      return displayError('Please input a doctor name');
    }

    showSearchingUi();
    let doctorName = $('#doctor-name').val();
    resultsByDoctorName(doctorName);
  });

  $('#conditions-select, .btn-back').click(function() {
    resetResults();
  });

  $('#search-by-condition-option').click(function() {
    showByConditionUi();
  });

  $('#search-by-doctor-option').click(function() {
    showByDoctorUi();
  });

  $('.btn-back').click(function() {
    showHomeUi();
  });
});
