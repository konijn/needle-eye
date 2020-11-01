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
  More specifically, Igor must not be tasked with tracking state

  To keep Igor manageable, you can create a module in ./aspects
	all modules in there will be loaded in to Igor
*/

module.exports = {

	//Log the patterns of all provided categories
	//TODO, deal with regexes
	dumpPatterns: function dumpPatterns(categories){
		for(const category of categories){
			console.log(category.pattern);
		}
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

	//TODO teach Muutye about todo's so that this does not need to be hard coded
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

	isLocalFile: function isLocalFile(fileName){
		return true;
	},
	
	addConceptProperty: function addConceptProperty(db, concept, property){
		//created on -> createdOn
		property = property.camelCase();
		const state = db.getState();
		if(state.concepts[this.singular(concept)]){
			concept = this.singular(concept);
		}else if(!state.concepts[concept]){
			return `I dont know a concept called ${concept}`;
		}
		if(!state.domains[property]){
			return `I dont know a domain called ${property}`;
		}
		const dbConcept = state.concepts[concept];
		dbConcept.properties = concept.properties || [];
		dbConcept.properties.push(property);
		db.setState(state).write();
		return `${this.plural(concept)} now have a ${property}}`;
	}
	
};

/*Build Igor from aspects*/
const files = fs.readdirSync('./aspects/');
for(const file of files){
	log(DEBUG, `./aspects/${file}`);
	Object.assign(module.exports, require(`./aspects/${file}`));
}
