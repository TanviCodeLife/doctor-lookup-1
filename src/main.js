import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Condition } from './condition';
import { Practice } from './practice';

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

function loadPracticeByCondition(condition) {
  let allPractices = Practice.getPracticeByCondition(condition);

  allPractices.then((response) => {
    const practiceList = Practice.getPracticeList(response);
    console.log(practiceList);
  }, (error) => {
    console.log(error.message);
  });
}

$(document).ready(function() {
  loadConditions();

  $('#search-conditions').click(function() {
    console.log('clicked search');
    let condition = $('#conditions-select').val();
    console.log(condition);
    loadPracticeByCondition(condition);
  });
});
