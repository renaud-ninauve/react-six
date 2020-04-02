import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as whotakes6 from "./whotakes6.js";

function Card({value, onClick=()=>{}}) {
  const cows = whotakes6.CARD_COWS[value];
  return (
    <div className="card" onClick={onClick}>
      <div className="card-value">{value}</div>
      <div className="card-cows">{'*'.repeat(cows)}</div>
    </div>
  );
}

function PlayerDeck({cards, onClick=(i)=>{}}) {
  let cardComponents = cards.map(
    (card, i) => (<Card value={card} key={i} onClick={() => onClick(i)}/>));
  return (
    <div className="player-deck">
      {cardComponents}
    </div>
  );
}

function CardStack({cards, onClick=(i)=>{}}) {
  let cardComponents = cards.map(
    (card, i) => (<Card value={card} key={i} onClick={() => onClick(i)}/>));

  return (
    <div className="card-stack">
      {cardComponents}
    </div>
  );
}

function CardMat({cardMat, onClick=(i)=>{}}) {
  let stacks = cardMat.map(
    (cards, i) => (<CardStack cards={cards} key={i} onClick={() => onClick(i)}/>));
  return (
    <div className="card-mat">
      {stacks}
    </div>
  );
}

function PlayedCards({playedCards}) {
  let components = Array.from(playedCards).map(
    ([player, card], i) =>
      (
        <div className="selected-card" key={i}>
          <p>{player}</p>
          <Card value={card}/>
        </div>
      )
    );
    return (
      <div className="selected-cards">
        {components}
      </div>
    );
}

function Cows({cows}) {
  return (
    <div className="scores">
      <div>
      <div>
        <h2>player</h2>
        <p>{cows.get('human')}</p>
      </div>
      <div>
        <h2>cpu1</h2>
        <p>{cows.get('cpu1')}</p>
      </div>
      <div>
        <h2>cpu2</h2>
        <p>{cows.get('cpu2')}</p>
      </div>
      </div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = whotakes6.distributeCards(
      whotakes6.start(['human', 'cpu1', 'cpu2']),
      whotakes6.shuffleCards()
    );

  }

  selectCard(playerSelectedIndex) {
    const hands = this.state.hands;
    const cardsCount = hands.get('human').length;
    const cpu1Index = Math.floor(Math.random() * cardsCount);
    const cpu2Index = Math.floor(Math.random() * cardsCount);
    const playedCards = new Map([
      ['human', hands.get('human')[playerSelectedIndex]],
      ['cpu1', hands.get('cpu1')[cpu1Index]],
      ['cpu2', hands.get('cpu2')[cpu2Index]]
    ]);

    this.setState(whotakes6.playCards(this.state, playedCards));
  }

  continueToDispatchSelectedCards() {
    const {type: nextAction, player} = this.state.nextAction;
    if (nextAction === 'SELECT_STACK' && player !== 'human') {
      this.setState(whotakes6.selectStack(this.state, Math.floor(Math.random() * 3)));
    } else {
      this.setState(whotakes6.continueDispatch(this.state));
    }
  }

  selectStack(i) {
    if (this.state.nextAction.type === 'SELECT_STACK' && this.state.nextAction.player === 'human') {
      this.setState(whotakes6.selectStack(this.state, i));
    }
  }

  render() {
    let playedCards = this.state.playedCards.size > 0
      ? (<PlayedCards playedCards={this.state.playedCards}/>) : '';
    return (
        <div>
          <p>{this.state.nextAction.type} {this.state.nextAction.player || ''}</p>
          <Cows cows={this.state.cows}/>
          <CardMat cardMat={this.state.cardMat} onClick={(i) => this.selectStack(i)}/>
          <PlayerDeck cards={this.state.hands.get('human')} onClick={(i) => this.selectCard(i)}/>
          {playedCards}
          <button onClick={()=>this.continueToDispatchSelectedCards()}>continue</button>
        </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
