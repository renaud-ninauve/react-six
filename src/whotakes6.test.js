//import * as WhoTakes6 from "./whotakes6.mjs";
const whotakes6 = require('./whotakes6');

test('start', () => {
  const {players, cows} = whotakes6.start(['p1', 'p2', 'p3']);

  expect(cows).toEqual(new Map([
    ['p1', 0],
    ['p2', 0],
    ['p3', 0]
  ]));
});

test('distribute cards', () => {
  const state = {
    players: ['p1', 'p2', 'p3'],
    nextAction: {type: 'DISTRIBUTE_CARDS'}
  };
  const shuffledCards = Array(34).fill(1);
  const {hands: actualHands, cardMat: actualCardMat} =
    whotakes6.distributeCards(state, shuffledCards);

  expect(actualHands.get('p1').length).toEqual(10);
  expect(actualHands.get('p2').length).toEqual(10);
  expect(actualHands.get('p3').length).toEqual(10);
  expect(actualCardMat.length).toEqual(4);
  expect(actualCardMat.every(stack => stack.length === 1));
});

test('play cards with select stack', () => {
  const players = ['p1', 'p2', 'p3'];
  const hands = new Map([
    ['p1', [55, 44]],
    ['p2', [56, 42]],
    ['p3', [66, 57]]
  ]);
  const oldPlayedCards = new Map();
  const playedCards = new Map([
    ['p1', 55],
    ['p2', 42],
    ['p3', 57]
  ]);
  const cardMat = [
    [99],
    [99],
    [99],
    [99]
  ];
  const nextAction = {type: 'PLAY_CARDS'}
  const {nextAction: actualNextAction} =
    whotakes6.playCards({hands, players, cardMat, playedCards: oldPlayedCards, nextAction}, playedCards);

  expect(actualNextAction).toEqual({
    type: 'SELECT_STACK',
    player: 'p2'
  });
});

test('play cards with continue dispatch', () => {
  const players = ['p1', 'p2', 'p3'];
  const hands = new Map([
    ['p1', [55, 44]],
    ['p2', [56, 42]],
    ['p3', [66, 57]]
  ]);
  const oldPlayedCards = new Map();
  const playedCards = new Map([
    ['p1', 55],
    ['p2', 42],
    ['p3', 57]
  ]);
  const cardMat = [
    [1],
    [2],
    [3],
    [4]
  ];
  const nextAction = {type: 'PLAY_CARDS'}

  const {playedCards: actualPlayedCards, hands: actualHands, nextAction: actualNextAction} =
    whotakes6.playCards({hands, players, cardMat, playedCards: oldPlayedCards, nextAction}, playedCards);

  expect(actualPlayedCards).toEqual(playedCards);
  expect(actualHands).toEqual(new Map([
    ['p1', [44]],
    ['p2', [56]],
    ['p3', [66]]
  ]));
  expect(actualNextAction).toEqual({
    type: 'CONTINUE_DISPATCH',
    player: 'p2'
  });
});
