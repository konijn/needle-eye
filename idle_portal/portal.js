/*
  Idle portal
  Inspiration: various idle games
*/

var game = new Game(),
    data = game.data,
    ui   = new UI();

function Game() {

  this.data = load();
  if(this.data.gameStarted){
    addMessage('Welcome back to Idle Portal');
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
}

function update() {
  console.log('Tick');
  if (!data.gameStarted) {
    addMessage('Welcome to Idle Portal');
    addMessage('You see a Starter Portal');
    addMessage('You feel compelled to Click it');
    data.gameStarted = true;
  }
  if(data.dirty.data){
    data.dirty.data = undefined;
    save();
  }
  ui.update();
}

function addMessage(msg) {
  let list = data.messages;
  while(list.length > 4)
    list.shift();
  list.push(msg);
  data.dirty.messages = true;
}

function updateMessages(){
    ui.messages.innerHTML = data.messages.join("<br>");
}

function load() {
  return scaffoldLoad(JSON.parse(localStorage.getItem('data') || "{}"));
}

function save() {
  localStorage.setItem('data', JSON.stringify(scaffoldSave(data)));
}

function reset() {
  localStorage.removeItem('data');
  game.data = load();
  ui.refresh();
}

function help() {
  console.log("Console commands:");
  console.log("reset()");
}

function scaffoldLoad(data) {
  data.messages = data.messages || [];
  data.dirty = {};
  return data;
}

function scaffoldSave(data) {
  return data;
}

function step(timestamp) {
  UI.last = UI.last || timestamp;
  let progress = timestamp - UI.last;

}

function UI(){
  this.messages = document.getElementById('messages');
}

UI.prototype.update = function uiUpdate(){
  if(data.dirty.messages){
    updateMessages();
    data.dirty.messages = undefined;
  }
}

