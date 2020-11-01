/*
  Inspiration : Merchant RPG
  http://brm.io/matter-js/docs/index.html
  https://game-icons.net/
  https://github.com/liabru/matter-js/issues/321
*/
/*jshint esversion: 6 */

var game = new Game(),
    data = game.data,
    ui   = new UI();

function Game() {

  this.data = load();
  this.updateInterval = setInterval(update, 1000);
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
    message('Welcome to Portal Merchant');
    message('You see a start portal');
    message('You feel compelled to activate it');

  }
}

function message(msg) {

}

function load() {
  return scaffoldLoad(JSON.parse(localStorage.getItem('data') || "{}"));
}

function save() {
  localStorage.setItem('data', JSON.stringify(scaffoldSave(data)));
}

function reset() {
  localStorage.removeItem('data');
}

function help() {
  console.log("Console commands:");
  console.log("reset()");
}

function scaffoldLoad(data) {
  return data;
}

function scaffoldSave(data) {
  return data;
}




function step(timestamp) {
  UI.last = UI.last || timestamp;
  let progress = timestamp - UI.last;
}
