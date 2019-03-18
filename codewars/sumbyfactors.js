
Object.entries = function( obj ){
  var ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
  while (i--)
    resArray[i] = [+ownProps[i], obj[ownProps[i]]];
  return resArray;
};

//Fill the Sieve
function fillSet(set,n, max){
  let i = n*2;
  while(i<=max){
    set.add(i);
    i = i + n;
  }
}
var primes = [], set = new Set();

//No need to do more than we need
function primeFactorList(n){
  var i;
  let list = [];
  max = n;// - Math.ceil(Math.sqrt(n));
  
  for(i = 2; i<=max;i++){
  	  if(!set.has(i)){
        if(n % i == 0)
        	list.push(i);
        primes.push(i);
        fillSet(set,i,max);
      }
  }
  return list;
}

function primeFactorListSeeded(n){
  var i;
  let list = [];
  max = n;// - Math.ceil(Math.sqrt(n));
  
  for(i = 2; i<=max;i++){
  	  if(!set.has(i)){
        if(n % i == 0)
        	list.push(i);
      }
  }
  return list;
}

function sumOfDivided(list) {
  
  let absList = list.map(n => Math.abs(n)),
      max = Math.max(...absList),
      trash = primeFactorList(max),
      factorsList = list.map(n => primeFactorListSeeded(Math.abs(n))),
      sums = {};
  
  factorsList.forEach( (factors,i) => factors.forEach(v => (sums[v] = (sums[v] || 0) + list[i]) ))
  
  return Object.entries(sums);
} 
