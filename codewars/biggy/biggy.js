function B(n) {
	if (!(this instanceof B))
		return new B(n);
	if (this.value)
		return this;
	this.value = (n || '0') + "";
}

B.prototype.valueOf = function valueOfB() {
	return this.value;
}

B.prototype.reverse = function reverseB() {
	this.value = this.value.split('').reverse().join('');
	return this;
}

B.prototype.add = function addB(b) {

	let v1 = B(b).reverse().valueOf().split(''),
		v2 = this.reverse().valueOf().split(''),
		zeroes = 0,
		remainder = 0,
		out = "";
	//debugger;
	while (v1.length || v2.length) {
		d1 = v1.shift() || 0;
		d2 = v2.shift() || 0;
		d = +d1 + +d2 + remainder;
		if (d > 9)
			d = d - 10, remainder = 1;
		else
			remainder = 0;
		out = d + out;

	}
	this.value = out;
	//console.log(this.value);
	return this;
}
//console.log(B(0).add(49).add(420));
/*
67*7
  49
 420
 469
*/
function multiSingle(b, n) {
	//debugger;
	b = typeof b == 'number' ? B(b) : b;

	console.log(b.reverse().valueOf().split('').map((v, i) => v * n + "" + "0".repeat(i)));
	console.log(B(0).add(49).add(420));

}




B.prototype.multiply = function MultiplyB(b) {
	let right = B(b).value.split('').reverse(),
		left = this.value.split('').reverse(),
		out = B(0);

	right.forEach((v, i) => left.forEach((v2, i2) => console.log(v * v2 + "0".repeat(i + i2))));
	right.forEach((v, i) => left.forEach((v2, i2) => out.add(v * v2 + "0".repeat(i + i2))));
	this.value = out.value;
	return this;
}

//console.log(B(670).multiply(670));

function permutationCountNew(n) {
	let out = B(1);
	while (n)
		out = out.multiply(n--);
	return out;
}

function permutationCountOld(n) {
	let out = 1;
	while (n)
		out = out * n--;
	return out.valueOf();
}

function permutationCountBig(n) {
	n = BigInt(n);
	let out = BigInt(1);
	while (n)
		out = out * n--;
	return out;
}


console.log(permutationCountBig(21));
console.log(permutationCountOld(21));
console.log(permutationCountNew(21));
