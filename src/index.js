import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as whotakes6 from "./whotakes6.js";
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux'

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
    this.props.dispatch({type: 'DISTRIBUTE_CARDS', value: whotakes6.shuffleCards()});
  }

  selectCard(playerSelectedIndex) {
    const hands = this.props.hands;
    const cardsCount = hands.get('human').length;
    const cpu1Index = Math.floor(Math.random() * cardsCount);
    const cpu2Index = Math.floor(Math.random() * cardsCount);
    const playedCards = new Map([
      ['human', hands.get('human')[playerSelectedIndex]],
      ['cpu1', hands.get('cpu1')[cpu1Index]],
      ['cpu2', hands.get('cpu2')[cpu2Index]]
    ]);

    this.props.dispatch({type: 'PLAY_CARDS', value: playedCards});
  }

  continueToDispatchSelectedCards() {
    const {type: nextAction, player} = this.props.nextAction;
    if (nextAction === 'SELECT_STACK' && player !== 'human') {
      this.props.dispatch({type: 'SELECT_STACK', value: Math.floor(Math.random() * 3)});
    } else {
      this.props.dispatch({type: 'CONTINUE_DISPATCH'});
    }
  }

  selectStack(i) {
    if (this.props.nextAction.type === 'SELECT_STACK' && this.props.nextAction.player === 'human') {
      this.props.dispatch({type: 'SELECT_STACK', value: i});
    }
  }

  render() {
    let playedCards = this.props.playedCards.size > 0
      ? (<PlayedCards playedCards={this.props.playedCards}/>) : '';
    return (
        <div>
          <p>{this.props.nextAction.type} {this.props.nextAction.player || ''}</p>
          <Cows cows={this.props.cows}/>
          <CardMat cardMat={this.props.cardMat} onClick={(i) => this.selectStack(i)}/>
          <PlayerDeck cards={this.props.hands.get('human')} onClick={(i) => this.selectCard(i)}/>
          {playedCards}
          <button onClick={()=>this.continueToDispatchSelectedCards()}>continue</button>
        </div>
    );
  }
}


const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  dispatch: action => dispatch(action)
});

const ReduxGame = connect(mapStateToProps, mapDispatchToProps)(Game);

const reducer = (state, action) => {

  if (state === undefined) {
    return whotakes6.start(['human', 'cpu1', 'cpu2']);
  }
  switch (action.type) {
    case 'DISTRIBUTE_CARDS':
      return whotakes6.distributeCards(state, action.value);
    case 'PLAY_CARDS':
      return whotakes6.playCards(state, action.value);
    case 'SELECT_STACK':
      return whotakes6.selectStack(state, action.value);
    case 'CONTINUE_DISPATCH':
      return whotakes6.continueDispatch(state);
    default:
      return state
  }
};

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}><ReduxGame /></Provider>,
  document.getElementById('root')
);
