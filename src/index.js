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

class Deck extends React.Component {
    render() {
      let cards = this.props.cards.map(card => (<Card value={card.value} cows={card.cows}/>));
      return (
        <div className="deck">
          {cards}
        </div>
      );
    }
}

class Game extends React.Component {
  render() {
    let cards = [{value: 3, cows: 6}, {value: 3, cows: 6}, {value: 3, cows: 6}];
    return (
        <Deck cards={cards} />
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
