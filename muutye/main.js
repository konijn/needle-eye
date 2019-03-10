//Converted AIML files come from
//https://github.com/hosford42/aiml_bot/tree/master/aiml_bot
//Files were converted with http://www.utilities-online.info/xmltojson/


const io = require('readline').createInterface({ input: process.stdin, output: process.stdout });

const colors = require('colors');
const fs = require('fs');
const ut = require('./ut.js');

//Cue because prompt is already taken
let cue = 'Muutye awakens..';
//As long as we are interested, we keep going
let interested = true;
//What AIML version do we support?
const supportedAIMLVersion = '1.0';
//The brain..
let brain = {
	categories: []
};


// Logging for dummies	\\
const DEBUG = 0;
const WARNING = 4;
const ERROR = 8;
const CATASTROPHE = 16;
let logLevel = WARNING;
function log(level, ...rest){
	//Bad caller, no log level.
	if(!rest){
		console.log(level);
	}else if(level === 0 || level === 4 || level === 8 || level === 16){
		if(level >= logLevel){
			log.call({logColor: level},...rest);
		}
		if(level==CATASTROPHE){
			console.log('> Muutye screams in agony..'.red);
			io.close();
			process.exit();
		}
	} else{
		if(this.logColor==WARNING){
			level = level.yellow;
		}
		if(this.logColor==ERROR){
			level = level.red;
		}
		console.log(level, ...rest);
	}
}


function parse(o){
	console.log(o);
	if(!o.aiml){
		log(CATASTROPHE,"aiml files must have a top level aiml member");
	}
	let aiml = o.aiml;
	if(aiml.version === undefined){
		log(WARNING,"aiml files should have a top level aiml member");
	}
	if(aiml.version.trim() != supportedAIMLVersion){
		log(WARNING,"Muutye was built for version " + supportedAIMLVersion + ', not ' + aiml.version);
	}
	if(!aiml.category){
		log(WARNING,"No categories were found");
	}
	//Enforce category to be an array
	let category = aiml.category.length ? aiml.category : [aiml.category];
	for(const counter in category){
		if(!category[counter].pattern){
			log(WARNING, `Category ${counter} has no pattern`);
		}else{
			//Lowercase patterns to harmonize
			category[counter].pattern = category[counter].pattern.toLowerCase();
		}
	}
	//Add the category to the brain
	brain.categories = brain.categories.concat(aiml.category);
}


function findCategory(input){
	input = input.toLowerCase();

	for(const category of brain.categories){
		if(category.pattern == input){
			log(DEBUG, category);
			return category;
		}
	}
}

function runCategory(category){
	if(!category)
		return;
	if(category.script){
		eval(category.script);
	}
}


function loadAIML(filename){

	log(DEBUG, ('Loading ' + filename).yellow);
	const content = fs.readFileSync(filename);
	const json = JSON.parse(content);
	parse(json);
}

function mainLoop(){

	io.question( ('> ' + cue + '\n').green + '> ', (answer) => {

		//console.log("You said,", answer );

		cue = 'Tell me more';

		if(answer == "sleep"){
			interested = false;
		}else{
			runCategory(findCategory(answer));
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

loadAIML('bootstrap.aiml');
mainLoop();