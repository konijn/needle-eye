//Converted AIML files come from
//https://github.com/hosford42/aiml_bot/tree/master/aiml_bot
//Files were converted with http://www.utilities-online.info/xmltojson/
//Colors are provided by https://github.com/Marak/colors.js

const io = require('readline').createInterface({ input: process.stdin, output: process.stdout });

const colors = require('colors');
const fs = require('fs');
const ut = require('./ut.js');
const log = require('./log.js').log;

const DEBUG = 0;
const WARNING = 4;
const ERROR = 8;
const CATASTROPHE = 16;

let cue = 'Muutye awakens..';
//As long as we are interested, we keep going
let interested = true;
//What AIML version do we support?
const supportedAIMLVersion = '1.0';
//The brain..


let HAL = {
	cue: 'Muutye awakens..', //Cue because prompt is already taken
	interested: true, //As long as we are interested, we keep going
	supportedAIMLVersion: '1.0', //What AIML version do we support?
	
	brain : {
		categories: []
	},
	
	parse: function parse(o){
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
		HAL.brain.categories = HAL.brain.categories.concat(aiml.category);
	},
	
	loadAIML: function loadAIML(filename){

		log(DEBUG, ('Loading ' + filename).yellow);
		
		try {
			const content = fs.readFileSync(filename);
			const json = JSON.parse(content);
			HAL.parse(json);
		}
		catch(error) {
			//console.log('Caught an error', error);
			log(ERROR, error);
		}
	},

	findCategory: function findCategory(input){
		input = input.toLowerCase();

		for(const category of HAL.brain.categories){
			if(category.pattern == input){
				log(DEBUG, category);
				return category;
			}
		}
	},
	
	runCategory: function runCategory(category){
		if(!category)
			return;
		if(category.script){
			eval(category.script);
		}
		if(category.template){
			return category.template;
		}
	}
};

function mainLoop(){

	io.question( ('> ' + cue + '\n').green + '> ', (answer) => {

		//console.log("You said,", answer );

		cue = 'Tell me more';

		if(answer == "sleep"){
			interested = false;
		}else{
			let out = HAL.runCategory(HAL.findCategory(answer));
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
HAL.loadAIML('bootstrap.aiml');
mainLoop();