// List of card icon names (from Font Awesome)
const cardIconNames = [
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bicycle",
  "fa-bomb"
];

// The total number of cards = two for each icon
const cardCount = cardIconNames.length * 2;

// The maximum score available
const maxScore = 3;

initializeGame();

function createNewGame(gameState) {
  const deck = document.querySelector('.deck');
  // Create list with two cards for each icon, and shuffle it
  const cardIconClasses = shuffle(cardIconNames.concat(cardIconNames));
  // Display the cards on the page
  cardIconClasses.forEach(function (cardIconClass) {
    let card = document.createElement('li');
    card.classList.add('card');
    let icon = document.createElement('i');
    icon.classList.add('fa');
    icon.classList.add(cardIconClass);
    card.appendChild(icon);
    deck.appendChild(card);
  });
  gameState.cardsCorrect = 0;
  gameState.cardsInTurn.length = 0;
  gameState.turnsTaken = 0;
  clearInterval(gameState.intervalId);
  gameState.intervalId = setInterval(updateTimerDisplay, 1000, Date.now());
  updateTurnDisplay(gameState.turnsTaken);
  updateScoreDisplay(gameState.turnsTaken);

};

function initializeGame() {
  const gameState = {
    // The number of cards that the user has matched correctly so far
    cardsCorrect: 0,
    // The cards that the user has opened in this turn
    cardsInTurn: [],
    // The number of turns taken in this game
    turnsTaken: 0,
    // ID of timer for current game
    intervalId: null
  };
  createNewGame(gameState);
  // Handle clicks and apply game logic (determine if open cards match)
  const deck = document.querySelector('.deck');
  deck.addEventListener('click', function (event) {
    if (event.target.classList.contains('card')) {
      handleCardClick(event.target, gameState);
    }
  });
  // Enable restart button
  const restart = document.querySelector('.restart');
  restart.addEventListener('click', function () {
    restartGame(gameState);
  });
};

function restartGame(gameState) {
  // Remove all existing cards from the game board
  const deck = document.querySelector('.deck');
  deck.querySelectorAll('.card').forEach(function (card) {
    deck.removeChild(card);
  });
  createNewGame(gameState);
};

function handleCardClick(cardElement, gameState) {
  if (!cardIsOpen(cardElement) && gameState.cardsInTurn.length < 2 && gameState.cardsCorrect < cardCount) {
    gameState.cardsInTurn.push(getCardName(cardElement));
    displaySymbol(cardElement);
    if (gameState.cardsInTurn.length === 2) {
      if (gameState.cardsInTurn[0] === gameState.cardsInTurn[1]) {
        setTimeout(showMatch, 1000);
        gameState.cardsCorrect += 2;
        gameState.cardsInTurn.length = 0;
      } else {
        setTimeout(closeOpenCards, 1500, gameState);
      }
      gameState.turnsTaken++;
      updateTurnDisplay(gameState.turnsTaken);
      updateScoreDisplay(gameState.turnsTaken);
      checkForWinningState(gameState);
    }
  }
};

function cardIsOpen(cardElement) {
  return cardElement.classList.contains('open') || cardElement.classList.contains('match');
}

function getCardName(cardElement) {
  // TODO: try to find a more robust way to do this
  return cardElement.firstChild.classList.item(1);
};

function displaySymbol(cardElement) {
  cardElement.classList.add('open');
};

function closeOpenCards(gameState) {
  document.querySelectorAll('.open').forEach(function (element) {
    element.classList.remove('open');
  });
  gameState.cardsInTurn.length = 0;
};

function showMatch() {
  document.querySelectorAll('.open').forEach(function (element) {
    element.classList.add('match');
    element.classList.remove('open');
  });
};

function updateTurnDisplay(turnsTaken) {
  const turnString = turnsTaken === 1 ? ' Turn' : ' Turns';
  document.querySelector('.turns').textContent = turnsTaken + turnString;
};

function calculateScore(turnsTaken) {
  // Maximum score of 3 stars is available if you take <16 turns. Then 2 stars for <32, 1 star for 32+
  return Math.max(1, maxScore - Math.floor(turnsTaken / cardCount));
}

function updateScoreDisplay(turnsTaken) {
  let score = calculateScore(turnsTaken);
  // Hide stars instead of removing them, so that the spacing remains consistent.
  document.querySelectorAll('.fa-star').forEach(function (element, index) {
    if (index + 1 > score) {
      element.style.visibility = 'hidden';
    } else {
      element.style.visibility = 'visible';
    }
  });
};

function updateTimerDisplay(startTime) {
  const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
  document.querySelector('.timer').textContent = elapsedSeconds + 's';
};

function checkForWinningState(gameState) {
  if (gameState.cardsCorrect === cardCount) {
    clearInterval(gameState.intervalId);
    setTimeout(displayCongratulations, 2500, gameState);
  }
};

function displayCongratulations(gameState) {
  document.querySelector('.end-time').textContent = document.querySelector('.timer').textContent;
  document.querySelector('.end-score').textContent = calculateScore(gameState.turnsTaken);
  document.querySelector('.modal').classList.remove('hide');
  document.querySelector('.overlay').classList.remove('hide');
  document.querySelector('.play-again').addEventListener('click', function () {
    document.querySelector('.modal').classList.add('hide');
    document.querySelector('.overlay').classList.add('hide');
    restartGame(gameState);
  });
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
