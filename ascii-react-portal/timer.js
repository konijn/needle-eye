//

function Timer(milliSeconds, ui, done){
	const timer = this;	

	if(typeof element === "string"){
		element = document.getElementById(element);
	}
	
	this.element = element;
	this.goal = milliSeconds;
	this.timeLeft = milliSeconds;
	this.done = done;
	this.creationTime = Date.now();
	
	function updateTimer(){
		const now = Date.now();
		timer.timeLeft = timer.goal - ( now - timer.creationTime);
		if(timer.timeLeft > 0 ){
			window.setTimeout(updateTimer, Math.min(timer.timeLeft, 300));		
		}else{
			done();
		}
	}
	window.setTimeout(updateTimer, Math.min(milliSeconds, 300));
}

function TimerUI(props){
	
	this.size = props.size || 10;
	this.brackets = props.brackets || ["[","]"]
	this.dot = props.dot || ["."];
	this.element = document.getElementById(props.element);
	
	if(!this.element){
		error.log(`Document does not contain element with id "${props.element}"`)
	}
	
	return {
		render: function(goal, soFar){
			
		}
	}
	
	
}