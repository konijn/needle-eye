/*
  Copyright (©) 2018 Tom J Demuyt
  Available under the terms of the GNU/LGPL-3.0
  See LICENSE file for more informations.
  
  Base.js contains 
	* all enhancements to vanilla JS Objects
	* DOM routines
	* `listify`
*/

//Syntax shortcut to last entyr
Array.prototype.last = function arrayLast(){
	return this[this.length-1];
}


// Syntax shortcut for forEach
Array.prototype.each = function arrayEac(f) {
    return this.forEach(f);
};

// Add remove method to Array.
Array.prototype.remove = function (item) {
    return this.splice(this.indexOf(item), 1);
};

// Allow for array.repeat.push(), all other repeatable functions should be here
Array.prototype.repeat = function repeatArray(n) {
    let that = this;

    return {
        push: function pushArray(x) {
            let counter = n;
            while (counter--)
                that.push(x);
            return that;
        }
    };
};

// Black.. is the new silver ;)
String.prototype.replaceAll = function StringReplaceAll(silver, black) {
    return this.split(silver).join(black);
};

// Overwrite array values from an array, starting at position index
Array.prototype.set = function ArraySet(index, replacement) {
    listify(replacement).each((v, i) => this[index + i] = v);
    return this;
};

// Turn a 2D array in a 1D array
Array.prototype.flatten = function ArrayFlatten() {
    var flattened = this.shift();
    this.each(a => a.each(v => flattened.push(v)));
    return flattened;
};

//Stash away the (silly) original push
Array.prototype._push = Array.prototype.push;

//Replace with a chainable push
Array.prototype.push = function ArrayChainedPush(...args) {
    this._push(...args);
    return this;
};

//Return a new array containing only unique values
Array.prototype.unique = function ArrayUnique() {
    return this.sort().reduce((accumulator, currentValue) => accumulator.has(currentValue) ? accumulator : accumulator.chainedPush(currentValue), []);
};

// Syntax shortcut for includes
Array.prototype.has = Array.prototype.includes;

//Shuffling using the Fisher–Yates shuffle algo
Array.prototype.shuffle = function ArrayShuffle() {
    var currentIndex = this.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }
    return this;
};

//Pick a random entry from an array
Array.prototype.random = function ArrayRandom() {
    return this[Math.floor(Math.random() * this.length)];
};

//replacement with a different string from a given index
String.prototype.set = function StringSet(index, replacement) {
    replacement = replacement || " ";
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

//(currentValue[, index[, array]])
String.prototype.each = function StringEach(f) {
    return this.split('').each(f);
};

String.prototype.has = function StringHas(s) {
    return !!~this.indexOf(s);
};

String.prototype.template = function StringTemplate(list) {
    return template(this, list);
};

String.prototype.mid = String.prototype.substr;

String.prototype.mod = function StringMod(i) {
    return String.fromCharCode(this.charCodeAt(0) + i);
};

String.prototype.stripRight = function StringStripRight(n) {
    return this.substring(0, this.length - n);
};

String.prototype.anchor = function anchorString() {
	return '<u>&lt;' + this + '&gt;</u>';
}

String.prototype.decode = function StringProcess() {
    let chars = [], color = [], cursorColor, context;

    function processCharacter(c) {
        if (context === 'escaped') {
            cursorColor = c;
            context = '';
        } else if (c === '`') {
            context = 'escaped';
        } else {
            chars.push(c);
            color.push(cursorColor);
        }
    }
    this.each(processCharacter);
    return { color, chars, text: chars.join('') };
};

String.encode = function StringEncode(combo) {
    let cursorColor = ' ', out = '';

    function processCouple(c, color) {
        let currentColor = color || "";
        if (currentColor !== cursorColor) {
            out = out + '`' + currentColor;
            cursorColor = currentColor;
        }
        out += c;
    }

    combo.chars.each((c, i) => processCouple(c, combo.color[i]));
    return out;
};

Number.prototype.loop = function NumberLoop(f) {
    f = f || console.log;
    for (var i = 0; i < this; i++)
        f(i, this + 0);
};

Number.prototype.isOdd = function numberIsOd(){
	return this % 2;
}

Number.prototype.isEven = function numberIsEven(){
	return !this.isOdd();
}

Map.prototype.each = Map.prototype.forEach;

Map.prototype.reverse = function MapReverse() {
    let list = [];
    this.each((value, key, map) => list.push([value, key]));
    return new Map(list);
};

console._error = console.error;
console.error = function consoleError(...args) {
    const argsList = Array.from(arguments);

    document.body.innerHTML = `<r>${argsList.join('\n')}</r>`;
    console._error(...args);
};

console._trace = console.trace;
console.trace = function consoleTrace(...args) {
    const argsList = Array.from(arguments);

    document.body.innerHTML = `<t>Stack Trace:</t><br><r>${argsList.join('\n')}</r>`;
    console._error(...args);
};


//Singleton or multi
function $(query) {
    let selection = document.querySelectorAll(query);
    return selection.length === 0 ? undefined :
        selection.length === 1 ? selection[0] : [...selection];
}
//Only multi
function $$(query) {
    return [...document.querySelectorAll(query)];
}

//Minimal templating engine
function template(id, list) {
    let s = $(id).innerHTML;
    listify(list).each((value, id) => s = s.replaceAll('$' + id, value));
    return s;
}

//Make sure it's an array
function listify(o) {
    return Array.isArray(o) ? o : [o];
}
