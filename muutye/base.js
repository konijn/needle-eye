

String.prototype.textNodeTrim = function textNodeTrim(){
	
	let s = this.replace(/\t/g, '');
	s = s.replace(/^\n/g , '');
	s = s.replace(/\n\n/g, '\n');
	s = s.replace(/  /g, ' ');
	
  console.log('In:', JSON.stringify(this), 'Out:', JSON.stringify(s));
	
	return s;
}