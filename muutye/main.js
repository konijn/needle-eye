//Converted AIML files come from
//https://github.com/hosford42/aiml_bot/tree/master/aiml_bot
//Colors are provided by https://github.com/Marak/colors.js
//XML Beautifier https://codebeautify.org/xmlviewer
//XML DOM is provided by https://www.npmjs.com/package/xmldom
//Substitution files come from https://github.com/pandorabots/substitutions/tree/master/lib
//Spec: http://callmom.pandorabots.com/static/reference/#aiml-2-0-reference
//More specs: http://mctarek.free.fr/AIML/AIML_Tags.htm

//Exceptions, because I cant
//regex tag can replace the pattern tag, system will match as regex

/*jshint esversion: 6, evil: true */

//Node
const fs = require('fs');

//Evil global :/
io = require('readline').createInterface({ input: process.stdin, output: process.stdout });

//NPM
const colors = require('colors');
const xmldom = require('xmldom');
const moment = require('moment');

//NPM -> lowdb
const low = require('lowdb');
const adapterBuilder = require('lowdb/adapters/FileSync');
const adapter = new adapterBuilder('db.json');
const db = low(adapter);
db.defaults({concepts: {}}).write();

//Mine, all mine!
require('./base.js');
const ut = require('./ut.js');
const log = require('./log.js').log;
const sub = require('./substitute.js').substitute;
const Igor = require('./igor.js');


const botName = 'Muutye';

let HAL = {
	cue: `${botName} awakens..`, //Cue because prompt is already taken
	interested: true, //As long as we are interested, we keep going
	supportedAIMLVersion: '1.0', //What AIML version do we support?
	defaultResponse: 'Got ya', //What to respond if we don't get it?

	io: io,

	brain : {
		categories: [],
		predicates: { _id: botName},
		stack: new Set()
	},

	init: function init(file){
		HAL.loadAIML(file);
		Igor.ensureSubFolder('out');
	},

	parse: function parse(doc){

		const aiml = Igor.getUniqueTag(doc, 'aiml');
		const aimlVersion = aiml.getAttribute('version');
		if(aimlVersion === undefined){
			log(WARNING,"aiml files should have a top level aiml member");
		}
		if(aimlVersion != HAL.supportedAIMLVersion){
			log(WARNING,`${HAL.brain.predicates._id} understands version ${supportedAIMLVersion} not ${aiml.version}`);
		}
		//Get categories
		let categories = aiml.getElementsByTagName('category');
		log(DEBUG,`${categories.length} categor${categories.length==1?'y was':'ies were'} loaded`);
		let brainCategories = [];
		for(let counter = 0; counter < categories.length; counter++){
			const category = categories[counter];
			let pattern;
			if(Igor.hasTag(category, "pattern")){
				//Old skool matching, per spec
				let jCategory = {
					pattern: Igor.getUniqueTag(category, 'pattern').textContent.toLowerCase().replace(/\*/g, '(.*)'),
					template: Igor.getUniqueTag(category, 'template')
				};
				brainCategories.push(jCategory);
			}else{
				//New scool, accepting regex, and even multiple regexes
				tags = Igor.getTags(category, 'regex');
				for(const tag of tags){
					let jCategory = {
						pattern: tag.textContent.toLowerCase(),
						template: Igor.getUniqueTag(category, 'template')
					};
					brainCategories.push(jCategory);
				}
			}
		}
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
		formalized = input.toLowerCase();
		for(const category of HAL.brain.categories){
			if(category.pattern.includes('*')){
				//console.log('trying', category.pattern, 'for', input);
				const match = input.match(new RegExp(category.pattern, 'i'));
			  if(match){
			  	HAL.setMatch(match);
			  	return category;
			  }
			}else if(category.pattern == formalized){
				return category;
			}
		}
	},

	setMatch: function setMatch(match){
		log(DEBUG, match);
		HAL.brain.match = match;
	},

	getMatch: function getMatch(index){
		return HAL.brain.match[index||1];
	},

	clearMatch: function clearMatch(){
		HAL.brain.match = undefined;
	},

	hasMatch: function hasMatch(){
		return !!HAL.brain.match;
	},

	setPredicate: function setPredicate(name, value){
		HAL.brain.predicates[name] = value;
	},

	getPredicate: function getPredicate(name){
		return HAL.brain.predicates[name];
	},

	hasPredicate: function setPredicate(name){
		return HAL.brain.predicates[name] !== undefined;
	},

	runNode: function runNode(node){
		//console.log(category);
		let out = '';
		let defaultResponse = '';
		let stack = HAL.brain.stack;
		if(!node)
			return;
		if(stack.has(node)){
			return "";
		}else{
			stack.add(node);
		}
		for(let counter = 0 ; counter < node.childNodes.length; counter++){
			const child = node.childNodes[counter];
			const parent = child.parentNode;
			log(DEBUG, `'Child ${counter}: ${child.nodeName.grey}, parent: ${parent.nodeName.grey}`);
			//Text node
			if(child.nodeName == '#text'){
				out += child.nodeValue.textNodeTrim();
			}else if(child.nodeName == 'br'){
				out += '\n';
			}else if(child.nodeName == 'bot'){
				if(child.hasAttribute('name')){
					out += HAL.getPredicate('_id');
				}
			}if(child.nodeName =='id'){
				out += 'anonymous';
			}else if(child.nodeName == 'gender'){
				out += sub('gender', runNode(child));
			}else if(child.nodeName == 'system'){
				out += 'Nice Try';
			}else if(child.nodeName == 'sentence'){
				out += Igor.sentence(runNode(child));
			}else if(child.nodeName == 'person'){
				out += sub('person', runNode(child));
			}else if(child.nodeName == 'person2'){
				out += sub('person2', runNode(child));
			}else if(child.nodeName == 'size'){
				out += HAL.brain.categories.length;
			}else if(child.nodeName == 'lowercase'){
				out += runNode(child).toLowerCase();
			}else if(child.nodeName == 'sr'){
				const category = routines.findCategory(HAL.getMatch());
				//log(DEBUG, category.template);
				out += runNode(category.template);
			}else if(child.nodeName == 'srai'){
				const target = runNode(child);
				const category = routines.findCategory(target);
				if(category && category.template){
					out += runNode(category.template);
				}else{
					log(ERROR, `Could not find category ${target}`);
				}
			}else if(child.nodeName == 'star'){
				const index = child.getAttribute('index') || 1;
				out += HAL.getMatch(index);
			}else if(child.nodeName == 'random'){
				const list = Igor.filterNodes(child.childNodes, n =>n .nodeName=='li');
				log(DEBUG, `I found ${list.length} child nodes`);
				if(list.length){
					const entry = list[Igor.getRandomIntInclusive(0,list.length-1)];
					out += runNode(entry);
				}
			}else if(child.nodeName == 'date'){
				if(child.hasAttribute('day')){
					out += moment().format('dddd');
				}else{
					out += (new Date()).toDateString();
				}
			}else if(child.nodeName == 'formal'){
				out += Igor.capitalize(runNode(child));
			}else if(child.nodeName == 'condition'){
				if(child.hasAttribute('name') && child.hasAttribute('value')){
					const name = child.getAttribute('name');
					const value = child.getAttribute('value');
					const predicateValue = HAL.getPredicate(name);
					log(DEBUG, `Condition ${name};${value}<>${predicateValue}`);
					if(predicateValue == value){
						out += runNode(child);
					}
				}else{
					out += runNode(child);
				}
			}else if(child.nodeName == 'set'){
				const name = child.getAttribute('name');
				const value = runNode(child);
				HAL.setPredicate(name, value);
				out += value;
			}else if(child.nodeName == 'get'){
				const name = child.getAttribute('name');
				const value = HAL.getPredicate(name);
				out += value;
			}else if(child.nodeName == 'forget'){
				const fileName = child.getAttribute('filename');
				if(Igor.isValidFileName(fileName)){
					try{
						if(fs.existsSync('out/' + fileName)){
							fs.unlinkSync('out/' + fileName);
							log(DEBUG, `Forgot ${'out/' + fileName}`);
						}
					}catch(oops){
						log(ERROR, oops.toString());
					}
				}else{
					log(CRITICAL, `Dangerous filename in <forget>: ${fileName}`);
				}
			}else if(child.nodeName == 'gossip'){
				const fileName = child.getAttribute('filename');
				if(Igor.isValidFileName(fileName)){
					try{
							//Create the file if it does not exist, and append!
							fs.appendFileSync('out/' + fileName, runNode(child));
					}catch(oops){
						log(ERROR, oops.toString());
					}
				}else{
					log(CRITICAL, `Dangerous filename in <gossip>: ${fileName}`);
				}
			}else if(child.nodeName == 'load'){
				const fileName = child.getAttribute('filename');
				if(Igor.isValidFileName(fileName)){
					try{
						if(fs.existsSync('out/' + fileName)){
							out += fs.readFileSync('out/' + fileName);
						}
					}catch(oops){
						log(ERROR, oops.toString());
					}
				}else{
					log(CRITICAL, `Dangerous filename in <load>: ${fileName}`);
				}
			}else if(child.nodeName == 'li' && parent.nodeName == 'condition'){
				if(child.hasAttribute('value') && parent.hasAttribute('name')){
					const name = parent.getAttribute('name');
					const value = child.getAttribute('value');
					const predicateValue = HAL.getPredicate(name);
					log(DEBUG, `Condition ${name};${value}<>${predicateValue}`);
					if(predicateValue == value){
						out += runNode(child);
					}
				}else if(child.hasAttribute('value') && child.hasAttribute('name')){
					const name = child.getAttribute('name');
					const value = child.getAttribute('value');
					const predicateValue = HAL.getPredicate(name);
					log(DEBUG, `Condition ${name};${value}<>${predicateValue}`);
					if(predicateValue == value){
						out += runNode(child);
					}
				}else{
					defaultResponse = runNode(child);
				}
			}else if(child.nodeName == 'script' || child.nodeName == 'javascript'){
				//The source can be composed with tags and text
				const source = runNode(child);
				//Eval is evil, at least warn the user
				log(WARNING, 'Executing ' + source+ '\n');
				try{
					out += eval(source);
				}catch(exception){
					log(ERROR, `Something went horribly wrong: ${exception}`);
				}
			}
		}
		stack.delete(node);
		//For empty tags, consider the star approach
		if(!out && !node.childNodes.length && HAL.hasMatch()){
			return HAL.getMatch();
		}
		return out || defaultResponse || HAL.defaultResponse;
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

	io.question( ('> ' + HAL.cue + '\n').green + '> ', (answer) => {

		HAL.cue = 'Tell me more';

		if(answer == "sleep" || answer == "quit" || answer == "die" || answer == "end"){
			HAL.interested = false;
		}else if(answer == '`'){
			restart();
		}else{
			const category = HAL.findCategory(answer);
			if(category && category.template){
				const out = HAL.runNode(category.template);
				if(out){
					console.log(out);
				}
			}
		}

		if(HAL.interested){
			//Avoid eternal call stack
			setTimeout(mainLoop, 0);
		}else{
			console.log(`> ${HAL.getPredicate('_id')} slumbers..`.magenta);
			io.close();
			process.exit();
		}

	});
}

ut.setRoutines(HAL);
HAL.init('1cat.aiml');
HAL.loadAIML('_db.aiml');
HAL.loadAIML('_js.aiml');
HAL.loadAIML('_concept.aiml');
mainLoop();
