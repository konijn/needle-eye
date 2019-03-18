/*
  Copyright (©) 2018 Tom J Demuyt
  Available under the terms of the GNU/LGPL-3.0
  See LICENSE file for more informations.
  
  Box.js contains messageBox functionality (█)
*/

function box(options) {

    if (typeof options === "string")
        options = { message: options };

    let z = options.z || ui.getHighestZ();
    z++;

    let width = options.width || 50;
    let height = options.height || 10;

    let buttons = (options.buttons || i18n.get("OK")).split(",");
    let message = options.message || i18n.get("Something went horribly wrong");
    let parts = message.split("\n");
    let buttonsSize = buttons.reduce((acc, current, index) => acc + current.length + 4, 0);

		app = {controller: boxController, buttons: buttons};
		appStack.push(app);
    buttons = buttons.map(button => `<span id=${button}>${button.anchor()}</span>`);

    console.log('size', buttonsSize);

    //Top
    let s = "╔" + "═".repeat(width - 2) + "╗\n";
    //Space
    s = s + "║" + " ".repeat(width - 2) + "║\n";
    //Message
    for (let part of parts)
        s = s + "║ " + part + " ".repeat(width - part.length - 3) + "║\n";
    //Space
    s = s + "║" + " ".repeat(width - 2) + "║\n";
    //Buttons
    s = s + "║" + " ".repeat(width - buttonsSize - 2) + buttons.join("  ") + "  ║\n";
    //Space
    s = s + "║" + " ".repeat(width - 2) + "║\n";
    //Bottom
    s = s + "╚" + "═".repeat(width - 2) + "╝";
    
    //console.log(s);
		let id = "box_" + appStack.length;
    let box = new Label(s, eggWhite, id);
    box.move(undefined, 30).center().z(z);

		$$(`#${id} u`).each(el => el.addEventListener("click", controller.default));
}

function boxController(e){
	
	let id = ui.findId(e.srcElement);
	if(!app.buttons.has(id))
		return;
	$(`#${ui.findParentId($("#"+id))}`).remove();
	controller.back().resume();
}
