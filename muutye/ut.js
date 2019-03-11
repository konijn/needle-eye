

console.log('Hello world, I am Utee!');


module.exports = {

	routines: undefined,

	setRoutines: function setRoutines(functions){
		routines = functions;
	},

	run : function run(){
		console.log('I ran');
		console.log(routines);
		routines.loadAIML('ut.aiml');
		//loadAIML('ut.aiml');
	}

};
