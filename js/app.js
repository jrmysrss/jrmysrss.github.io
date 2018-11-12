const allCards = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
let flippedCards = []
let moves = 0;
const movesText = document.querySelector('.moves');
const movesResults = document.querySelector('.moves-results');



// Starts game - shuffles the cards
function startGame() {
  const cardsList = [].slice.call(document.querySelectorAll(".card"));
  const shuffleCards = shuffle(cardsList);
  for (card of shuffleCards) {
    deck.appendChild(card);
  }
  // Sets the move counter to zero at the start of the game
  moves = 0;
  movesText.innerHTML = moves;
  movesResults.innerHTML = moves;
  stopTimer();
  timerOutput.innerHTML = "00:00";
  timerOutputResults.innerHTML = "00:00";

}
startGame();



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



//Defines when a card should be pushed to the flippedCards array
//If the array amount equals 2, runs the checkMatch function
allCards.forEach(function(card) {
  card.addEventListener('click', function(event) {
    if (flippedCards.length < 2 &&
      !flippedCards.includes(card) &&
      !card.classList.contains('match')) {
      flippedCards.push(card);
      card.classList.add('open', 'show');
    }

    if (flippedCards.length === 2) {
      checkMatch();
    }

    //Runs the star rating function each click
    starRating();
    starResults();
  });
});


deck.addEventListener("click", function() {
  startTimer();
}, {once : true});

//Check the 2 cards if they both have matching classNames
function checkMatch() {
  if (flippedCards[0].firstElementChild.className === flippedCards[1].firstElementChild.className) {
    flippedCards[0].classList.add('match');
    flippedCards[1].classList.add('match');
    flippedCards[0].classList.add('right');
    flippedCards[1].classList.add('right');
    flippedCards = [];

    //If no match, run setTimeout to flip back over after
  } else {
    flippedCards[0].classList.add('wrong');
    flippedCards[1].classList.add('wrong');
    setTimeout(() => {
      flipBack(flippedCards[0]);
      flipBack(flippedCards[1]);
      flippedCards = [];
      // Elements become clickable after setTimeout
    }, 1000);
  }

  checkWin();

  // Runs the disable & enable functions each match
  disableEnableClick();

  // increment move counter on each match check and update html
  moves++;
  movesText.innerHTML = moves;
  movesResults.innerHTML = moves;
}

// Disables click, then enables click after setTimeout to keep from errors happening
function disableEnableClick() {
  disableClick();
  setTimeout(() => {
    enableClick()
  }, 1000);
}


// function that disables elements to be clicked
function disableClick() {
  let deck = document.querySelectorAll('.deck');

  for (let i = 0; i < deck.length; i++) {
    deck[i].classList.add('disable');
  }
};

// function that enables elements to be clicked
function enableClick() {
  let deck = document.querySelectorAll('.deck');

  for (let i = 0; i < deck.length; i++) {
    deck[i].classList.remove('disable');
  }
};


//Removes the open, show, and wrong classes
function flipBack(card) {
  card.classList.remove('open');
  card.classList.remove('show');
  card.classList.remove('wrong');
};




// Star Rating
// Changes style of star by switching FA icon class
function starRating() {
  let oneStar = document.querySelector('.onestar');
  let twoStar = document.querySelector('.twostar');
  let threeStar = document.querySelector('.threestar');

  if (moves >= 12 && moves < 20) {
    threeStar.classList.remove('fa-star');
    threeStar.classList.add('fa-star-o');
  }
  if (moves >= 20) {
    twoStar.classList.remove('fa-star');
    twoStar.classList.add('fa-star-o');
  }
}

// Changes style of Results modal star rating
function starResults() {
  let oneResult = document.querySelector('.onestar-results');
  let twoResult = document.querySelector('.twostar-results');
  let threeResult = document.querySelector('.threestar-results');

  if (moves >= 12 && moves < 20) {
    threeResult.classList.remove('fa-star');
    threeResult.classList.add('fa-star-o');
  }
  if (moves >= 20) {
    twoResult.classList.remove('fa-star');
    twoResult.classList.add('fa-star-o');
  }
}


//Timer
// Timer functionality from Crhis Neal - https://codepen.io/chrisvneal/pen/OEMJyR
const timerOutput = document.querySelector(".timer-output");
const timerOutputResults = document.querySelector(".timer-output-results");


// Timer functions
let sec = 0;
let min = 0;
let timer;
let timeRunning = false;

// start the timer
function startTimer() {
  if (timeRunning == false) {
    timer = setInterval(insertTime, 1000);
    timeRunning = true;

  } else {
    return;
  }
}

// stop the timer
function stopTimer() {
  clearInterval(timer);
  sec = 0;
  min = 0;
  timeRunning = false;
}

// insert time into time output html
function insertTime() {
  sec++;

  if (sec < 10) {
    sec = `0${sec}`;
  }

  if (sec >= 60) {
    min++;
    sec = "00";
  }

  // display time
  timerOutput.innerHTML = "0" + min + ":" + sec;
  timerOutputResults.innerHTML = "0" + min + ":" + sec;
}



//
//Modal Win Screen
//

// Toggle the Modal box
function toggleModal() {
  const modal = document.querySelector('.modal');
  modal.classList.toggle('hide-modal');
};

// When the game is won, show modal and stop timer
function winGame() {
  toggleModal();
  stopTimer();
};

// Modal close button
document.querySelector(".close").addEventListener("click", () => {
  toggleModal();
});


// Win happens when the amount of cards with match class equals 16
function checkWin() {
  const matchingCards = document.querySelectorAll(".match");

  if (matchingCards.length == 16) {
    stopTimer();
    toggleModal();
  }
};

// Function to reset the star results
function resetResults() {
  let twoResult = document.querySelector('.twostar-results');
  let threeResult = document.querySelector('.threestar-results');

  threeResult.classList.add('fa-star');
  threeResult.classList.remove('fa-star-o');
  twoResult.classList.add('fa-star');
  twoResult.classList.remove('fa-star-o');
}

// Play Again button - when clicked will close modal, and reset the game
document.querySelector(".play-again-btn").addEventListener("click", () => {
  stopTimer();
  timerOutput.innerHTML = "00:00";
  timerOutputResults.innerHTML = "00:00";
  startGame();
  resetFlips();
  resetRating();
  resetResults();
  toggleModal();
});


//
// Reset button
//

// Function calls the matched cards and removes all the classes
function resetFlips() {
  const matchedCards = document.querySelectorAll('.deck li');
  for (let card of matchedCards) {
    card.classList.remove("match", "open", "show", "right")
  }
};

// Function to reset the star rating
function resetRating() {
  let twoResult = document.querySelector('.twostar');
  let threeResult = document.querySelector('.threestar');

  threeResult.classList.add('fa-star');
  threeResult.classList.remove('fa-star-o');
  twoResult.classList.add('fa-star');
  twoResult.classList.remove('fa-star-o');
}

// Reset button event - resets game
document.querySelector(".restart").addEventListener("click", () => {
  stopTimer();
  timerOutput.innerHTML = "00:00";
  timerOutputResults.innerHTML = "00:00";
  startGame();
  resetFlips();
  resetRating();
  resetResults();
});
