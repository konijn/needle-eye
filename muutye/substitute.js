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

				for(const counter in list){
					let pair = list[counter];
					//Trim first, to make the rest cleaner
					pair[0] = pair[0].trim().toLowerCase();
					pair[1] = pair[1].trim().toLowerCase();
					//Build the lookup object
					map[pair[0]] = pair[1];
					map[pair[1]] = pair[0];
					//Overwrite the pair with the regex string equivalent
					list[counter] = `\\b${pair[0]}\\b|\\b${pair[1]}\\b`;
				}

				//Finalize the regex string
				reString = list.join('|');
				log(DEBUG, `${map.toString()}\n${reString}`);

				substitutions[set] = {reString, map};

			}catch(oops){
				log(CATASTROPHE, oops);
			}
		}

		({map, reString} = substitutions[set]);

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
