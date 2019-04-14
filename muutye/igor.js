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
	getUniqueTag: function getkUniqueTag(node, tag){
		const nodeList = node.getElementsByTagName(tag);
		if(nodeList.length === 0){
			log(CATASTROPHE,`Found no ${tag} tag`);
		}else if(nodeList.length > 1){
			log(WARNING,`Got ${nodeList.length-1} too many ${tag} tags in ${node.tagName}`);
		}
		return nodeList[0];
	},
	
	//Log the patterns of all provided categories
	dumpPatterns: function dumpPatterns(categories, logLevel){
		logLevel = logLevel || SUCCESS;
		for(const category of categories){
			log(logLevel, category.pattern);
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
	}

};