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
  return data;
}

function Portal(config){
  if(!config){
    this.type = "basic";
    this.resources =  {common: ["stone","lumber"], uncommon: ["blueprint"], rare:["gem"]};
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
    out += ('<span style="color: lime">' + message.content + (message.count==1?'':` (${message.count})`) + '<span>');
    ui.messages.innerHTML = out;
}

function clickBasicPortal(){
  data.imps = data.imps || 0;
  data.imps++;
  data.dirty.imps = data.dirty.data = true;
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
    data.resources[item] = data.resources[item] || 0;
    data.resources[item]++;
    data.dirty[item] = true;
    data.dirty.data = true;
    addMessage(`You sacrifice ${food.an()}, ${item} appears`);
  }
}

function clickImp(){
  feedPortal("imp");
}

function showImps(){
  const e = ui.getSubCell(ui.getCell({row:1, col:0}, "menage"), "imps");
  e.innerHTML = `<r>Imps: ${data.imps}</r>`;
  ui.wire("imps", clickImp);
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
