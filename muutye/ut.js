
const log = require('./log.js').log;


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

function runTest(categoryName, expectedResult, tally){
	const category = routines.findCategory(categoryName);
	//console.log(routines);
	if(!category){
		log(CRITICAL, `Could not find category ${categoryName}`);
	}
	if(!category.template){
		log(CRITICAL, `Category ${categoryName} does not have a template`);
	}
	const out = routines.runNode(category.template);
	updateTally(tally, expectEquals(`${tally.total+1}) ${categoryName}`, expectedResult, out));
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
		
		runTest('Test WhoAmI', 'My name is Muutye', tally);
		runTest('Test Bot Tag', 'My name is Muutye', tally);
		
		routines.setPredicate('gender','Male');
		runTest('Test Condition Name Value', 'You are handsome', tally);

		routines.setPredicate('gender','Female');
		runTest('Test Condition Name Value', routines.defaultResponse, tally);
		runTest('Test Condition Name', 'You are beautiful', tally);
		
		routines.setPredicate('gender','bot');
		runTest('Test Condition Name', 'You are genderless', tally);
		runTest('Test Condition', 'You are genderless', tally);
		
		routines.setPredicate('gender','Male');
		runTest('Test Condition', 'You are handsome', tally);
		
		runTest('Test Date', 'The date is ' + (new Date()).toDateString(), tally);
		
		runTest('Test Formal', 'This Should Get Capitalized', tally);
		
		runTest('Test Gender', "He'd told her he heard that her hernia is history", tally);

		//Twice, to test the caching of the substitutions
		runTest('Test Gender', "He'd told her he heard that her hernia is history", tally);

		runTest('Test Get and Set', 'I like cheese. My favorite food is cheese', tally);

		runTest('Test Forget Gossip Load', 'Hello World', tally);

		runTest('Test Id', 'Your id is anonymous', tally);

		runTest('Test Javascript', 'Eval is Evil', tally);

		runTest('Test Lowercase', 'The Last Word Should Be lowercase', tally);
		
		//Odd, very odd..
		//runTest('Test Person', 'HE think i knows that my actions threaten him and his.', tally);
		runTest('Test Person', 'YOU think he knows that his actions threaten you and yours.', tally);
		//runTest('Test Person2', 'YOU think me know that my actions threaten you and yours.'', tally);
		runTest('Test Person2', 'THEY think you know that your actions threaten them and theirs.', tally);
		
		runTest('Test Person2 I love Lucy', 'THEY love Lucy', tally);
		
		//Colorize the state of affairs
		if(tally.total == tally.success){
			tally.success = (tally.success+'').green;
		}else{
			tally.success = (tally.success+'').red;
		}
		return `Total: ${tally.total}, Success: ${tally.success}`;
	}

};
