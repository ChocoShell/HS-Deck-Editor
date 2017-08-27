import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {encode, decode} from "deckstrings";
import { Col, Row, Grid, Well } from 'react-bootstrap';

const getHearthstoneJSONUrl = () => "https://api.hearthstonejson.com/v1/20457/enUS/cards.collectible.json";

const applySetResult = (result) => (prevState) => ({
  cardJSON: result,
});

const applyDecoded = (result) => (prevState) => ({
  decoded: result,
});

class App extends Component {
  state = {
    deckstring: "",
    cardJSON: {},
    decoded: [],
    value: "",
    error: "",
  }

  componentWillMount() {
    this.setState({deckstring: "AAECAYO6AgKyAoLCAg60AfsBzQO9BJsFlwaIB6QHhgmyrQKCtAL1uwL4wQKBwgIA"});
    this.setState({decoded: decode("AAECAYO6AgKyAoLCAg60AfsBzQO9BJsFlwaIB6QHhgmyrQKCtAL1uwL4wQKBwgIA")});
  }

  componentDidMount() {
    this.getCardsFromDBID();
  }

  setDeck = (deck) => {
    let newDeck = deck;
    newDeck.cards = deck.cards.map((card) => {
      if (this.state.cardJSON[card[0]]) {
        return [this.state.cardJSON[card[0]].name, card[1]];
      } else {
        console.log(card[0]);
        return ["123", 2];
      } 
    });
    this.setState(applyDecoded(newDeck));
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
      .then(() => this.setDeck(this.state.decoded));

  handleChange = (event) => {
    this.setState(
      {value: event.target.value}
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    try {
      const deck = decode(this.state.value); // generates an exception
      this.setDeck(deck);
      this.setState({deckstring: this.state.value});
      this.setState({error: ""});
    }
    catch (e) {
      this.setState({error: e});
    }
  }

  render() {
    const deck = this.state.decoded.cards.map((card) => 
      <div>{card[1]} {card[0]}</div>
    );

    const format = this.state.decoded.format && this.state.decoded.format === 2 ? "Standard" : "Wild";
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.deckstring}</h2>
        </div>
        {this.state.error &&
          <div>
            {this.state.error.message}
          </div>
        }
        
        <form onSubmit={this.handleSubmit}>
          <label>
            Deck Code:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <Grid>
          <Row className="App-intro">
            <Col sm={6} md={6}>
              {this.state.cardJSON[this.state.decoded.heroes] && 
                <h2>{this.state.cardJSON[this.state.decoded.heroes].playerClass}</h2>
              }
              {this.state.decoded.format && 
                <h3>{format}</h3>
              }
              <Well className="Decklist">
                {deck}
              </Well>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
