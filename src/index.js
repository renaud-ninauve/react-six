import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Card extends React.Component {
  render() {
    return (
      <div className="card">
        <div className="card-value">{this.props.value}</div>
        <div className="card-cows">{'*'.repeat(this.props.cows)}</div>
      </div>
    );
  }
}

class PlayerDeck extends React.Component {
    render() {
      let cards = this.props.cards.map(
        (card, i) => (<Card value={card.value} cows={card.cows} key={i}/>));
      return (
        <div className="player-deck">
          {cards}
        </div>
      );
    }
}

class CardStack extends React.Component {
  render() {
    let cards = this.props.cards.map(
      (card, i) => (<Card value={card.value} cows={card.cows} key={i}/>));

    return (
      <div className="card-stack">
        {cards}
      </div>
    );
  }
}

class CardMat extends React.Component {
  render() {
    let cardStacks = this.props.cardMat.map(
      (cards, i) => (<CardStack cards={cards} key={i}/>));
    return (
      <div className="card-mat">
        {cardStacks}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
        <div>
          <CardMat cardMat={this.props.distribution.cardMat}/>
          <PlayerDeck cards={this.props.distribution.player}/>
        </div>
    );
  }
}

// ========================================

let valueCows = Array(35).fill(1);
valueCows[5] = 2;
valueCows[10] = 3;
valueCows[11] = 5;
valueCows[15] = 2;
valueCows[20] = 3;
valueCows[22] = 5;
valueCows[25] = 2;
valueCows[30] = 3;
valueCows[33] = 5;

function shuffle(arr) {
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

function createCardFromValue(value) {
  return {value: value, cows: valueCows[value]};
}

function distribute() {
  let cards = Array(34).fill().map((_, i) => i+1).map(createCardFromValue);
  shuffle(cards);

  let player = cards.slice(0, 10);
  let cpu1 = cards.slice(10, 20);
  let cpu2 = cards.slice(20, 30);
  let cardMat = cards.slice(30).map((card, i) => [card]);

  return {
    player: player,
    cpu1: cpu1,
    cpu2: cpu2,
    cardMat: cardMat
  };
}

console.log(distribute());

ReactDOM.render(
  <Game distribution={distribute()}/>,
  document.getElementById('root')
);
