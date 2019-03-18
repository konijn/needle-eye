//Text Merchant 0.1
//Vue Style

var ui, game, data;

function Game() {
  this.data = load();
  this.updateInterval = setInterval(update, 250);
}

Game.prototype.restart = function() {
  console.log('Hello World!');
}

Game.prototype.keyPress = function keyPress(c) {
  //console.log(c);
  if (c == " ") {
    let selection = ui.getSelector();
    let item = ui.selectedItem || data.inventory[0];
    if(item.activate){
      item.activate();
    }
    //console.log(item);
    ui.draw();
  }
  if(c == "r"){
    reset();
    update();
  }
}

function update() {
  //console.log('Tick');
  if (!data.gameStarted) {
    message('Welcome to Portal Merchant');
    message('You see a <m>starter portal</m>');
    message('You feel compelled to activate it by pressing <i>space</i>');
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
  ui.logUpdate = true; 
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
      Object.assign(o, item);
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
    world: document.getElementById('playzone'),
    details: document.getElementById('details')
  }
  this.inventoryUpdate = false;
  this.fullUpdate = true;
  this.logUpdate = false;
  UI.rigKeyhandler();
  UI.rigMousehandler();
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
    let imps = data.inventory.filterClass(Imp).sortBy('base');
    let inv = [...portals, ...imps];
    inv.forEach(ui.showInventoryItem);
    
    ui.selectedItem = inv[ui.selector];
    ui.elements.details.innerHTML = ui.selectedItem.toString();

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
  item.guid = item.guid || guid();
  let color = item.color || 'Purple';
  let name = item.name || item.constructor.name;
  let caseName = item.prefix ? name.toCamelCase() : name;
  let count = item.count == 1 ? "" : "(" + item.count + ")";
  let description = item.prefix + caseName + item.postfix + count;
  //&emsp;
  let selector = (index == ui.selector ? '&gt;' : '&nbsp;');
  let classNames = 'item';
      classNames = classNames + (index == ui.hooveror ? ' u' : '');
      classNames = classNames + (index == ui.selector ? ' b' : '');
  let style = `color:${color}`;   
  let id = "item_" + index;
  //let html = '<div id="item_' + index + '" class="item' + classNames + '"  data-idx="' + item.guid + '">' + selector + '</div>';
  let html = `<div id="${id}" class="${classNames}" style="${style}" data-idx="${item.guid}">${selector}${description}</div>`;

  ui.elements.world.innerHTML += html;
}

UI.rigKeyhandler = function rigKeyhandler() {
  if (!UI.keyhandlerRigged) {
    document.addEventListener('keypress', e=>{game.keyPress(e.key), e.stopPropagation()});
    UI.keyhandlerRigged = true;
  }
}


UI.mousehandler = function mousehandler(e){
  e = e.srcElement;
  if(e.className!="item")
    return;
  
}


UI.rigMousehandler = function rigMousehandler() {
  if (!UI.mousehandlerRigged) {
    document.addEventListener('click', UI.mousehandler);
    UI.mousehandlerRigged = true;
  }
}


function basicInit(o){

}

function Portal(base) {
  this.base = base = base || 0;
  this.used = 0;
  if (base == 0) {
    this.prefix = "";
    this.postfix = "";
  }
  this.prefix
  //this._type = 'Portal';
}

Portal.prototype.activate = function portalActivate() {
  this.used++;
  Imp.add(0);
  ui.inventoryUpdate = true;

}

Portal.prototype.toString = function portalToString(){
  if(this.base==0){
    return "You see a basic starter portal";
  }
}

function Imp(base){
  //Base is 0, your basic imps..
  this.base = base || 0;
  this.count = 1;
  if (base == 0) {
    this.prefix = "";
    this.postfix = "";
    this.color = "red";
  }
}

Imp.add = function addImp(base){

  let imps = data.inventory.filterClass(Imp).filterValue('base',0).first();
  if(!imps){
    imps = new Imp(base);
    data.inventory.push(imps);
    message('You summed your first <r>imp</r>');
    message('You can selected it with the <i>arrow keys</i> or by <i>clicking it</i>');
  }else{
    imps.count++;
  }
}



ui = new UI();
game = new Game();
data = game.data;
update();
