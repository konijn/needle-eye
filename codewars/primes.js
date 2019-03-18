
class Primes {

  
  static * stream() {
    // replace this with your solution
    const blockSize = 5
    let sieve = {4:2};
    let candidate = 3;
    var i, index;
    
    while(candidate){
      let sieveValue = sieve[candidate];
      if(sieveValue == undefined){
			  for(i = 2, index = candidate; i < blockSize; i++){
          index += candidate;
          sieve[index] = true;
        }
        index += candidate;
        sieve[index] = candidate;
        yield candidate;
      }else if(sieveValue !== true){
			  for(i = 2, index = candidate; i < blockSize; i++){
          index += sieveValue;
          sieve[index] = true;
        }
        index += sieveValue;
        sieve[sieveValue] = sieveValue;
        
        delete sieve[candidate];
      }else{
        delete sieve[candidate];
      }
      candidate += 2;
    }   
    
    while(true)
      yield -1;
  }
}



function* primes() {
    var seq = numbers(2);
    var prime;

    while (true) {
        prime = seq.next().value;
        yield prime;
        seq = filter(seq, prime);
    }
}
console.clear()
debugger;
const stream = Primes.stream()
for(x=0;x<10;x++)
  console.log( stream.next() )















