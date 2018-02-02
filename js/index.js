var correctA;
var qCount = 1;
var playerScore = 0;
var apiReturn = [];

function dc(str){
  console.log(str);
}

function fetchQuestions(){
  var numOfQuestions = $('#num-of-questions').val();
  var numCategory = $('.catselect').val();
  var difficulty = $('input[name=options]:checked', "#setup").val();
  var apiConstruct = "https://opentdb.com/api.php?amount=" + numOfQuestions + "&category=" + numCategory + "&difficulty=" + difficulty + "&type=multiple";
  $.get(apiConstruct).done(function(result){
    apiReturn = result;
    createCard();
  });
}

function createCard(){
  $('.question-card').fadeTo(1000, 1);
  var curQuestion = apiReturn.results[qCount-1];
  var optionsArray = [];
  correctA = curQuestion.correct_answer;
  for(var i=0;i<curQuestion.incorrect_answers.length; i++){
    optionsArray.push(curQuestion.incorrect_answers[i]);
  }
  optionsArray.push(curQuestion.correct_answer);
  dc(optionsArray)
  optionsArray = shuffle(optionsArray);
  dc(optionsArray)
  $('#current-score span').text(playerScore);
  $('#question-text').html(curQuestion.question);
  $('#total-questions').text(apiReturn.results.length);
  $('#current-questions').text(qCount);
  optionsArray.forEach(function(item) {
    $('#answer-options').append($('<div class="col"><label class="btn btn-secondary"><input type="radio" name="answer-options" value="' + item + '"/>' + item + ' </label></div>'));
  });

}

function submitCard(){
  $('.question-card').fadeTo(500, 0);
  setTimeout(function(){//card timeout
    var subAnswer = $('input[name=answer-options]:checked').val();
    if(subAnswer === correctA){//Correct Answer location
      playerScore += 100;
      $('#pop-up').css('background', 'rgba(8,255,8,.7)')
      $('#pop-up-container').css('display', 'flex');
      $('#pop-up h2').text('Your Correct!');
      setTimeout(function() {
        $('#pop-up-container').css('display', 'none');
      }, 700);
    }else{//Incorrect answer
      playerScore -= 50;
      $('#pop-up').css('background', 'rgba(255,8,8,.7)')
      $('#pop-up-container').css('display', 'flex');
      $('#pop-up h2').text('Your DUMB AS FUCK!');
      setTimeout(function() {
        $('#pop-up-container').css('display', 'none');
      }, 700);
    }
    qCount += 1;
    if (qCount-1 === apiReturn.results.length - 1) {
      $('#next-btn').hide();
      $('#submit-btn').css('display', 'block');
    }
    $('#answer-options').empty();
    createCard();
  }, 500);
}

function submitScore() {
  $('#answer-options').empty();
  $('#question-text').text(playerScore);
  playerScore = 0;
  correctA;
  qCount = 1;
  apiReturn = [];
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
