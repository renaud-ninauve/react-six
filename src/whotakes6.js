const COWS_FOR_VALUE = Array(35).fill(1);
COWS_FOR_VALUE[5] = 2;
COWS_FOR_VALUE[10] = 3;
COWS_FOR_VALUE[11] = 5;
COWS_FOR_VALUE[15] = 2;
COWS_FOR_VALUE[20] = 3;
COWS_FOR_VALUE[22] = 5;
COWS_FOR_VALUE[25] = 2;
COWS_FOR_VALUE[30] = 3;
COWS_FOR_VALUE[33] = 5;

export function distributeCards() {
  let cards = Array(34).fill().map((_, i) => i+1).map(createCardFromValue);
  shuffle(cards);

  let decks = [
    {owner: 'player', cards: cards.slice(0, 10)},
    {owner: 'cpu1', cards: cards.slice(10, 20)},
    {owner: 'cpu2', cards: cards.slice(20, 30)}
  ];

  let cardMat = cards.slice(30)
    .map((card, i) => [card]);

  function createCardFromValue(value) {
    return {value: value, cows: COWS_FOR_VALUE[value]};
  }

  function shuffle(arr) {
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  return {
    decks,
    cardMat
  };
}

export function chooseCards({decks}, playerChoice, cpuStrategy=cpuCardChoiceRandom) {

  let cardsCount = decks[0].cards.length;
  let chosenCards= decks
    .map(({owner, cards}) => {
      if (owner == 'player') {
        return {card: cards[playerChoice], owner};
      }
      return {card: cards[cpuStrategy(cards)], owner};
    }).sort((a, b) => byAscendingCardValue(a.card, b.card));

  return {
    decks: decks.map(({owner, cards}) => {
      let chosenValue = chosenCards.find(({owner: eachOwner}) => eachOwner === owner).card.value;
      return {
        owner,
        cards: cards.filter(card => card.value !== chosenValue)
      };
    }),
    chosenCards
  };
}

function cpuCardChoiceRandom(cards) {
  return Math.floor(Math.random() * cards.length);
}

function byAscendingCardValue(a , b) {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}
