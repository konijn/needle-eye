/**
 * Label class
 * Use this for all screen things, except for the map
 */

function Label(content, color, id, bag) {

    //let label = `<span id="${id}" style="color:${color};position:absolute">${content}</span>`;
		
		var element = document.createElement('span')
		element.id = id;
		element.innerHTML = i18n.get(content);
		element.style.color = color;
		document.body.appendChild(element);
		
    //document.body.innerHTML += label;
    this.id = id;
    this.bag = bag;
    this.element = $('#' + id);
}

Label.prototype.anchor = function anchorLabel()
{
	this.element.innerHTML = this.element.innerHTML.anchor();
	return this;
}

/*left -> x, top -> y*/
Label.prototype.move = function moveLabel(left, top)
{
    let s = this.element.style;
        
    s.position = "absolute";
    if (left !== undefined) s.left = left + "%";
    if (top !== undefined) s.top = top + "%";

    return this;
};

Label.prototype.center = function centerLabel()
{
    let s = this.element.style;

    s.position = "absolute";
    s.left = ($("body").clientWidth - this.element.clientWidth) / 2 + "px";

    return this;
};

Label.prototype.centerAround = function centerLabel(left)
{
    let s = this.element.style;

    s.position = "absolute";
    s.left = ($("body").clientWidth / 100 * left - this.element.clientWidth / 2) * 1 + "px";

    return this;
};

Label.prototype.roundedCorner = function roundedCornerLabel(color)
{
    let s = this.element.style;

    color = color || s.style.color;
    s.border = `1px solid ${color}`;
    s.borderRadius = '5px';
    s.padding = '4px';

    return this;
};

Label.prototype.fade = function fadeLabel()
{
    let s = this.element.style;

    s.opacity = 0;

    return this;
};

Label.prototype.z = function zLabel(z) {
    let s = this.element.style;

    s.zIndex = z;
    s.backgroundColor = 'black';

    return this;
}
