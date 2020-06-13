/*jshint esversion: 6, node: true */

"use strict";

const DEBUG = 0;
const WARNING = 4;
const SUCCESS = 6;
const ERROR = 8;
const CATASTROPHE = 16;
const CRITICAL = 16;

//Node
const fs = require('fs');
//Mine
const log = require('../log.js').log;

module.exports = {

  createDatabase: function createDatabase(name){
		const db = this.getDatabase(name);
		const createdOn = (new Date()).toISOString();
		db.defaults({name, createdOn }).write();
		const dbCreatedOn = db.get('createdOn').value();
		if(createdOn==dbCreatedOn){
			return `Database created for ${name} as db.${name}.json`;
		}else{
			return `Database was created as db.${name}.json on ${dbCreatedOn}`;
		}
	},

	listDatabases: function listDatabases(){
		const stats = fs.readdirSync("./").filter(f=>f.endsWith('.json')).filter(f=>f.startsWith('db.'));
		stats.forEach(f=>console.log(f));
		return `Total count: ${stats.length}`;
	},

	dropDatabase: function dropDatabase(name){
		if(this.isEssentialDatabase(name)){
			return 'I cannot drop this essential database';
		}
		try{
			const file = `db.${name}.json`;
			fs.unlinkSync(file);
		}catch(e){
			console.log(e.toString().split("\n").shift().yellow);
			//console.log(JSON.stringify(e));
			return 'I am not sure this went according to plan';
		}
		return "Database dropped";
	},

	isEssentialDatabase: function isEssentialDatabase(name){
		//Name is the database, not the file name, so the name of db.plurals.json is plurals
		const essentials = this.getDatabaseState("db.json").essentials;
		return essentials.has(name);
	},

	setDatabaseAsNotEssential: function setNotEssential(db, name){
	  const state = db.getState();
	  state.essentials = state.essentials.drop(name);
	  db.setState(state).write();
	},

	setDatabaseAsEssential: function setEssential(db, name){
	  const state = db.getState();
	  state.essentials.push(name);
	  db.setState(state).write();
	},

	getDatabase: function getDatabase(name){
		const low = require('lowdb');
		const AdapterBuilder = require('lowdb/adapters/FileSync');
		//Being very flexible here, possibly inviting sloppyness
		const fileName = name.endsWith('.json') ? name : `db.${name}.json`;
		const adapter = new AdapterBuilder(fileName);
		return low(adapter);
	},

	getDatabaseState: function getDatabaseState(name){
		log(DEBUG, `Getting database state for ${name}`);
		const db = this.getDatabase(name);
		let state = db.getState();
		//For good measure, and to make writeDatabaseState happy
		state.name = name;
		return state;
	},

	writeDatabaseState: function writeDatabaseState(state){
		const db = this.getDatabase(state.name);
		db.setState(state).write();
	},

};
