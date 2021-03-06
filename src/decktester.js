import {encode, decode} from "deckstrings";

const deck = {
  cards: [[1, 3], [2, 3], [3, 3], [4, 3]], // [dbfid, count] pairs
  heroes: [7], // Garrosh Hellscream
  format: 1, // 1 for Wild, 2 for Standard
};

const deckstring = encode(deck);
console.log(deckstring); // AAEBAQcAAAQBAwIDAwMEAw==

const decoded = decode(deckstring);
console.log(JSON.stringify(deck) === JSON.stringify(decoded)); // true
