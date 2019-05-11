/*
  Idle portal
  Inspiration: various idle games
*/
/*jslint vars: true, browser: true, devel: true, esversion: 6 */
/*jshint esversion: 6, strict: true, futurehostile: true, maxerr:200, -W097  */
/*globals UI, odds*/

"use strict";

let game = new Game(),
    data = game.data,
    ui   = new UI();

function Data(){
  //Do nothing
}

Data.prototype.add = function dataAdd(id, value ){
  value = value || 1;
  let path = id.split(".");
  let last = path.pop();
  let that = this;
  while(path.length){
    const step = path.shift();
    that = that[step] = that[step] || {};
  }
  that[last] = that[last] || 0;
  that[last] += value;
  this.dirty[last] = true;
  this.dirty.data = true;
};


function scaffoldLoad(data) {
  //We need messages
  data.messages = data.messages || [];
  //We need 1 portal
  data.portals = data.portals || [new Portal()];
  //We need blueprints
  data.blueprints = data.blueprints || [];
  //We need resources
  data.resources = data.resources || [];
  //We need to redraw everything
  data.dirty = {completely: true};
  //Give it some methods
  Object.setPrototypeOf(data, Data.prototype);
  return data;
}

function Portal(config){
  if(!config){
    this.type = "basic";
    this.resources =  {common: ["resources.stone","resources.lumber"], uncommon: ["blueprint"], rare:["gem"]};
  }
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
  //Either way, we will update the messages
  setDirty('messages');
  //If it's the last message, update the counter
  let list = data.messages;
  if(list.last().content == content){
    list.last().count++;
    return;
  }
  //Otherwise, see if we already saw that message
  let prior = list.findIndex(message=>message.content==content);
  //If not, add it
  if(prior == -1){
    list.push({content, count:1});
  }else{
    //Otherwise, sort it to the bottom, and set count to 1
    let entry = list.cut(prior);
    entry.count = 1;
    list.push(entry);
  }
  //Make sure we don't show to much
  while(list.length > 4){
    list.shift();
  }
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
    out += ('<span style="color: lime">' + message.content + (message.count==1?'':` (${message.count})`) + '<span>');
    ui.messages.innerHTML = out;
}

function clickBasicPortal(){
  //data.imps = data.imps || 0;
  //data.imps++;
  //data.dirty.imps = data.dirty.data = true;
  data.add("imps");
  let portal = data.portals.query({key:"type", value:"basic"});
  portal.active = true;
  addMessage("You summon an imp");
}

//Portal(s)!!!
function showPortals(){
  if(!ui.portals){
    ui.getCell({row:0, col:0}, "portals");
  }
  for(const portal of data.portals){
    if(portal.type == "basic"){
      ui.portals.innerHTML = "<p id=basicPortal>Starter Portal</p>";
      ui.wire("basicPortal", clickBasicPortal);
    }
  }
}

function feedPortal(food){
  const portal = data.portals.query({key:"active", value:true});
  if(portal.type=="basic"){
    const roll = odds.d100();
    const rarity = (roll <= 96 ? "common" : roll<=99 ? "uncommon" : "rare");
    const item = portal.resources[rarity].pick();
    data.add(item, 1);
    addMessage(`You sacrifice ${food.an()}, ${item} appears`);
  }
}

function clickImp(){
  if(data.imps){
    feedPortal("imp");
    data.add("imps", -1);
  }else{
    addMessage("There are no more imps left");
  }
}

function showImps(){
  const e = ui.getSubCell(ui.getCell({row:1, col:0}, "menage"), "imps");
  e.innerHTML = `<r>Imps: ${data.imps}</r>`;
  e.wire(clickImp);
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
