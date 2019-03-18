
var birth = {
	ui: birthInterface,
	controller: birthController
};


function birthInterface(){
	let title = new Label("Hearth of Shandalar", "yellow", "title");
	title.move(undefined, 20).center();
	
	let white = new Label("White", "white", "white");
	white.anchor().move(undefined, 30).center();
	
	let green = new Label("Green", "green", "green");
  green.anchor().move(undefined, 50).centerAround(35);
	
	let blue = new Label("Blue", "blue", "blue");
  blue.anchor().move(undefined, 50).centerAround(65);

	let red = new Label("Red", "red", "red");
	red.anchor().move(undefined, 70).centerAround(45);

	let black = new Label("Purple", "purple", "black");
	black.anchor().move(undefined, 70).centerAround(55);
	
	let go = new Label("Select your starting element", eggShell, "goForIt");
	go.move(undefined, 50).center();	
	
	
}


function birthController(){
	
}
