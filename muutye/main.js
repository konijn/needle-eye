//Converted AIML files come from
//https://github.com/hosford42/aiml_bot/tree/master/aiml_bot
//Colors are provided by https://github.com/Marak/colors.js
//XML Beautifier https://codebeautify.org/xmlviewer
//XML DOM is provided by https://www.npmjs.com/package/xmldom
//Substitution files come from https://github.com/pandorabots/substitutions/tree/master/lib
//Spec: http://callmom.pandorabots.com/static/reference/#aiml-2-0-reference
//More specs: http://mctarek.free.fr/AIML/AIML_Tags.htm

//Node
const fs = require('fs');
//Evil global :/
io = require('readline').createInterface({ input: process.stdin, output: process.stdout });
//NPM
const colors = require('colors');
const xmldom = require('xmldom');
const moment = require('moment');
//Mine, all mine!
const ut = require('./ut.js');
const log = require('./log.js').log;
const sub = require('./substitute.js').substitute;

const botName = 'Muutye';

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
	},
	
	capitalize: function capitalize(s){
		return s.split(" ").map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(" ");
	},
	
	isValidFileName: function isValidFileName(s){
		return s.match(/^\w{1,12}\.\w{1,3}$/g);
	},
	
	ensureSubFolder: function ensureSubFolder(folder){
		if(!fs.existsSync('./' + folder)){
			fs.mkdirSync(folder);
		}
	}
};

let HAL = {
	cue: `${botName} awakens..`, //Cue because prompt is already taken
	interested: true, //As long as we are interested, we keep going
	supportedAIMLVersion: '1.0', //What AIML version do we support?
	defaultResponse: 'Got ya', //What to respond if we don't get it?
	
	io: io,
	
	brain : {
		categories: [],
		predicates: { _id: botName}
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
			const pattern = Igor.getUniqueTag(category, 'pattern');
			let jCategory = {
				pattern: pattern.textContent.toLowerCase().replace(/\*/g, '(.*)'),
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
		formalized = input.toLowerCase();
		for(const category of HAL.brain.categories){
			if(category.pattern.includes('*')){
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
	
	getMatch: function getMatch(){
		return HAL.brain.match;
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
		if(!node)
			return;
		for(let counter = 0 ; counter < node.childNodes.length; counter++){
			const child = node.childNodes[counter];
			const parent = child.parentNode;
			console.log('Child', counter, child.nodeName, parent.nodeName);
			//Text node
			if(child.nodeName == '#text'){
				out += child.nodeValue.trimStart();
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
			}else if(child.nodeName == 'person'){
				out += sub('person', runNode(child));
			}else if(child.nodeName == 'person2'){
				out += sub('person2', runNode(child));
			}else if(child.nodeName == 'lowercase'){
				out += runNode(child).toLowerCase();
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
		//For empty tags, consider the star approach
		if(!out && !node.childNodes.length && HAL.hasMatch()){
			return HAL.getMatch()[1];
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
mainLoop();