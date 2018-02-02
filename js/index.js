var correctA;
var qCount = 1;
var curCount = 0
var playerScore = 0;
var globalQuestions = [];

function dc(str){
  console.log(str);
}

function fetchQuestions(){
  var numOfQuestions = $('#num-of-questions').val();
  var numCategory = $('.catselect').val();
  var difficulty = $('input[name=options]:checked', "#setup").val();
  var apiConstruct = "https://opentdb.com/api.php?amount=" + numOfQuestions + "&category=" + numCategory + "&difficulty=" + difficulty + "&type=multiple";
  $.get(apiConstruct).done(function(apiResults){
    globalQuestions = apiResults;
    createCard();
  });
}

function createCard(){
  $('.question-card').fadeTo(1000, 1);
  var curQuestion = globalQuestions.results[curCount];
  var optionsArray = [];
  correctA = curQuestion.correct_answer;
  for(var i=0;i<curQuestion.incorrect_answers.length; i++){
    optionsArray.push(curQuestion.incorrect_answers[i]);
  }
  optionsArray.push(curQuestion.correct_answer);
  optionsArray = shuffle(optionsArray);
  $('#current-score span').text(playerScore);
  $('#question-text').text(curQuestion.question);
  $('#total-questions').text(globalQuestions.results.length);
  $('#current-questions').text(qCount);
  optionsArray.forEach(function(item) {
    $('#answer-options').append($('<label><input type="radio" name="answer-options" value="' + item + '"/>' + item + ' </label>'))
  });

}

function submitCard(){
  $('.question-card').fadeTo(500, 0);
  setTimeout(function(){
    var subAnswer = $('input[name=answer-options]:checked').val();
    if(subAnswer === correctA){
      playerScore += 100;
      $('#pop-up-container').css('display', 'flex').fadeTo(500, 1);
      $('#pop-up h2').text('Your Correct!')
      setTimeout(function() {
        $('#pop-up-container').css('display', 'none').fadeTo(200, 0);
      }, 700);
    }
    curCount += 1;
    qCount += 1;
    if (curCount === globalQuestions.results.length - 1) {
      $('#next-btn').hide();
      $('#submit-btn').show();
    }
    $('#answer-options').empty();
    createCard();
  }, 500);
}

function submitScore() {
  correctA;
  qCount = 1;
  curCount = 0
  globalQuestions = [];
  $('#answer-options').empty();
  $('#question-text').text(playerScore);
  playerScore = 0;
}

function shuffle(array) {
  var copy = [], n = array.length, i;
  while (n) {
    i = Math.floor(Math.random() * array.length);
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }
  return copy;
}

$(document).ready(function(){

  $('#submit-btn').on('click',submitScore);
  $('#next-btn').on('click',submitCard);
  $('.sub').on('click', function(e){
    e.preventDefault();
    fetchQuestions();
  });
});
