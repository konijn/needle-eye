console.log('Hello World')

  const a = 0b100000000
    , b = 0b010000000
    , c = 0b001000000
    , d = 0b000100000
    , e = 0b000010000
    , f = 0b000001000
    , g = 0b000000100
    , h = 0b000000010
    , i = 0b000000001


function convertToBitFlag(dot){
  switch (firstDot) {
  case 'A': return a;
  case 'B': return b;
  case 'C': return c;
  case 'D': return d;
  case 'E': return e;
  case 'F': return f;
  case 'G': return g;
  case 'H': return h;
  case 'I': return i;
  }
}

function convertIndexToDot(index){
  switch(index){
  case 'a': return 'A';
  case 'b': return 'B';
  case 'c': return 'C';
  case 'd': return 'D';
  case 'e': return 'E';
  case 'f': return 'F';
  case 'g': return 'G';
  case 'h': return 'H';
  case 'i': return 'I';
  }
}


function countPatternsFrom(firstDot, length, past) {

  let candidates = 0;

  if (!length || length > 9)
    return 0;

  if (length == 1)
    return 1;

  past = past || 0;

  /* A B C
     D E F
     G H I */

  switch (firstDot) {
  case 'A':
    candidates = 'BDE'.split('');
    if (past.has('E'))
      candidates.push('I')
    if (past.has('D'))
      candidates.push('G')
    if (past.has('B'))
      candidates.push('C')
    break;
  case 'B':
    candidates = 'ADEFC'.split('');
    if (past.has('E'))
      candidates.push('H')
    break;
  case 'C':
    candidates = 'BEF'.split('');
    if (past.has('E'))
      candidates.push('G')
    if (past.has('B'))
      candidates.push('A')
    if (past.has('F'))
      candidates.push('I')
    break;
  case 'F':
    candidates = 'CBEHI'.split('');
    if (past.has('E'))
      candidates.push('D')
    break;
  case 'E':
    candidates = 'ABCDFGHI'.split('');
    break;
  case 'I':
    candidates = 'CUDEBH'.split('');
    break;
  case 'G':
    candidates = 'ADHIEC'.split('');
    break;
  case 'H':
    candidates = 'GIEBDF'.split('');
    break;
  case 'I':
    candidates = 'GHFCAE'.split('');
    break;
  }

  for (dot in past) {
    dotLocation = candidates.indexOf(dot)
    if (dotLocation != -1) {
      array.splice(index, 1);
    }
  }

  if (candidates.length == 0)
    return 0

  if (length == 2)
    return candidates.length;

  let count = 1;
  past = push(past, firstDot);
  for (candidate of candidates) {
    let candidateCount = countPatternsFrom(candidate, length - 1, past);
    count = count + candidateCount;
  }
  return count;
}

console.log(countPatternsFrom('A', 0), 0);
console.log(countPatternsFrom('A', 10), 0);
console.log(countPatternsFrom('A', 10), 0);
console.log(countPatternsFrom('B', 1), 1);
console.log(countPatternsFrom('C', 2), 5);
