/*
  Idle portal, UI
  Inspiration: various idle games
*/
/*jslint vars: true, browser: true, devel: true, esversion: 6 */
/*jshint esversion: 6, strict: true, futurehostile: true, maxerr:200, -W097  */

/*
  Fortune favors the bold
*/
"use strict";

//Cut, a chainable splice of length 1
Array.prototype.cut = function arrayCut(index){
  const entry = this[index];
  this.splice(index,1);
  return entry;
};

//
Array.prototype.query = function arrayQuery(query){
  for(const o of this){
    if(o[query.key] == query.value){
      return o;
    }
  }
};

//Pick a random entry of an array
Array.prototype.pick = function arrayPick(){
  return this[Math.floor(Math.random() * this.length)];
};

//Pick a random value of an object
Object.prototype.pick = function arrayPick(){
  return this[Object.keys(this).pick()];
};


//Prefix something with either a or an
String.prototype.an = function stringAn(){
  const c = this[0];
  return (("aeyiou".includes(c))?"an ":"a ") + this;
};

//Prefix something with either A or An
String.prototype.An = function stringAN(){
  const c = this[0];
  return (("aeyiou".includes(c))?"An ":"A ") + this;
};

//Wire a div for clickin'
HTMLDivElement.prototype.wire = function wireDiv(f){
  if(!this.wired){
    this.addEventListener("click", f);
    this.classList.add("clickable");
    this.wired = true;
  }
};
