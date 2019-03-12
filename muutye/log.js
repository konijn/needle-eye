const DEBUG = 0;
const WARNING = 4;
const ERROR = 8;
const CATASTROPHE = 16;
let logLevel = DEBUG;

module.exports = {

	log: function log(level, ...rest){
		//Bad caller, no log level.
		if(!rest){
			console.log(level);
		}else if(level === 0 || level === 4 || level === 8 || level === 16){
			if(level >= logLevel){
				log.call({logColor: level},...rest);
			}
			if(level==CATASTROPHE){
				console.log('> Muutye screams in agony..'.red);
				io.close();
				process.exit();
			}
		} else{
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
