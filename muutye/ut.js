

console.log('Hello world, I am Yutee!');


function expectEquals(testCase, expected, actual){
	if(expected == actual){
		console.log(testCase, 'Passed'.green);
	}else{
		console.log(testCase, 'Failed'.red);
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

		let out = routines.runNode(routines.findCategory('Test WhoAmI').template);
		updateTally(tally, expectEquals('TEST WHOAMI', 'My name is Muutye', out));
		
		out = routines.runNode(routines.findCategory('Test Bot Tag').template);
		updateTally(tally, expectEquals('Test Bot Tag', 'My name is Muutye', out));
		
		routines.setPredicate('gender','Male');
		out = routines.runNode(routines.findCategory('Test Condition Name Value').template);
		updateTally(tally, expectEquals('Test Condition Name Value 1', 'You are handsome', out));
		
		routines.setPredicate('gender','Female');
		out = routines.runNode(routines.findCategory('Test Condition Name Value').template);
		updateTally(tally, expectEquals('Test Condition Name Value 2', routines.defaultResponse, out));
		
		out = routines.runNode(routines.findCategory('Test Condition Name').template);
		updateTally(tally, expectEquals('Test Condition Name 1', 'You are beautiful', out));
		
		routines.setPredicate('gender','bot');
		out = routines.runNode(routines.findCategory('Test Condition Name').template);
		updateTally(tally, expectEquals('Test Condition Name 2', 'You are genderless', out));
		
		out = routines.runNode(routines.findCategory('Test Condition').template);
		updateTally(tally, expectEquals('Test Condition', 'You are genderless', out));
		
		routines.setPredicate('gender','Male');
		out = routines.runNode(routines.findCategory('Test Condition').template);
		updateTally(tally, expectEquals('Test Condition 2', 'You are handsome', out));
		
		out = routines.runNode(routines.findCategory('Test Date').template);
		updateTally(tally, expectEquals('Test Date', 'The date is ' + (new Date()).toDateString(), out));

		out = routines.runNode(routines.findCategory('Test Formal').template);
		updateTally(tally, expectEquals('Test Formal', 'This Should Get Capitalized', out));
		
		out = routines.runNode(routines.findCategory('Test Gender').template);
		updateTally(tally, expectEquals('Test Gender', "He'd told her he heard that her hernia is history", out));
		
		out = routines.runNode(routines.findCategory('Test Gender').template);
		updateTally(tally, expectEquals('Test Gender', "He'd told her he heard that her hernia is history", out));
		
		
		//Colorize the state of affairs
		if(tally.total == tally.success){
			tally.success = (tally.success+'').green;
		}else{
			tally.success = (tally.success+'').red;
		}
		return `Total: ${tally.total}, Success: ${tally.success}`;
	}

};
