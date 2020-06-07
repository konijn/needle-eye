/* jshint esversion: 6, node: true */

"use strict";

const DEBUG = 0;
const WARNING = 4;
const SUCCESS = 6;
const ERROR = 8;
const CATASTROPHE = 16;
const CRITICAL = 16;

//Node.js
const fs = require('fs');
//Mine, all mine!
const log = require('./log.js').log;

let substitutions = {};

module.exports = {

	substitute: function substitute(set, s){

		if(!substitutions[set]){
			try{
				const content = fs.readFileSync('./subs/' + set + '.substitution').toString();
				const list = JSON.parse(content);
				//Regular Expression String
				let reString = '';
				let map = {};
				//Because I enhanced the prototype, I cant very well use `in`
				//So I do my own tracking
				let counter = 0;
				for(const pair of list){
					//Trim first, to make the rest cleaner
					pair[0] = pair[0].trim().toLowerCase();
					pair[1] = pair[1].trim().toLowerCase();
					//Build the lookup object
					map[pair[0]] = pair[1];
					map[pair[1]] = pair[0];
					//Overwrite the pair with the regex string equivalent
					list[counter++] = `\\b${pair[0]}\\b|\\b${pair[1]}\\b`;
				}

				//Finalize the regex string
				reString = list.join('|');
				log(DEBUG, `${map.toString()}\n${reString}`);

				substitutions[set] = {reString, map};

			}catch(oops){
				log(CATASTROPHE, oops);
			}
		}

		const substitution = substitutions[set];
		const map = substitution.map;
		const reString = substitution.reString;

		function determineReplacement(needle){
			const replacement = map[needle.toLowerCase()];
			log(DEBUG, `Found '${needle}' =>'${replacement}'`);
			if(needle.toLowerCase() == needle){
				return replacement.toLowerCase();
			}else if(needle.toUpperCase() == needle){
				return replacement.toUpperCase();
			}else if(needle.substring(1).toLowerCase()==needle.substring(1)){
				return replacement[0].toUpperCase() + replacement.substring(1).toLowerCase();
			}
		}

		return s.replace(new RegExp(reString, 'mgui'), determineReplacement);
	}
};
