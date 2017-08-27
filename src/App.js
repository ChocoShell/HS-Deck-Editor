/*
  Reorder by mana cost and alphabetical
  Left Align in it's own box
  Fetch and Cache images
  Export deck lists
  Figure elegant way to access card json.
  Refactor into separate functions and files.
*/

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {encode, decode} from "deckstrings";

const getHearthstoneJSONUrl = () => "https://api.hearthstonejson.com/v1/20457/enUS/cards.collectible.json";

const applySetResult = (result) => (prevState) => ({
  cardJSON: result,
});

const applyDeck = (result) => (prevState) => ({
  deck: result,
});

class App extends Component {
  state = {
    deckstring: "",
    cardJSON: {},
    deck: [],
    decoded: [],
  }

  componentWillMount() {
    this.setState({deckstring: "AAECAYO6AgKyAoLCAg60AfsBzQO9BJsFlwaIB6QHhgmyrQKCtAL1uwL4wQKBwgIA"});
    this.setState({decoded: decode("AAECAYO6AgKyAoLCAg60AfsBzQO9BJsFlwaIB6QHhgmyrQKCtAL1uwL4wQKBwgIA")});
  }

  componentDidMount() {
    this.getCardsFromDBID();
  }

  setDeck = () => {
    const deck = this.state.decoded.cards.map((card) => [this.state.cardJSON[card[0]].name, card[1]]);
    this.setState(applyDeck(deck));
  }

  onSetResult = (result) => {
    let cards = {};
    result.forEach((card) => {
      cards[card.dbfId] = card
    });
    console.log(cards);
    this.setState(applySetResult(cards))
  };

  getCardsFromDBID = () =>
    fetch(getHearthstoneJSONUrl())
      .then(response => response.json())
      .then(result => this.onSetResult(result))
      .then(() => this.setDeck());

  render() {
    const deck = this.state.deck.map((card) => 
      <div>{card[1]} {card[0]}</div>
    );

    const format = this.state.decoded.format && this.state.decoded.format === 2 ? "Standard" : "Wild";
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.deckstring}</h2>
        </div>
        <p className="App-intro">
          {this.state.cardJSON[this.state.decoded.heroes] && 
            <h2>{this.state.cardJSON[this.state.decoded.heroes].playerClass}</h2>
          }
          {this.state.decoded.format && 
            <h3>{format}</h3>
          }
          {deck}
        </p>
      </div>
    );
  }
}

export default App;
