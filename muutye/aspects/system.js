/*jshint esversion: 6, node: true */

"use strict";

const DEBUG = 0;
const WARNING = 4;
const SUCCESS = 6;
const ERROR = 8;
const CATASTROPHE = 16;
const CRITICAL = 16;

const log = require('../log.js').log;
const exec = require('child_process').execSync;

module.exports = {

  cleanSystemCall: function cleanSystemCall(command){
		//If this function does not know how to clean the command, it returns nothing
		if(command.startsWith('mcedit' )){
			return command.split(' ').slice(0,2).join(' ');
		}
		return this.systemCallIsValid(command)?command:'';
	},

	systemCallIsValid: function systemCallIsValid(command){
		//This is completely up to personal preferences,
		//I typed so often mcedit in Muutye that I decided to let it pass..
		if(command.startsWith('mcedit') ){
			const fileName = command.split(' ');
			return this.isLocalFile(fileName);
		}
		//Shorties without parameters
		if(["ls","sl","mc"].has(command)){
			return true;
		}
		return !!command;
	},

	systemCall:  function systemCall(command){
		log(DEBUG, `Getting a call for ${command}`);
		command = this.cleanSystemCall(command);
		if(!this.systemCallIsValid(command)){
			return "You wish..";
		}
		const out = exec(command);
		//Hmmmmmmmmmmmm
		//Not sure about this just yet
		return `${out}`.dropTrailing("\n").dropTrailing("\r");
	}

};
