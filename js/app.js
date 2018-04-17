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

// Create list with two cards for each icon, and shuffle it
const cardIconClasses = shuffle(cardIconNames.concat(cardIconNames));

// The total number of cards
const cardCount = cardIconClasses.length;

// The number of cards that the user has matched correctly so far
let cardsCorrect = 0;

// The cards that the user has opened in this turn
const cardsInTurn = [];

// The number of turns taken in this game
let turnsTaken = 0;
updateTurnDisplay();

// The user's score for this game
let score = 3;
updateScoreDisplay();

// Display the cards on the page
const deck = document.querySelector('.deck');
cardIconClasses.forEach(function (cardIconClass) {
  let card = document.createElement('li');
  card.classList.add('card');
  let icon = document.createElement('i');
  icon.classList.add('fa');
  icon.classList.add(cardIconClass);
  card.appendChild(icon);
  deck.appendChild(card);
});

// Handle clicks and apply game logic (determine if open cards match)
deck.addEventListener('click', clickEventListener);

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
        cardsInTurn.length = 0;
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
  // Maximum score of 3 stars is available if you take the smallest number of turns. After 32 turns, the score is 0.
  score = Math.max(0, 3 - Math.floor(turnsTaken * 1.5 / cardCount));
  console.log(turnsTaken, score);
  // Hide stars instead of removing them, so that the spacing remains consistent.
  document.querySelectorAll('.fa-star').forEach(function(element, index) {
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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
