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

// The number of cards that the user has matched correctly so far
let cardsCorrect = 0;

// The cards that the user has opened in this turn
const cardsInTurn = [];

// The number of turns taken in this game
let turnsTaken = 0;

// The maximum score available
const maxScore = 3;

initializeGame();

function createNewGame() {
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
  cardsCorrect = 0;
  cardsInTurn.length = 0;
  turnsTaken = 0;
  updateTurnDisplay();
  updateScoreDisplay();
};

function initializeGame() {
  createNewGame();
  // Handle clicks and apply game logic (determine if open cards match)
  const deck = document.querySelector('.deck');
  deck.addEventListener('click', clickEventListener);
  // Enable restart button
  const restart = document.querySelector('.restart');
  restart.addEventListener('click', restartGame);
};

function restartGame() {
  // Remove all existing cards from the game board
  const deck = document.querySelector('.deck');
  deck.querySelectorAll('.card').forEach(function(card) {
    deck.removeChild(card);
  });
  createNewGame();
};

function clickEventListener(event) {
  if (!event.target.classList.contains('card')) {
    return;
  }
  if (!cardIsOpen(event.target) && cardsInTurn.length < 2 && cardsCorrect < cardCount) {
    openCard(event.target);
    if (cardsInTurn.length === 2) {
      if (cardsInTurn[0] === cardsInTurn[1]) {
        console.log("match");
        showMatch();
        cardsCorrect += 2;
        // TODO: check if cardsCorrect === cardCount
        cardsInTurn.length = 0;
      } else {
        console.log("no match");
        setTimeout(closeOpenCards, 1000);
      }
      turnsTaken++;
      updateTurnDisplay();
      updateScoreDisplay();
    }
  }
};

function openCard(cardElement) {
  cardsInTurn.push(getCardName(cardElement));
  displaySymbol(cardElement);
};

function cardIsOpen(cardElement) {
  return cardElement.classList.contains('open') || cardElement.classList.contains('match');
}

function getCardName(cardElement) {
  // TODO: try to find a more robust way to do this
  return cardElement.firstChild.classList.item(1);
};

function displaySymbol(cardElement) {
  cardElement.classList.add('open', 'show');
};

function closeOpenCards() {
  document.querySelectorAll('.open').forEach(function (element) {
    element.classList.remove('open', 'show');
  });
  cardsInTurn.length = 0;
};

function showMatch() {
  document.querySelectorAll('.open').forEach(function (element) {
    element.classList.add('match');
    element.classList.remove('open', 'show');
  });
};

function updateTurnDisplay() {
  const turnString = turnsTaken === 1 ? ' Turn' : ' Turns';
  document.querySelector('.turns').textContent = turnsTaken + turnString;
};

function updateScoreDisplay() {
  // Maximum score of 3 stars is available if you take <16 turns. Then 2 stars for <32, 1 star for 32+
  let score = Math.max(1, maxScore - Math.floor(turnsTaken / cardCount));
  // Hide stars instead of removing them, so that the spacing remains consistent.
  document.querySelectorAll('.fa-star').forEach(function (element, index) {
    if (index + 1 > score) {
      element.style.visibility = 'hidden';
    }
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
