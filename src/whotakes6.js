const CARD_COWS = Array(35).fill(1);
CARD_COWS[5] = 2;
CARD_COWS[10] = 3;
CARD_COWS[11] = 5;
CARD_COWS[15] = 2;
CARD_COWS[20] = 3;
CARD_COWS[22] = 5;
CARD_COWS[25] = 2;
CARD_COWS[30] = 3;
CARD_COWS[33] = 5;

const CARDS_COUNT = CARD_COWS.length-1;
const CARDS_PER_HAND = 10;
const STACKS_COUNT = 4;

export function start(players) {

  return {
    players,
    cardMat: Array(STACKS_COUNT).fill([]),
    hands: new Map(players.map(p => [p , []])),
    cows: new Map(players.map(p => [p, 0])),
    playedCards: new Map(),
    nextAction: {type: 'DISTRIBUTE_CARDS'}
  };
}

export function shuffleCards() {
  let cards = Array(CARDS_COUNT).fill().map((_, i) => i+1).map(createCardFromValue);
  return shuffle(cards);

  function shuffle(arr) {
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}

export function distributeCards(state, shuffledCards) {
  const {players, nextAction} = state;

  const hands = players.reduce(
    (acc, p, i) => {acc.set(p, shuffledCards.slice(i, i+CARDS_PER_HAND)); return acc;}, new Map());

  let cardMat = shuffledCards.slice(players.length*CARDS_PER_HAND)
    .map(v => [v]);

  return {
    ...state,
    hands,
    cardMat,
    nextAction: {type: 'PLAY_CARDS'}
  };
}

export function chooseCpuCards({players, hands}) {
  return toAssociativeArray(
    players.map(p => {
      const hand = hands[p];
      const randomIndex = Math.floor(Math.random() * hand.length);
      return keyValue(p, hand[randomIndex]);
    }));
}

function playerWhoPlaysTheLowest(playedCards) {
  return Array.from(playedCards)
    .sort(([playerA, cardA], [playerB, cardB]) => cardA-cardB)[0][0];
}

function canAutoDispatch(cardMat, card) {
  return cardMat.some(stack => stack[stack.length-1]<card);
}

export function playCards(state, playedCards) {
  const {players, hands, nextAction} = state;

  if (nextAction.type !== 'PLAY_CARDS') {
    return state;
  }

  const newHands = new Map(Array.from(hands).map(keyValue => {
    const player = keyValue[0];
    const hand = keyValue[1];
    const filter = playedCards.has(player)
      ? card => card !== playedCards.get(player)
      : card => true;
    return [
      player,
      hand.filter(filter)
    ];
  }));

  return {
    ...state,
    hands: newHands,
    playedCards,
    nextAction: whatGoesNext({playedCards, cardMat: state.cardMat, hands: newHands})
  };
}

function whatGoesNext({playedCards, cardMat, hands}) {
  if (Array.from(hands)[0][1].length === 0) {
    return {type: 'DISTRIBUTE_CARDS'};
  }
  if (playedCards.size <= 0) {
    return {type: 'PLAY_CARDS'};
  }

  const nextActionPlayer = playerWhoPlaysTheLowest(playedCards);
  const nextActionType = canAutoDispatch(cardMat, playedCards.get(nextActionPlayer))
    ? 'CONTINUE_DISPATCH' : 'SELECT_STACK';
  return {type: nextActionType, player: nextActionPlayer};
}

export function continueDispatch(state) {
  const {playedCards, cardMat, cows, nextAction, hands} = state;

  if (nextAction.type !== 'CONTINUE_DISPATCH') {
    return state;
  }

  const player = playerWhoPlaysTheLowest(playedCards);
  const playedCard = playedCards.get(player);

  const targetStackIndex =
    cardMat
      .map((stack, index) => {return {index, value: stack[stack.length-1]}})
      .filter(({value}) => value<playedCard)
      .sort(({value: valueA}, {value: valueB}) => valueB-valueA)
      [O].index;

  const newTargetStack = [...cardMat[targetStackIndex]];
  const newCows = new Map(cows);
  if (newTargetStack.length == 5) {
    const addedCows = newTargetStack.reduce((acc, card) => acc + CARD_COWS[card], 0);
    newCows.set(player, newCows.get(player) + addedCows);
    newTargetStack.splice(0, newTargetStack.length, playedCard);
  }

  const newCardMat = [...cardMat].splice(targetStackIndex, 1, newTargetStack);

  const newPlayedCards = new Map(playedCards);
  newPlayedCards.delete(player);

  return {
    ...state,
    playedCards: newPlayedCards,
    cardMat: newCardMat,
    cows: newCows,
    nextAction: whatGoesNext({playedCards: newPlayedCards, cardMat: newCardMat, hands})
  }
}

export function selectStack(state, stackIndex) {
  const {playedCards, cardMat, cows, nextAction, hands} = state;

  if (nextAction.type !== 'SELECT_STACK') {
    return state;
  }

  const player = playerWhoPlaysTheLowest(playedCards);
  const playedCard = playedCards.get(player);

  const newPlayedCards = new Map(playedCards);
  newPlayedCards.delete(player);

  const newCardMat = [...cardMat].splice(stackIndex, 1, [playedCard]);

  const newCows = new Map(cows);
  const addedCows = cardMat[stackIndex].reduce((acc, card) => acc + CARD_COWS[card], 0);
  newCows.set(player, newCows.get(player) + addedCows);

  return {
    ...state,
    playedCards: newPlayedCards,
    cardMat: newCardMat,
    cows: newCows,
    nextAction: whatGoesNext({playedCards: newPlayedCards, cardMat: newCardMat, hands})
  }
}
