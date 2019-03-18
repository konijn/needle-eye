//Dominaire 0.1

const HEART = 0;
const DIAMOND = 1;
const CLUB = 2;
const SPADE = 3; 

function $(selector){
  let cache = $.cache = $.cache || {};
  if(!cache.selector){
    cache.selector = document.querySelector(selector);
  }
  return cache.selector;
}


const suits = {
  HEART: {name: 'Hearts', symbol: '♥', color: 'red'}, 
  DIAMOND: {name: 'Diamond', symbol: '♦', color: 'red'},
  SPADE: {name: 'Spade', symbol: '♠', color: 'black'},
  CLUB: {name: 'Club', symbol: '♣', color: 'black'}
};

function Card(suit, value){
  this.suit = suit;
  this.value = value;
  //document.addElement(  );
  $("#playzone").appendChild(this.div());
}

Card.prototype.div = function(){
  if(!this.element){
    let e = document.createElement("div");
    e.className = "Card";
    e.id = this.suit + '_' + this.value;
    e.innerHTML = ""
    this.element = e;
  }
  return this.element;
}


function Deck(){

}



function Game() {
}

Game.prototype.restart = function() {
  console.log('Hello World!');
}
