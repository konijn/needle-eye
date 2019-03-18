// here be your javascript
let memo = {
  1:null,
  2:null,
  3:null,
  4:null,
};

let squares = [{square: 0, sum: 0}];
let depth = 0;

function race(n, choices, previous){
  console.log(' '.repeat(depth*2), depth, previous, 'First:', choices[0].square, choices[0].sum , 'Remainder:', n, 'Choices:', choices.length);
  //debugger;

  //Shortcut the stupid
  if(n==2 || n==3)
    return [null]; 

  //Did we hit it just right?
  if(n==choices[0].square)
    return [choices[0]];

  //Did we almost hit it just right?
  if(n==choices[0].square+1)
    return [choices[0],squares[1]];

  //Are we never going to make it?
  if(n > choices[0].sum)
    return [null];

  /*Does n happen to be an electable square*/
  let root = Math.floor(Math.sqrt(n));
  if(root*root==n){
    let needle = choices.filter(o=>o.square==n);
    if(needle.length)
      return [needle[0]];
  }

  //prune that list
  choices = choices.filter( o => o.square < n /*&& o.sum >= n*/);

  //Did we hit it just right now?
  if(n==choices[0].square)
    return [choices[0]];

  //Did we almost hit it just right now, please?
  if(n==choices[0].square+1)
    return [choices[0],squares[1]];
  //Fine, lets go deeper  
  let clone = choices.slice();  

  while(clone.length>1){
    let max = clone.shift();
    depth++;
    let list = race(n-max.square, clone, max.square);
    depth--;
    list.push(max);
    if(!list.includes(null)) 
      return list;
  }
  
  return [null];
}

function getSquares(n){
  
  let max = squares.length;
  
  while(max < n){
    
    squares[max] = { square: max * max, sum: squares[max-1].sum + max * max };
    max++;
  }
}

function decompose(n){
  
  var i;
  if(memo[n] !== undefined)
    return memo[n];
  //debugger;
  //let square = Math.floor(Math.sqrt(n));
  //debugger;
  getSquares(n);
  let choices = squares.slice(1,n).reverse();
  
  while(choices.length>1){
    let max = choices.shift();
    let list = race(n*n-max.square,choices, max.square);
    list.push(max);
    if(!list.includes(null)) 
      return list.map(o=>Math.sqrt(o.square)).sort((a,b)=>a-b).join(',');
  } 
  return null;
}
//console.log(5, decompose(5))
//console.log(50, decompose(50)) //"1,3,5,8,49"
//console.log('Expected',  [4,8,26,425,90690]);
//console.log(90691, decompose(90691))
//console.log('Expected',  [1,2,4,7,23,414,85997]);
//console.log(85998, decompose(85998))
console.log('Expected', [4,31,424,90376]);
console.log(85998, decompose(90377));




 


