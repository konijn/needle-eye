
//The magic starts here..
document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM fully loaded and parsed");
	try{
		document.body.webkitRequestFullscreen();
	}catch(e){
		console.log("Could not go full screen:", e);
	}
	main();
});

ui = {};

//For messageboxes, we need the highest drawn span
ui.getHighestZ = function getHighestZ() {
    let elements = $$("body *");
    return 1 * (elements.sort((a, b) => a.style.zIndex - b.style.zIndex).pop().style.zIndex || 0);
};

//Find recursively an id, going up the parent chain
ui.findId = function findId(element){
	while(!element.id && element.parentElement)
		element = element.parentElement;
	return element.id;
}

//Find recursively an id, but starting from parent
ui.findParentId = function findParentId(element){
	return ui.findId(element.parentElement);
}

ui.clear = function clearScreen(){
	document.body.innerHTML = '';
}

ui.onResize = function onResize(){
	console.log('Resizing!');
	let map = $("#map");
	if(map){
		//map.width = document.body.clientWidth;
		//map.height = document.body.clientHeight;
	}
}

window.addEventListener('resize', ui.onResize);
