/*
  Idle portal
  Inspiration: various idle games
*/
/*jslint browser: true, devel: true */


function scaffoldLoad(data) {
  data.messages = data.messages || [];
  data.dirty = {};
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

function showMessages(){
    const list = data.messages;
    const count = list.length;

    ui.messages.innerHTML = data.messages.join("<br>");
}

function reset() {
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
  this.messages = document.getElementById('messages');
}

UI.prototype.consider= function uiConsider(property, f){
  if(data.dirty[property] || data.dirty.completely){
    f();
    data.dirty[property] = undefined;
  }
};

UI.prototype.update = function uiUpdate(){
  this.consider('messages', showMessages);
  data.dirty.completely = false;
};

var game = new Game(),
    data = game.data,
    ui   = new UI();
