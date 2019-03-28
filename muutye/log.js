//const io = require('readline').createInterface({ input: process.stdin, output: process.stdout });

DEBUG = 0;
WARNING = 4;
SUCCESS = 6;
ERROR = 8;
CATASTROPHE = 16;
CRITICAL = 16;
let logLevel = DEBUG;

module.exports = {

	log: function log(level, ...rest){
		//Bad caller, no log level.
		if(!rest){
			console.log(level);
		}else if(level === 0 || level === 4 || level == 6 || level === 8 || level === 16){
			if(level >= logLevel){
				log.call({logColor: level},...rest);
			}
			if(level==CATASTROPHE){
				console.log('> Muutye screams in agony..'.red);
				console.log(new Error().stack);
				io.close();
				process.exit();
			}
		} else{
			if(this.logColor==SUCCESS){
				level = level.toString().green;
			}
			if(this.logColor==WARNING){
				level = level.toString().yellow;
			}
			if(this.logColor==ERROR){
				level = level.toString().red;
			}
			console.log(level, ...rest);
		}
	}

};
