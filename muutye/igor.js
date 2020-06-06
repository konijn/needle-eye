/*jshint esversion: 6 */

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
const log = require('./log.js').log;


/*
  Design philosophy for Igor
  Igor is in essence brain less, he can work with what you give, and he can log
  More specifically, Igor should not be tasked with tracking state
*/


module.exports = {

	//Search for a given tag that is in a subnode, ensure there is only one
	getUniqueTag: function getUniqueTag(node, tag){
		const nodeList = node.getElementsByTagName(tag);
		if(nodeList.length === 0){
			log(CATASTROPHE,`Found no ${tag} tag`);
		}else if(nodeList.length > 1){
			log(WARNING,`Got ${nodeList.length-1} too many ${tag} tags in ${node.tagName}`);
		}
		return nodeList[0];
	},

	//Search for a given tag, report whether it was found or not
	hasTag: function hasTag(node, tag){
		return !!node.getElementsByTagName(tag).length;
	},

	//Search for a given tag, report whether it was found or not
	getTags: function getTags(node, tag){
		return Array.from(node.getElementsByTagName(tag));
	},

	//Log the patterns of all provided categories
	dumpPatterns: function dumpPatterns(categories){
		for(const category of categories){
			console.log(category.pattern);
		}
	},

	//THIS sentence Capitalized -> This Sentence Capitalized
	capitalize: function capitalize(s){
		return s.split(" ").map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(" ");
	},

	//THIS sentence Capitalized. -> This sentence capitalized.
	sentence: function sentence(s){
		return s[0].toUpperCase() + s.slice(1);
	},

	//Valid filenames consist of 12 characters, a dot, and up to 3 characters
	isValidFileName: function isValidFileName(s){
		return s.match(/^\w{1,12}\.\w{1,3}$/g);
	},

	//Check the file system, if the folder does not exist, create it
	ensureSubFolder: function ensureSubFolder(folder){
		if(!fs.existsSync('./' + folder)){
			fs.mkdirSync(folder);
		}
	},

	//nodes are not arrays, so we cant use Array.prototype.filter
	filterNodes: function filterNodes(nodes, filter){
		const out = [];
		for(let i = 0; i < nodes.length; i++){
			if(filter(nodes[i]))
				out.push(nodes[i]);
		}
		return out;
	},

	getRandomIntInclusive: function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		//The maximum is inclusive and the minimum is inclusive
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	addConcept: function addConcept(db, concept){
		//Check if we know the concept already
		const state = db.getState();
		if(state.concepts[concept]){
			return "I already know this concept";
		}else{
			state.concepts[concept] = {list:[]};
			db.setState(state).write();
			return `I now know the concept of ${ concept }`;
		}
	},

	dropConcept: function dropConcept(db, concept){
		//Check if we know the concept already in the main database
		const state = db.getState();
		if(state.concepts[concept]){
			delete state.concepts[concept];
			db.setState(state);
			db.write();
			return `I forgot all about the concept of ${ concept }`;
		}else{
			return `I don't know the concept of ${ concept }`;
		}
	},
	
	
	considerConcept: function considerConcept(concept){
		
	},

	createDatabase: function createDatabase(name){
		const low = require('lowdb');
		const AdapterBuilder = require('lowdb/adapters/FileSync');
		const adapter = new AdapterBuilder(`db.${name}.json`);
		const db = low(adapter);
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
		//TODO Flesh this out, for now, make sure to never drop the main database
		//Name is the database, not the file name, so the name of db.plurals.json is plurals
		return !name || name == 'plurals';

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
		const db = this.getDatabase(name);
		let state = db.getState();
		//For good measure, and to make setDatabaseState happy
		state.name = name;
		return state;
	},
	
	writeDatabaseState: function setDatabaseState(state){
		const db = this.getDatabase(state.name);
		db.setState(state).write();
	},
	
	addPlural: function addPlural(singular, plural){
		const low = require('lowdb');
		const AdapterBuilder = require('lowdb/adapters/FileSync');
		const adapter = new AdapterBuilder(`db.plurals.json`);
		const db = low(adapter);
		let state = db.getState();
		//console.log(singular, plural);
		//console.log('state', state);
		state.plurals = state.plurals || {};
		state.singulars = state.singulars || {};
		const currentPlural = state.plurals[singular];
		if(currentPlural){
			delete state.plurals[singular];
			delete state.singulars[plural];
		}
		state.plurals[singular] = plural;
		state.singulars[plural] = singular;

		db.setState(state).write();
	},
	
	plural: function plural(word){
		
		const state = this.getDatabaseState('plurals');

		if(state.plurals[word]){
			return state.plurals[word];
		}

		//Things are slightly complicated when the word already ends with an "s," or with a "ch," "sh," "x," or "z."
		//In this case, it's often correct to add "es" instead.
		if(word.endsWith('s') || word.endsWith('ch') || word.endsWith('sh') || word.endsWith('x') || word.endsWith('z')){
			return word + 'es';
		}
		
		if(word.endsWith('y')){
			return word.replace(/y$/,"ies");
		}
		
		return word + 's';
	},
	
	singular: function singular(word){

		const state = this.getDatabaseState('plurals');

		if(state.singulars[word]){
			return state.singulars[word];
		}

		//Things are slightly complicated when the word already ends with an "s," or with a "ch," "sh," "x," or "z."
		//In this case, it's often correct to add "es" instead.
		if(word.endsWith('ses') || word.endsWith('xes') || word.endsWith('zes') || word.endsWith('ches') || word.endsWith('shes')){
			return word.slice(0,-2);
		}
		
		if(word.endsWith('ies')){
			return word.replace(/ies$/,"y");
		}
		
		if(word.endsWith('s')){
			return word.slice(0,-1);
		}
		
		return word;
	},
	
	addSilly: function addSilly(challenge, response){
		
		console.log(`${challenge} -> ${response}`);
		const state = this.getDatabaseState('silly');
		state.sillies = state.sillies || {};
		state.sillies[challenge] = response;
		//console.log("Igor", this);
		console.log(state);
		this.writeDatabaseState(state);
		
	}
	
};tate.sillies || {};
		state.sillies[challenge] = response;
		//console.log("Igor", this);
		console.log(state);
		this.writeDatabaseState(state);
		
	}
	
};