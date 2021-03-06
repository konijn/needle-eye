/*jshint esversion: 6, node: true */

"use strict";

const DEBUG = 0;
const WARNING = 4;
const SUCCESS = 6;
const ERROR = 8;
const CATASTROPHE = 16;
const CRITICAL = 16;

const log = require('./log.js').log;

let tally;

function expectEquals(testCase, expected, actual){
  const success = typeof expected == 'string' ? expected == actual : !!actual.match(expected);
  if(success){
    console.log(testCase, 'Passed'.green, `(${actual})`);
  }else{
    console.log(testCase, 'Failed'.red);
    console.log('Expected:'.yellow, expected, expected.length);
    console.log('Actual  :'.yellow, actual, actual.length);
    for(const c of actual){
      console.log(`${c} -> ${c.charCodeAt(0)}`);
    }
  }
  return success;
}

function updateTally(isSuccess){
  tally.total++;
  if(isSuccess){
    tally.success++;
  }
}


module.exports = {

  run : function run(routines){

    function runTest(categoryName, expectedResult){
      //console.log(`Expected: ${expectedResult}`);
      const category = routines.findCategory(categoryName);
      //console.log(routines);
      if(!category){
        log(CRITICAL, `Could not find test category ${categoryName}`);
      }
      if(!category.template){
        log(CRITICAL, `Category ${categoryName} does not have a template`);
      }
      const out = routines.runNode(category.template);
      updateTally(expectEquals(`${tally.total+1}) ${categoryName}`, expectedResult, out));
    }

    tally = {
      total: 0,
      success: 0
    };
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

    runTest('Test Sentence', 'My first letter should be capitalized.');

    runTest('Test Size', /I've learned \d* categories/);

    runTest('test sr test srai', 'srai results: srai test passed');
    runTest('test nested sr test srai', 'srai results: srai test passed');
    runTest('test srai', 'srai test passed');
    runTest('test srai infinite', routines.defaultResponse);

    runTest('intro scroll test star begin', 'Begin star matched: intro scroll');
    runTest('test star creamy goodness middle', 'Middle star matched: creamy goodness');
    runTest('test star end the credits roll', 'End star matched: the credits roll');
    runTest('test star having multiple stars in a pattern makes me extremely happy', 'Multiple stars matched: having, stars in a pattern, extremely happy');

    //runTest('test system', 'The system says You wish..');
    runTest('test system', 'The system says hello');

    runTest('test plurals 1', 'The plural of house is houses, of fish is fishes');
    runTest('test plurals 2', 'The plural of memory is memories, of calf is calves');

    runTest('test create new silly', 'Sure!');
    runTest('test reload sillies', 'I reloaded the sillies.');
    runTest('test new silly', 'Run!');
    runTest('test drop silly', 'I wont respond to test any more.');
    runTest('test drop dropped silly', 'I\'ve not heard that one before.');
    runTest('test dropped silly', 'Got ya');

    //Colorize the state of affairs
    if(tally.total == tally.success){
      tally.success = (tally.success+'').green;
    }else{
      tally.success = (tally.success+'').red;
    }
    return `Total: ${tally.total}, Success: ${tally.success}`;
  }

};
