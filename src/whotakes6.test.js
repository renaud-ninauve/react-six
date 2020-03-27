//import * as WhoTakes6 from "./whotakes6.mjs";
const whotakes6 = require('./whotakes6');

test('distribute cards', () => {
  const {decks: actualDecks, cardMat: actualCardMat} =
    whotakes6.distributeCards();

  expect(actualDecks.length).toEqual(3);
  expect(actualDecks.every(({owner, cards}) => cards.length === 10));
  expect(actualCardMat.length).toEqual(4);
  expect(actualCardMat.every(stack => stack.length === 1));
});

test('choose cards', () => {
  const decks = [
    {owner: 'player', cards: [{value: 55}, {value: 44}]},
    {owner: 'cpu1', cards: [{value: 56}, {value: 42}]},
    {owner: 'cpu2', cards: [{value: 66}, {value: 57}]}
  ];
  const playerChoice = 0;
  const cpuStrategy = cards => 1;
  const {chosenCards: actualChosenCards, decks: actualDecks} =
    whotakes6.chooseCards({decks}, playerChoice, cpuStrategy);

  expect(actualChosenCards.length).toEqual(3);
  expect(actualChosenCards).toEqual([
    {owner: 'cpu1', card: {value: 42}},
    {owner: 'player', card: {value: 55}},
    {owner: 'cpu2', card: {value: 57}}
  ]);
  expect(actualDecks.find(({owner}) => owner == 'player'))
    .toEqual({owner: 'player', cards: [{value: 44}]});
  expect(actualDecks.find(({owner}) => owner == 'cpu1'))
    .toEqual({owner: 'cpu1', cards: [{value: 56}]});
  expect(actualDecks.find(({owner}) => owner == 'cpu2'))
    .toEqual({owner: 'cpu2', cards: [{value: 66}]});          
});
