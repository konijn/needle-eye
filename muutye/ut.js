
const log = require('./log.js').log;

let tally;

function expectEquals(testCase, expected, actual){
	const success = typeof expected == 'string' ? expected == actual : !!actual.match(expected);
	if(success){
		console.log(testCase, 'Passed'.green, `(${actual})`);
	}else{
		console.log(testCase, 'Failed'.red);
		console.log('Expected:'.yellow, expected, '\nActual  :'.yellow, actual);
	}
	return success;
}

function updateTally(isSuccess){
	tally.total++;
	if(isSuccess){
		tally.success++;
	}
}

function runTest(categoryName, expectedResult){
	//console.log(`Expected: ${expectedResult}`);
	const category = routines.findCategory(categoryName);
	//console.log(routines);
	if(!category){
		log(CRITICAL, `Could not find category ${categoryName}`);
	}
	if(!category.template){
		log(CRITICAL, `Category ${categoryName} does not have a template`);
	}
	const out = routines.runNode(category.template);
	updateTally(expectEquals(`${tally.total+1}) ${categoryName}`, expectedResult, out));
}


module.exports = {

	routines: undefined,

	setRoutines: function setRoutines(functions){
		routines = functions;
	},

	run : function run(){
		tally = {
			total: 0,
			success: 0
		}
		console.log('I ran');
		routines.loadAIML('ut.aiml');
		
		runTest('Test WhoAmI', 'My name is Muutye');
		runTest('Test Bot Tag', 'My name is Muutye');
		
		routines.setPredicate('gender','Male');
		runTest('Test Condition Name Value', 'You are handsome');

		routines.setPredicate('gender','Female');
		runTest('Test Condition Name Value', routines.defaultResponse);
		runTest('Test Condition Name', 'You are beautiful');
		
		routines.setPredicate('gender','bot');
		runTest('Test Condition Name', 'You are genderless');
		runTest('Test Condition', 'You are genderless');
		
		routines.setPredicate('gender','Male');
		runTest('Test Condition', 'You are handsome');
		
		runTest('Test Date', 'The date is ' + (new Date()).toDateString());
		
		runTest('Test Formal', 'This Should Get Capitalized');
		
		runTest('Test Gender', "He'd told her he heard that her hernia is history");

		//Twice, to test the caching of the substitutions
		runTest('Test Gender', "He'd told her he heard that her hernia is history");

		runTest('Test Get and Set', 'I like cheese. My favorite food is cheese');

		runTest('Test Forget Gossip Load', 'Hello World');

		runTest('Test Id', 'Your id is anonymous');

		runTest('Test Javascript', 'Eval is Evil');

		runTest('Test Lowercase', 'The Last Word Should Be lowercase');
		
		//Odd, very odd..
		//runTest('Test Person', 'HE think i knows that my actions threaten him and his.');
		runTest('Test Person', 'YOU think he knows that his actions threaten you and yours.');
		//runTest('Test Person2', 'YOU think me know that my actions threaten you and yours.'');
		runTest('Test Person2', 'THEY think you know that your actions threaten them and theirs.');
		
		runTest('Test Person2 I love Lucy', 'THEY love Lucy');
		
		runTest('Test Random', /response #\d/);
		
		runTest('Test Random Empty', 'Nothing here!');
		
		runTest('Test Sentence', 'My first letter should be capitalized.', tally)
		
		runTest('Test Size', /I've learned \d* categories/)

		//Colorize the state of affairs
		if(tally.total == tally.success){
			tally.success = (tally.success+'').green;
		}else{
			tally.success = (tally.success+'').red;
		}
		return `Total: ${tally.total}, Success: ${tally.success}`;
	}

};
