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

String.prototype.word = function stringWord(){
	///\s/ => any white space
	///^[a-z0-9]+$/i => only alphanumeric

	return this.split(/\s/).shift().replace(/[^a-z0-9]/gi,'');
};

Array.prototype.has = function arrayHas(element){
	return this.includes(element);
};

Array.prototype.drop = function arrayDrop(element){
	return this.filter(e => e != element);
};
