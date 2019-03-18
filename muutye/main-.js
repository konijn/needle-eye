//Converted AIML files come from
//https://github.com/hosford42/aiml_bot/tree/master/aiml_bot
//Files were converted with http://www.utilities-online.info/xmltojson/
//Colors are provided by https://github.com/Marak/colors.js

//Node
const io = require('readline').createInterface({ input: process.stdin, output: process.stdout });
//NPM
const colors = require('colors');
//const [DOMParser] = require('xmldom');
DOMParser = require('xmldom').DOMParser;
//Mine, all mine!
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
	
	parse: function parse(doc){
		//console.log(o);
		//Do we have an aiml file?
		aimlList = doc.getElementsByTagName('aiml');
		if(aimlList.length != 1){
			log(CATASTROPHE, `AIML files should have 1 aiml tag, found ${aimlList.length}`);
		}
		const aiml = aimlList[0];
		const aimlVersion = aiml.getAttribute('version');
		if(aimlVersion === undefined){
			log(WARNING,"aiml files should have a top level aiml member");
		}
		if(aimlVersion != supportedAIMLVersion){
			log(WARNING,`Muutye understands version ${supportedAIMLVersion} not ${aiml.version}`);
		}
		console.log('yay!');
		//Get categories
		let categories = aiml.getElementsByTagName('category');
		if(!categories.length){
			log(WARNING,"No categories were found");
		}		
		for(const counter in categories){
			const category = categories[counter];
			const patternCount = category.getElementsByTagName('pattern').length;
			if(patternCount != 1){
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
			let content = fs.readFileSync(filename).toString();
			console.log(content);
			if(content.startsWith('<xml')){
				content = '<xml xmlns="a" xmlns:c="./lite">\n' + content + '</xml>';
			}
			const doc = new DOMParser().parseFromString(content, 'text/xml');
			console.log(doc.toString())
			HAL.parse(doc);
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
