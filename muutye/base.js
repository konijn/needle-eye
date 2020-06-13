/*jshint esversion: 6 */

"Use strict";

String.prototype.textNodeTrim = function textNodeTrim(){

	let s = this.replace(/\t/g, '');
	s = s.replace(/^\n/g , '');
	s = s.replace(/\n\n/g, '\n');
	s = s.replace(/  /g, ' ');

  //console.log('In:', JSON.stringify(this), 'Out:', JSON.stringify(s));

	return s;
};

String.prototype.firstWord = function stringWord(){
	///\s/ => any white space
	///^[a-z0-9]+$/i => only alphanumeric
	return this.split(/\s/).shift().replace(/[^a-z0-9]/gi,'');
};

String.prototype.capitalize = function stringCapitalize() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.decapitalize = function stringDecapitalize() {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.alignLeft = function stringAlignLeft(length, filler){
	filler = filler || ' ';
	return (this + filler.repeat(Math.max(length - this.length, 0))).substring(0, length);
};

String.prototype.dropTrailing = function stringDropTrailing(trail){
	return this.endsWith(trail)?this.slice(0,-1*trail.length):this;
};

Number.prototype.alignLeft = function numberAlignLeft(length, filler){
	return (this+'').alignLeft(length, filler);
};

Array.prototype.has = function arrayHas(element){
	return this.includes(element);
};

Array.prototype.drop = function arrayDrop(element){
	return this.filter(e => e != element);
};

//THIS sentence Capitalized -> This Sentence Capitalized
String.prototype.capitalizeSentence = function stringCapitalizeSentence(){
	return this.split(" ").map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(" ");
};

Array.prototype.numberedList = function numberedList(){
	const idLength = (this.length + " ").length;
	return this.map((content,index)=>`${(index+1+'').alignLeft(idLength)}${content}`).join('\n');
};

Object.prototype.numberedKeyValues = function numberedKeyValues(){
	const keys = Object.keys(this);
	const keysLength = Math.max(...keys.map(key => key.length));
	const idLength = (keys.length+1+'').length;
	return keys.map((key,index)=>`${(index+1).alignLeft(idLength)} ${(key).alignLeft(keysLength)} ${this[key]}`).join('\n');
};

if (!('toJSON' in Error.prototype))
Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        var alt = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            alt[key] = this[key];
        }, this);

        return alt;
    },
    configurable: true,
    writable: true
});
