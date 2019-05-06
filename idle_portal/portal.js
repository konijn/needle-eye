/*
  Idle portal
  Inspiration: various idle games
*/
/*jslint vars: true, browser: true, devel: true, esversion: 6 */
/*jshint esversion: 6, strict: true, futurehostile: true, maxerr:200 */

"use strict";

let game = new Game(),
    data = game.data,
    ui   = new UI();

function scaffoldLoad(data) {
  //We need messages
  data.messages = data.messages || [];
  //We need 1 portal
  data.portals = data.portals || ["basic"];
  //We need to redraw everything
  data.dirty = {completely: true};
  return data;
}

function load() {
  return scaffoldLoad(JSON.parse(localStorage.getItem('data') || "{}"));
}

function scaffoldSave(data) {
  return data;
}

function save() {
  localStorage.setItem('data', JSON.stringify(scaffoldSave(data)));
}

function Game() {

  this.data = load();
  if(this.data.gameStarted){
    //Minor hack to make addMessage work, it requires data to be filled in
    setTimeout((nothing)=>addMessage('Welcome back to Idle Portal'), 100);
  }
  this.updateInterval = setInterval(update, 250);
}

Game.prototype.onClick = function onClick(body){
  console.log(body);
  if(body.label=="centerPortal"){
    UI.createImp(ui);
    //UI.log('You summoned an Imp');
  }
  if(body.label.startsWith('Imp,')){
    UI.createLog(ui);
    UI.remove(body);
  }
};

function update() {
  //console.log('Tick');
  if (!data.gameStarted) {
    addMessage('Welcome to Idle Portal');
    addMessage('You see a Starter Portal');
    addMessage('You feel compelled to Click it');
    data.gameStarted = true;
    data.dirty.data = true;
  }
  if(data.dirty.data){
    data.dirty.data = undefined;
    save();
  }
  ui.update();
}

function setDirty(property){
  data.dirty[property] = true;
  data.dirty.data = true;
}

function addMessage(content) {
  let list = data.messages;
  let prior = list.findIndex(message=>message.content==content);
  if(prior == -1){
    list.push({content, count:1});
  }else{
    let entry = list.cut(prior);
    entry.count++;
    list.push(entry);
  }
  while(list.length > 4){
    list.shift();
  }
  setDirty('messages');
}

//Messages are objects with content and a counter
//So we need to process those objects before displaying them
function showMessages(){
    const list = data.messages;
    //The last one is processed differently
    const count = list.length - 1;
    let out = "";
    for(let counter = 0; counter < count; counter++){
      const message = list[counter];
      out += (message.content + (message.count==1?'':`(${message.count})`) + '<br>');
    }
    const message = list[count];
    out += ('<span style="color: lime">' + message.content + (message.count==1?'':`(${message.count})`) + '<span>');
    ui.messages.innerHTML = out;
}

function clickBasicPortal(){
  console.log("Yay");
}


//Portal(s)!!!
function showPortals(){
  if(!ui.portals){
    ui.add({row:0, col:0}, "portals");
  }
  for(const portal of data.portals){
    if(typeof portal == "string" && portal == "basic"){
      ui.portals.innerHTML = "<p id=basicPortal>Starter Portal</p>";
      ui.wire("basicPortal", clickBasicPortal);
    }
  }
}


function reset(){
  localStorage.removeItem('data');
  game.data = load();
  ui.update();
}

function help() {
  console.log("Console commands:");
  console.log("reset()");
}

function step(timestamp) {
  UI.last = UI.last || timestamp;
  let progress = timestamp - UI.last;

}

function UI(){
  //Place only reference assignments here that read the static HTML
  //dynamic references should be assigned in the showXxx routines
  this.messages = document.getElementById('messages');
  this.screen = document.getElementById('screen');
  this.blank = document.body.innerHTML;
}

UI.prototype.consider= function uiConsider(property, f){
  if(data.dirty[property] || data.dirty.completely){
    f();
    //Set it to undefined, so we dont save this in the JSON
    data.dirty[property] = undefined;
  }
};

UI.prototype.update = function uiUpdate(){
  this.consider('messages', showMessages);
  this.consider('portals', showPortals);
  data.dirty.completely = undefined;
};

UI.prototype.getCell = function uiGetCell(location){
  const row = location.row,
        col = location.col,
        id = `${row}-${col}`;
  if(ui[id])
    return ui;
  const rows = ui.screen.rows;
  while(!rows[row])
    ui.screen.insertRow();
  const lastRow = rows[row];
  const cells = lastRow.cells;
  while(!cells[col])
    lastRow.insertCell();
  const cell = cells[col];
  cell.id = id;
  ui[id] = cell;
  return cell;
};

UI.prototype.add = function uiAdd(location, id){
  const cell = ui.getCell(location);
  const div = document.createElement("div");
  cell.appendChild(div);
  ui[id] = cell;
};

UI.prototype.clear = function uiClear(){
  document.body.innerHTML = ui.blank;
  data.dirty.completely = true;
};

UI.prototype.wire = function(id, f){
  const e = document.getElementById(id);
  e.addEventListener("click", f);
  e.classList.add("clickable");

  
};
