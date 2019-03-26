//Node
const fs = require('fs');
//Mine, all mine!
const log = require('./log.js').log;

const DEBUG = 0;
const WARNING = 4;
const SUCCESS = 6;
const ERROR = 8;
const CATASTROPHE = 16;

let substitutions = {};

module.exports = {

	substitute: function substitute(set, s){
		console.log(DEBUG, `Substituting ${set} in ${s}`);

		if(!substitutions[set]){
			try{
				const content = fs.readFileSync('./subs/' + set + '.substitution').toString();
				const list = JSON.parse(content);
				let reString = '';
				let map = {};

				log(DEBUG, list);
		
				for(const counter in list){
					const pair = list[counter];
					map[pair[0].trim()] = pair[1].trim();
					map[pair[1].trim()] = pair[0].trim();
					list[counter] = `\\b${pair[0].trim()}\\b|\\b${pair[1].trim()}\\b`;
				}
		
				log(DEBUG, map);
				reString = list.join('|');
				log(DEBUG, reString);

				substitutions[set] = {
					reString : reString,
					map: map
				};

			}catch(oops){
				log(CATASTROPHE, oops);
			}
		}

		const map = substitutions[set].map;
		const reString = substitutions[set].reString;

		function determineReplacement(needle){
			console.log('Found', needle);
			let replacement = map[needle.toLowerCase()];
			if(needle.toLowerCase() == needle){
				return replacement.toLowerCase();
			}else if(needle.toUpperCase() == needle){
				return replacement.toUpperCase();
			}else if(needle.substring(1).toLowerCase()==needle.substring(1)){
				return replacement[0].toUpperCase() + replacement.substring(1).toLowerCase();
			}
		}
		
		
		s = s.replace(new RegExp(reString, 'mgui'), determineReplacement);

		return s;
	}

};
