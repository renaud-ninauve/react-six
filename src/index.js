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
      (card, i) => (<Card value={card.value} cows={card.cows} key={i} onClick={() => this.props.onClick()}/>));

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
      (cards, i) => (<CardStack cards={cards} key={i} onClick={() => this.props.onClick(i)}/>));
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
            <div className="selected-card" key={i}>
              <p>{selectedCard.actor}</p>
              <Card value={selectedCard.card.value} cows={selectedCard.card.cows}/>
            </div>
          )
        );
        return (
          <div className="selected-cards">
            {selectedCards}
          </div>
        );
    }
}

class Scores extends React.Component {
  render() {
    let scores = this.props.scores;
    return (
      <div className="scores">
        <div>
        <div>
          <h2>player</h2>
          <p>{scores.player}</p>
        </div>
        <div>
          <h2>cpu1</h2>
          <p>{scores.cpu1}</p>
        </div>
        <div>
          <h2>cpu2</h2>
          <p>{scores.cpu2}</p>
        </div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: props.distribution.player,
      cpu1: props.distribution.cpu1,
      cpu2: props.distribution.cpu2,
      cardMat: props.distribution.cardMat,
      selectedCards: [],
      scores: { player: 0, cpu1: 0, cpu2: 0}
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
    return (e, i) => i !== excluded;
  }
  selectStack(index) {
    console.log('selectStack ' + index);
  }
  selectCards(playerSelectedIndex) {
    if (this.state.selectedCards.length > 0) {
      return;
    }
    let cardsCount = this.state.player.length;
    let cpu1Index = Math.floor(Math.random() * cardsCount);
    let cpu2Index = Math.floor(Math.random() * cardsCount);
    let selectedCards =
    [
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
    ].sort((a, b) => this.compareCards(a.card, b.card));

    this.setState({
      player: this.state.player.filter(this.excludeIndex(playerSelectedIndex)),
      cpu1: this.state.cpu1.filter(this.excludeIndex(cpu1Index)),
      cpu2: this.state.cpu2.filter(this.excludeIndex(cpu2Index)),
      cardMat: this.state.cardMat,
      selectedCards: selectedCards,
      scores: this.state.scores
    });
  }
  continueToDispatchSelectedCards() {
    if (this.state.selectedCards.length === 0) {
      return;
    }
    let scores = {...this.state.scores};
    let selectedCard = this.state.selectedCards[0];
    let cardMat = [...this.state.cardMat];
    let targetStacks = cardMat
      .filter(arr => arr[arr.length-1].value < selectedCard.card.value)
      .sort((a, b) => this.compareCards(a[a.length-1], b[b.length-1]));
    if (targetStacks.length > 0) {
      let targetStack = targetStacks[targetStacks.length-1];
      if (targetStack.length < 5) {
        targetStack
          .push(selectedCard.card);
      } else {
        let cows = targetStack
          .reduce((acc, card) => acc+card.cows, 0);
        scores[selectedCard.actor] = scores[selectedCard.actor] + cows;
        targetStack
          .splice(0, targetStack.length, selectedCard.card);
      }
      this.setState({
        ...this.state,
        selectedCards: this.state.selectedCards.slice(1),
        cardMat,
        scores});
    } else if (selectedCard.actor !== 'player') {
      let selectedStackIndex = Math.floor(Math.random() * 3);
      let cows = this.state.cardMat[selectedStackIndex]
        .reduce((acc, card) => acc+card.cows, 0);
      scores[selectedCard.actor] = scores[selectedCard.actor] + cows;
      let cardMat = [...this.state.cardMat];
      cardMat[selectedStackIndex] = [selectedCard.card];
      this.setState({
        ...this.state,
        selectedCards: this.state.selectedCards.slice(1),
        cardMat,
        scores
      });
    }
  }
  selectStack(i) {
    if (this.state.selectedCards.length <= 0 || this.state.selectedCards[0].actor !== 'player') {
      return;
    }
    let selectedCard = this.state.selectedCards[0];
    if (this.state.cardMat.some(arr => arr[arr.length-1].value < selectedCard.card.value)) {
      return;
    }
    let scores = {...this.state.scores};
    let cows = this.state.cardMat[i]
      .reduce((acc, card) => acc+card.cows, 0);
    scores[selectedCard.actor] = scores[selectedCard.actor] + cows;
    let cardMat = [...this.state.cardMat];
    cardMat[i] = [selectedCard.card];
    this.setState({
      ...this.state,
      selectedCards: this.state.selectedCards.slice(1),
      cardMat,
      scores
    });
  }
  render() {
    let selectedCards = this.state.selectedCards.length > 0
      ? (<SelectedCards selectedCards={this.state.selectedCards}/>) : '';
    return (
        <div>
          <Scores scores={this.state.scores}/>
          <CardMat cardMat={this.state.cardMat} onClick={(i) => this.selectStack(i)}/>
          <PlayerDeck cards={this.state.player} onClick={(i) => this.selectCards(i)}/>
          {selectedCards}
          <button onClick={()=>this.continueToDispatchSelectedCards()}>continue</button>
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
