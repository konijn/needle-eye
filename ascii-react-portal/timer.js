//
//jshint  esversion: 6


function Timer(milliSeconds, uiProps, done){
	const timer = this;
	const ui = new TimerUI(timer, uiProps);

	this.goal = milliSeconds;
	this.timeLeft = milliSeconds;
	this.done = done;
	this.creationTime = Date.now();

	function updateTimer(){
		const now = Date.now();
		timer.timeLeft = timer.goal - ( now - timer.creationTime);
		ui.render();
		if(timer.timeLeft > 0 ){
			window.setTimeout(updateTimer, Math.min(timer.timeLeft, 300));
		}else{
			done();
		}
	}
	window.setTimeout(updateTimer, Math.min(milliSeconds, 300));
}

function TimerUI(timer, props){
	const ui = this;
	this.size = props.size || 10;
	this.brackets = props.brackets || ["[","]"];
	this.dot = props.dot || ["."];
	this.element = document.getElementById(props.element);

	if(!this.element){
		//error.log(`Document does not contain element with id "${props.element}"`)
	}

	return {
		render: function(){
	    const progress = Math.floor(ui.size * ui.dot.length / timer.goal * (timer.goal - timer.timeLeft));
			console.log(ui, timer, progress);

		}
	};

}
