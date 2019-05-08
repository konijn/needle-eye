/*
  Idle portal, UI
  Inspiration: various idle games
*/
/*jslint vars: true, browser: true, devel: true, esversion: 6 */
/*jshint esversion: 6, strict: true, futurehostile: true, maxerr:200, -W097 */
/*allow assignment returns*/
/*jshint -W093  */
/*globals data*/

"use strict";

function UI(){
  //Place only reference assignments here that read the static HTML
  //dynamic references should be assigned in the showXxx routines
  this.messages = document.getElementById('messages');
  this.screen = document.getElementById('screen');
  this.blank = document.body.innerHTML;
}

UI.prototype.consider= function uiConsider(property, f){
  if(data[property] !== undefined && (data.dirty[property] || data.dirty.completely)){
    f();
    //Set it to undefined, so we dont save this in the JSON
    data.dirty[property] = undefined;
  }
};

UI.prototype.update = function uiUpdate(){
  this.consider('messages', showMessages);
  this.consider('portals', showPortals);
  this.consider('imps', showImps);
  data.dirty.completely = undefined;
};

UI.prototype.getQuadrant = function uiGetQuadrant(location){
  const row = location.row,
        col = location.col,
        id = `${row}-${col}`;
  if(this[id])
    return this[id];
  const rows = this.screen.rows;
  while(!rows[row])
    this.screen.insertRow();
  const lastRow = rows[row];
  const cells = lastRow.cells;
  while(!cells[col])
    lastRow.insertCell();
  const quadrant = cells[col];
  quadrant.id = id;
  this[id] = quadrant;
  return quadrant;
};

UI.prototype.getCell = function uiAdd(location, id){
  //If we have it, return it
  if(this[id]){
    return this[id];
  }
  //Otherwise, create it
  const quadrant = this.getQuadrant(location);
  const cell = document.createElement("div");
  cell.id = id;
  quadrant.appendChild(cell);
  this[id] = cell;
  //And return it
  return cell;
};

UI.prototype.getSubCell = function(parentElement, id){
  if(this[id]){
    return this[id];
  }
  const subCell = document.createElement("div");
  parentElement.appendChild(subCell);
  subCell.id = id;
  return this[id] = subCell;
};

UI.prototype.clear = function uiClear(){
  document.body.innerHTML = this.blank;
  data.dirty.completely = true;
};

UI.prototype.wire = function(id, f){
  const e = document.getElementById(id);
  e.addEventListener("click", e=>{f(e); this.clearTextSelection();});
  e.classList.add("clickable");
};

//https://stackoverflow.com/a/3169849/7602
UI.prototype.clearTextSelection = function uiClearTextSelection(){
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE
    document.selection.empty();
  }
};
