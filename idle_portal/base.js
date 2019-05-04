/*
  Fortune favors the bold
*/

/*Cut, a chanaible splice of length 1*/
Array.prototype.cut = function arrayCut(index){
  const entry = this[index];
  this.slice(index,1);
  return entry;
};
