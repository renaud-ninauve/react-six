import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Card extends React.Component {
  render() {
    return (
      <div className="card" onClick={this.props.onClick ? () => this.props.onClick() : () => {}}>
        <div className="card-value">{this.props.value}</div>
        <div className="card-cows">{'*'.repeat(this.props.cows)}</div>
      </div>
    );
  }
}

class PlayerDeck extends React.Component {
    render() {
      let cards = this.props.cards.map(
        (card, i) => (<Card value={card.value} cows={card.cows} key={i} onClick={() => this.props.onClick(i)}/>));
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

class SelectedCards extends React.Component {
    render() {
      let selectedCards = this.props.selectedCards.map(
        (selectedCard, i) =>
          (
            <div class="selected-card">
              <p>{selectedCard.actor}</p>
              <Card value={selectedCard.card.value} cows={selectedCard.card.cows}/>)
            </div>
          )
        );
        return (
          <div class="selected-cards">
            {selectedCards}
          </div>
        );
    }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'select_cards',
      player: props.distribution.player,
      cpu1: props.distribution.cpu1,
      cpu2: props.distribution.cpu2,
      cardMat: props.distribution.cardMat,
      selectedCards: [],
      results: { player: [], cpu1: [], cpu2: []}
    };
  }
  compareCards(a , b) {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  }
  excludeIndex(excluded) {
    return (e, i) => i != excluded;
  }
  selectCards(playerSelectedIndex) {
    let cardsCount = this.state.player.length;
    let cpu1Index = Math.floor(Math.random() * cardsCount);
    let cpu2Index = Math.floor(Math.random() * cardsCount);

    this.setState({
      status: 'show_selection',
      player: this.state.player.filter(this.excludeIndex(playerSelectedIndex)),
      cpu1: this.state.cpu1.filter(this.excludeIndex(cpu1Index)),
      cpu2: this.state.cpu2.filter(this.excludeIndex(cpu2Index)),
      cardMat: this.state.cardMat,
      selectedCards: [
          {
            card: this.state.player[playerSelectedIndex],
            actor: 'player'
          },
          {
            card: this.state.cpu1[cpu1Index],
            actor: 'cpu1'
          },
          {
            card: this.state.cpu2[cpu2Index],
            actor: 'cpu2'
          }
      ],
      results: this.state.results
    });
  }
  render() {
    return (
        <div>
          <CardMat cardMat={this.state.cardMat}/>
          <PlayerDeck cards={this.state.player} onClick={(i) => this.selectCards(i)}/>
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
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
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
    player,
    cpu1,
    cpu2,
    cardMat
  };
}

console.log(distribute());

ReactDOM.render(
  <Game distribution={distribute()}/>,
  document.getElementById('root')
);
