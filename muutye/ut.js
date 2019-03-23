

console.log('Hello world, I am Utee!');


function expectEquals(testCase, expected, actual){
	if(expected == actual){
		console.log(testCase, "Passed".green);
	}else{
		console.log(testCase, "Failed".red);
		console.log('Expected: '.yellow, expected, 'Actual'.yellow, actual);
	}
	return (expected == actual);
}

function updateTally(tally, isSuccess){
	tally.total++;
	if(isSuccess){
		tally.success++;
	}
}

module.exports = {

	routines: undefined,

	setRoutines: function setRoutines(functions){
		routines = functions;
	},

	run : function run(){
		let tally = {
			total: 0,
			success: 0
		}
		console.log('I ran');
		routines.loadAIML('ut.aiml');

		let out = routines.runNode(routines.findCategory('TEST WHOAMI').template);
		updateTally(tally, expectEquals('TEST WHOAMI', "My name is Muutye", out));
		//Colorize the state of affairs
		if(tally.total == tally.success){
			tally.success = (tally.success+'').green;
		}else{
			tally.success = (tally.success+'').red;
		}
		return `Total: ${tally.total}, Success: ${tally.success}`;
	}

};
