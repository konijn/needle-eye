/*jshint esversion: 6, node: true */

"use strict";

const DEBUG = 0;
const WARNING = 4;
const SUCCESS = 6;
const ERROR = 8;
const CATASTROPHE = 16;
const CRITICAL = 16;

const log = require('../log.js').log;

module.exports = {
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
};
