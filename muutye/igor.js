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

	addToConcept: function addToConcept(HAL, s){
		const state = HAL.db.getState();
		const concept = this.singular(HAL.brain.predicates.considering);
     //console.log('Hello World!', concept, s);
		if(!concept){
			return 'I need to consider a concept first'.yellow;
		}
		if(!state.concepts[concept]){
			return `I don't know about the concept of ${this.plural(concept)}`.yellow;
		}
		if(!(state.concepts[concept].list instanceof Array)){
			return `I don't think ${this.plural(concept)} is a proper concept`.yellow;
		}
		//console.log('we made it');
		const position = state.concepts[concept].list.push(s);
		HAL.db.setState(state).write();
		return `I now know about ${position} ${this.plural(concept)}`;
	},

	list: function list(HAL, s){
		const original = s;
		if(!s){
			s = HAL.brain.predicates.considering;
		}
		if(!s){
			return `I dont know what you want a list of`;
		}
		const state = HAL.db.getState();
		if(!state.concepts[s] && s.endsWith('s')){
			s = this.singular(s);
		}
		if(!state.concepts[s] && state[original]){
			console.log(state[original].numberedList());
		}
		if(!state.concepts[s] && state[s]){
			console.log(state[s].numberedList());
		}
		if(state.concepts[s]){
			const list = state.concepts[s].list;
			const idLength = (list.length + " ").length;
			return state.concepts[s].list.map((concept,id)=>`${(id+1+'').alignLeft(idLength)} ${concept}`).join('\n');
		}
		return `Not sure about the concept of ${s}`;
	},

	considerConcept: function considerConcept(HAL, concept){
		//Okay
		concept = concept.endsWith('s')?concept:this.plural(concept);
		if(HAL.db.getState()[concept]){
				return `There is no point in considering ${concept}`;
		}
		HAL.brain.predicates.considering = concept;
		return `Focusing now on ${concept}`;
	},

	addDomain: function addDomain(db, domain, type){
		domain = domain.split(/\s/).map(s=>s.capitalize()).join("").decapitalize();
		const state = db.getState();
		if(!state.types.has(type)){
			return `I dont know the ${type} type`;
		}
		state.domains[domain] = type;
		console.log(state);
		db.setState(state).write();
	},

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
		console.log(essentials);
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

		const state = this.getDatabaseState('silly');
		state.sillies = state.sillies || {};
		state.sillies[challenge] = response;
		this.writeDatabaseState(state);
	},

	loadSillies: function loadSillies(HAL){
		const state = this.getDatabaseState('silly');
		for(const silly of Object.keys(state.sillies)){
			//Building a parsed XML node by hand..
			//Madness, I tell you, madness!!!!
			HAL.brain.categories.push({ pattern:silly.toLowerCase(),
			                            template: {
			                              childNodes: [
			                                { nodeName: '#text',
			                                  nodeValue: state.sillies[silly],
			                                  parentNode: {nodeName:'template'}
			                                }]}});
		}
	},

	addTodo: function addTodo(task){
		const state = this.getDatabaseState('todo');
		state.list = state.list || [];
		state.list.push({task, createdOn:(new Date()).toISOString()});
		console.log(state);
		this.writeDatabaseState(state);
	},

	dropTodo: function dropTodo(task){
		const state = this.getDatabaseState('todo');
	},

	listTodo: function listTodo(){
		const state = this.getDatabaseState('todo');
	},

};
