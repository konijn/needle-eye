var intro = {
	ui: introInterface,
	controller: introController
};

function introInterface() {

	$('body').innerHTML = '';

	let gameStarted = !locker.isEmpty();
	let continueColor = gameStarted ? "t" : "dimgray";
	let newColor = gameStarted ? "red" : "t";

	let continueGame = new Label("Continue", continueColor, "continueGame");
	continueGame.anchor().move(undefined, 80).centerAround(66.66);

	let newGame = new Label("New Game", newColor, "newGame");
	newGame.anchor().move(undefined, 80).centerAround(33.33);

	let title = new Label("Hearth of Shandalar", "yellow", "title");
	title.fade().move(undefined, 30).center();
	tween(title.element, tweens.fadeIn, 0.7, "Fade In Title");

	introRigger();
}

function introRigger() {
	$('#newGame u').addEventListener("click", controller.default);
	$('#continueGame u').addEventListener("click", controller.default);
}

function introController(event) {

	log(log.DEBUG, this, event);
	let id = ui.findId(event.srcElement);
	let gameStarted = !locker.isEmpty();

	if (id === "newGame") {
		if (gameStarted) {
			app.resume = introAreYouSure;
			return box(i18n.get("Do you really want to erase your current game?"));
		} else {
			newGame();
		}
	}
	if (id === "continueGame") {
		if (!gameStarted) {
			app.resume = controller.doNothing;
			box(i18n.get("You should start a game first!"));
		}
	}
}

function introAreYouSure(answer){
	if(answer=="yes")
		newGame();
}

function newGame(){
	ui.clear();
	controller.load(birth);
}

function continueGame(){
	ui.clear();
}
