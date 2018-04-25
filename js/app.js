// List of card icon names (from Font Awesome)
const CARD_ICON_NAMES = [
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
const CARD_COUNT = CARD_ICON_NAMES.length * 2;

// The maximum score available
const MAX_SCORE = 3;

initializeGame();

// Set up game for the first time (when the page is loaded)
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

// Set up for a new game (either for the first time, or after user has restarted)
function createNewGame(gameState) {
  const deck = document.querySelector('.deck');
  // Create list with two cards for each icon, and shuffle it
  const cardIconClasses = shuffle(CARD_ICON_NAMES.concat(CARD_ICON_NAMES));
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
  resetGameState(gameState);
  updateTurnDisplay(gameState);
  updateScoreDisplay(gameState);
};

// Set state of game to the starting values
function resetGameState(gameState) {
  gameState.cardsCorrect = 0;
  gameState.cardsInTurn.length = 0;
  gameState.turnsTaken = 0;
  gameState.intervalId = setInterval(updateTimerDisplay, 1000, Date.now());
}

// Clean up previous game before starting a new one
function restartGame(gameState) {
  // Remove all existing cards from the game board
  const deck = document.querySelector('.deck');
  deck.querySelectorAll('.card').forEach(function (card) {
    deck.removeChild(card);
  });
  clearInterval(gameState.intervalId);
  updateTimerDisplay(Date.now());
  createNewGame(gameState);
};

// Core game logic, after user clicks on a card
function handleCardClick(cardElement, gameState) {
  // Only enter if this card is not already open, and there are 0 or 1 cards open
  if (!cardIsOpen(cardElement) && countCardsInTurn(gameState) < 2) {
    // Flip this card to its "open" state, and keep track of it
    openCard(cardElement, gameState);
    // If this is the second card opened in the turn, check if the two cards match
    if (countCardsInTurn(gameState) === 2) {
      if (cardsAreMatching(gameState)) {
        setTimeout(handleMatch, 1000, gameState);
      } else {
        setTimeout(closeOpenCards, 1500, gameState);
      }
      incrementTurnsTaken(gameState);
      updateTurnDisplay(gameState);
      updateScoreDisplay(gameState);
    }
  }
};

// Helper function to check how many cards have been opened in this turn
function countCardsInTurn(gameState) {
  return gameState.cardsInTurn.length;
}

// Helper function to determine if the two currently open cards are matching
function cardsAreMatching(gameState) {
  return gameState.cardsInTurn[0] === gameState.cardsInTurn[1];
}

// Helper function to increment the number of turns taken
function incrementTurnsTaken(gameState) {
  gameState.turnsTaken++;
}

// Helper function to check if a card is currently flipped to its open state
function cardIsOpen(cardElement) {
  return cardElement.classList.contains('open') || cardElement.classList.contains('match');
}

// Helper function to return the name of the symbol on this card
function getCardName(cardElement) {
  // TODO: is there a more robust way to do this?
  return cardElement.firstChild.classList.item(1);
};

// Helper function to flip a card to its open state
function openCard(cardElement, gameState) {
  cardElement.classList.add('open');
  gameState.cardsInTurn.push(getCardName(cardElement));
};

// Close all cards that are currently open
function closeOpenCards(gameState) {
  document.querySelectorAll('.open').forEach(function (element) {
    element.classList.remove('open');
  });
  gameState.cardsInTurn.length = 0;
};

// When two cards match, replace their 'open' class with the 'match' class.
// Update the game state and check if this means the user has now won.
function handleMatch(gameState) {
  document.querySelectorAll('.open').forEach(function (element) {
    element.classList.add('match');
    element.classList.remove('open');
  });
  gameState.cardsCorrect += 2;
  gameState.cardsInTurn.length = 0;
  checkForWinningState(gameState);
};

// Update the scoreboard to show the current number of turns taken
function updateTurnDisplay(gameState) {
  const turnString = gameState.turnsTaken === 1 ? ' Turn' : ' Turns';
  document.querySelector('.turns').textContent = gameState.turnsTaken + turnString;
};

// Helper function to calculate the score, based on the number of turns
function calculateScore(turnsTaken) {
  // Maximum score of 3 stars is available if you take <16 turns. Then 2 stars for <32, 1 star for 32+
  return Math.max(1, MAX_SCORE - Math.floor(turnsTaken / CARD_COUNT));
}

// Update the scoreboard to show the current score (in stars)
function updateScoreDisplay(gameState) {
  let score = calculateScore(gameState.turnsTaken);
  // Hide stars instead of removing them, so that the spacing remains consistent
  document.querySelectorAll('.fa-star').forEach(function (element, index) {
    if (index + 1 > score) {
      element.style.visibility = 'hidden';
    } else {
      element.style.visibility = 'visible';
    }
  });
};

// Update the scoreboard to show how much time has elapsed since the start of the game
function updateTimerDisplay(startTime) {
  const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
  document.querySelector('.timer').textContent = formatDuration(elapsedSeconds);
};

// Check whether all of the cards are now open, and if so, the user has won the game
function checkForWinningState(gameState) {
  if (gameState.cardsCorrect === CARD_COUNT) {
    clearInterval(gameState.intervalId);
    setTimeout(displayCongratulations, 2500, gameState);
  }
};

// Show modal dialog to congratulate the user on winning the game, and let them play again
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

// Function to format duration into a string, based on https://stackoverflow.com/a/40350003
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s,
  ].filter(a => a).join(':');
}

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
