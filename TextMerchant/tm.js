//Text Merchant 0.1

function Game() {
  this.data = load();
  this.updateInterval = setInterval(update, 1000);
}

Game.prototype.restart = function() {
  console.log('Hello World!');
}

Game.prototype.keyPress = function keyPress(c) {
  //console.log(c);
  if (c == " ") {
    let selection = ui.getSelector();
    let item = data.inventory[selection];
    if(item.activate){
      item.activate();
    }
    //console.log(item);
  }
  ui.draw();
}

function update() {
  //console.log('Tick');
  if (!data.gameStarted) {
    message('Welcome to Portal Merchant');
    message('You see a starter portal');
    message('You feel compelled to activate it by pressing space');
    data.gameStarted = true;
  }
  save();
  ui.draw();
}

function message(msg) {
  data.messages = data.messages || [];
  data.messages.unshift(msg);
  while (data.messages.length > 25)
    data.messages.pop();
}

function load() {
  return scaffoldLoad(JSON.parse(localStorage.getItem('data') || "{}"));
}

function save() {
  localStorage.setItem('data', JSON.stringify(scaffoldSave(data)));
}

function reset() {
  localStorage.removeItem('data');
  this.data = load();
}

function help() {
  console.log("Console commands:");
  console.log("reset()");
}

function scaffoldLoad(data) {
  var i, item;
  ui.fullUpdate = true;
  data.inventory = data.inventory || [new Portal()];
  for (i = 0; i < data.inventory.length; i++) {
    let item = data.inventory[i];
    if (item._constructorName) {
      o = Object.create(this[item._constructorName].prototype);
      this[item._constructorName].apply(o, item);
      data.inventory[i] = o;
    }
  }
  return data;
}

function scaffoldSave(data) {
  for (item of data.inventory) {
    if (item.constructor.name != 'Object') {
      item._constructorName = item.constructor.name;
    }
  }
  return data;
}

function UI() {
  this.elements = {
    log: document.getElementById('log'),
    world: document.getElementById('playzone')
  }
  this.inventoryUpdate = false;
  this.fullUpdate = true;
  this.logUpdate = false;
  UI.rigKeyhandler();
}

UI.prototype.draw = function draw() {
  if (ui.fullUpdate || ui.logUpdate) {
    ui.elements.log.innerHTML = data.messages.join('<br>');
    ui.logUpdate = false;
  }
  if (ui.fullUpdate || ui.inventoryUpdate) {
    ui.selector = ui.selector || 0;
    ui.elements.world.innerHTML = "";
    if (ui.selector >= data.inventory.length) {
      ui.selector = data.inventory.length - 1;
    }
    let portals = data.inventory.filterClass(Portal).sortBy('base');
    portals.forEach(ui.showInventoryItem);
    let imps = data.inventory.filterClass(Imp).sortBy('base');
    imps.forEach(ui.showInventoryItem);

    ui.inventoryUpdate = false;
  }
  ui.fullUpdate = false;
}

UI.prototype.getSelector = function getSelector() {
  ui.selector = ui.selector || 0;
  if (ui.selector >= data.inventory.length) {
    ui.selector = data.inventory.length - 1;
  }
  return ui.selector;
}

UI.prototype.showInventoryItem = function showInventoryItem(item, index) {
  item.count = item.count || 1;
  let color = item.color || 'Purple';
  let name = item.name || item.constructor.name;
  let caseName = item.prefix ? name.toCamelCase() : name;
  let count = item.count == 1 ? "" : "(" + item.count + ")";
  let description = '<div style="color: ' + color + '">' + item.prefix + caseName + item.postfix + count + '</div>';

  if (index == ui.selector) {
    description = '<b>' + description + '</b>'
  }
  ui.elements.world.innerHTML += description;
}

UI.rigKeyhandler = function rigKeyhandler() {
  if (!UI.keyhandlerRigged) {
    document.addEventListener('keypress', e=>game.keyPress(e.key));
    UI.keyhandlerRigged = true;
  }
}

function basicInit(o){

}

function Portal(base) {
  this.base = base = base || 0;
  if (base == 0) {
    this.prefix = "";
    this.postfix = "";
  }
  this.prefix
  //this._type = 'Portal';
}

Portal.prototype.activate = function portalActivate() {
  Imp.add(0);
  ui.inventoryUpdate = true;

}

function Imp(base){
  //Base is 0, your basic imps..
  this.base = base || 0;
  this.count = 1;
  if (base == 0) {
    this.prefix = "";
    this.postfix = "";
  }
}

Imp.add = function addImp(base){

  let imps = data.inventory.filterClass(Imp).filterValue('base',0).first();
  if(!imps){
    imps = new Imp(base);
    data.inventory.push(imps);
  }else{
    imps.count++;
  }

}


var ui = new UI()
  , game = new Game()
  , data = game.data;
