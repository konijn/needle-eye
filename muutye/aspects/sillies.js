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

  addSilly: function addSilly(challenge, response){

		const state = this.getDatabaseState('silly');
		state.sillies = state.sillies || {};
		//If the user uses a comma in his sentence, drop the comma
		if(challenge.endsWith(',')){
			challenge = challenge.slice(0, -1);
		}
		state.sillies[challenge] = response;
		this.writeDatabaseState(state);
	},

	loadSillies: function loadSillies(HAL){
		const state = this.getDatabaseState('silly');
		for(const silly of Object.keys(state.sillies).map(key=>key.toLowerCase())){
			//Drop what is known so far, just in case
			HAL.brain.categories = HAL.brain.categories.filter(cat=>cat.pattern!=silly);
			//Building a parsed XML node by hand, Madness, I tell you, madness!!!!
			HAL.brain.categories.push({ pattern:silly,
			                            template: {
			                              childNodes: [
			                                { nodeName: '#text',
			                                  nodeValue: state.sillies[silly],
			                                  parentNode: {nodeName:'template'}
			                                }]}});
		}
	},

	dropSilly: function dropSilly(HAL, silly){
			//Drop from current brainCategories
			HAL.brain.categories = HAL.brain.categories.filter(cat=>cat.pattern!=silly);
			//Drop from database
			const state = this.getDatabaseState('silly');
			if(state.sillies[silly]){
				delete state.sillies[silly];
				this.writeDatabaseState(state);
				return `I wont respond to ${silly} any more.`;
			}else{
				return "I've not heard that one before.";
			}
	},

};
