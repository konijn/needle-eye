//Converted AIML files come from
//https://github.com/hosford42/aiml_bot/tree/master/aiml_bot
//XML DOM is provided by https://www.npmjs.com/package/xmldom
//Colors are provided by https://github.com/Marak/colors.js

//Node
//Evil global :/
io = require('readline').createInterface({ input: process.stdin, output: process.stdout });
//NPM
const colors = require('colors');
const xmldom = require('xmldom');
//Mine, all mine!
const fs = require('fs');
const ut = require('./ut.js');
const log = require('./log.js').log;

const DEBUG = 0;
const WARNING = 4;
const SUCCESS = 6;
const ERROR = 8;
const CATASTROPHE = 16;

let cue = 'Muutye awakens..';
//As long as we are interested, we keep going
let interested = true;
//What AIML version do we support?
const supportedAIMLVersion = '1.0';
//The brain..

let Igor = {
	
	getUniqueTag: function getkUniqueTag(node, tag){
		const nodeList = node.getElementsByTagName(tag);
		if(nodeList.length === 0){
			log(CATASTROPHE,`Found no ${tag} tag`);
		}else if(nodeList.length > 1){
			log(WARNING,`Got ${nodeList.length-1} too many ${tag} tags in ${node.tagName}`);
		}
		return nodeList[0];
	},
	
	dumpPatterns: function dumpPatterns(categories, logLevel){
		logLevel = logLevel || SUCCESS;
		for(const category of categories){
			log(logLevel, category.pattern);
		}
	}
}

let HAL = {
	cue: 'Muutye awakens..', //Cue because prompt is already taken
	interested: true, //As long as we are interested, we keep going
	supportedAIMLVersion: '1.0', //What AIML version do we support?
	
	io: io,
	
	brain : {
		categories: []
	},
	
	parse: function parse(doc){
		
		const aiml = Igor.getUniqueTag(doc, 'aiml');
		const aimlVersion = aiml.getAttribute('version');
		if(aimlVersion === undefined){
			log(WARNING,"aiml files should have a top level aiml member");
		}
		if(aimlVersion != supportedAIMLVersion){
			log(WARNING,`Muutye understands version ${supportedAIMLVersion} not ${aiml.version}`);
		}
		//Get categories
		let categories = aiml.getElementsByTagName('category');
		log(DEBUG,`${categories.length} categor${categories.length==1?'y was':'ies were'} loaded`);
		let brainCategories = [];
		for(let counter = 0; counter < categories.length; counter++){
			const category = categories[counter];
			const pattern = Igor.getUniqueTag(category, 'pattern');
			let jCategory = {
				pattern: pattern.textContent.toLowerCase(),
				template: Igor.getUniqueTag(category, 'template')
			};
			brainCategories.push(jCategory);
		}
		Igor.dumpPatterns(brainCategories);
		//Add the categories to the brain
		HAL.brain.categories = HAL.brain.categories.concat(brainCategories);
		//log(DEBUG, HAL.brain.categories);
	},
	
	loadAIML: function loadAIML(filename){

		log(DEBUG, ('Loading ' + filename).yellow);
		
		try {
			let content = fs.readFileSync(filename).toString();
			if(content.startsWith('<xml')){
				content = '<xml xmlns="a" xmlns:c="./lite">\n' + content + '</xml>';
			}
			const doc = new xmldom.DOMParser().parseFromString(content, 'text/xml');
			HAL.parse(doc);
		}
		catch(error) {
			log(ERROR, error);
			console.log(error.stack);
		}
	},

	findCategory: function findCategory(input){
		input = input.toLowerCase();

		for(const category of HAL.brain.categories){
			if(category.pattern == input){
				return category;
			}
		}
	},
	
	runNode: function runNode(node){
		//console.log(category);
		let out = '';
		if(!node)
			return;
		for(let counter = 0 ; counter < node.childNodes.length; counter++){
			const child = node.childNodes[counter];
			console.log('Child', counter, child.nodeType, child.nodeName);
			//Text node
			if(child.nodeName == '#text'){
				out += child.nodeValue.trim();
			}else if(child.nodeName == 'br'){
				out += '\n';
			}else if(child.nodeName == 'script'){
				//
				const source = runNode(child);
				log(WARNING, 'Executing ' + source+ '\n');
				try{
					out += eval(source);
				}catch(exception){
					log(ERROR, `Something went horribly wrong: ${exception}`);
				}
				//console.log(child.)
			}
		}
		//console.log( category.template.childNodes.toString() );
		return out || "Got ya";
	}
};

function restart(){
	console.log("Attempting to restart " + process.pid);
	setTimeout(function () {
	    process.on("exit", function () {
	        require("child_process").spawn(process.argv.shift(), process.argv, {
	            cwd: process.cwd(),
	            detached : true,
	            stdio: "inherit"
	        });
	    });
	    process.exit();
	}, 0);
}

function mainLoop(){

	io.question( ('> ' + cue + '\n').green + '> ', (answer) => {

		//console.log("You said,", answer );

		cue = 'Tell me more';

		if(answer == "sleep"){
			interested = false;
		}else if(answer == '`'){
			restart();
		}else{
			let out = HAL.runNode(HAL.findCategory(answer).template);
			if(out){
				console.log(out);
			}
		}

		if(interested){
			//Avoid eternal call stack
			setTimeout(mainLoop, 0);
		}else{
			console.log('> Muutye slumbers..'.magenta);
			io.close();
			process.exit();
		}

	});

}

ut.setRoutines(HAL);
HAL.loadAIML('1cat.aiml');
mainLoop();
