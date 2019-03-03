//https://github.com/hosford42/aiml_bot/tree/master/aiml_bot

const colors = require('colors');
const io = require('readline').createInterface({ input: process.stdin, output: process.stdout });


let prompt = 'Muutye woke up';
let interested = true;


function mainLoop(){

  io.question( ('>' + prompt + '\n').green, (answer) => {

    //console.log("You said,", answer );

    prompt = 'Tell me more';

    if(answer == "sleep"){
      interested = false;
    }

    if(interested){
      setTimeout(mainLoop, 0);
    }else{
      io.close();
      process.exit();
    }

  });

}

mainLoop();
