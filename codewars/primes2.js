
class Primes {
  
  static * stream() {

    let sieve = {4:2}, candidate = 3;
    var i, index;

    yield 2;
    
    while(candidate){
      let sieveValue = sieve[candidate];
      if(sieveValue == undefined){
        index = candidate + candidate;
        while(sieve[index] || !(index%2))
            index = index + candidate;
        sieve[index] = candidate
        yield candidate;      
      }else{
        index = candidate + sieveValue;
        while(sieve[index] || !(index%2))
            index = index + sieveValue;
        sieve[index] = sieveValue;
        delete sieve[candidate];
       }
      candidate = candidate + 2;
    }   
    
    while(true)
      yield -1;
  }
}


console.clear()
console.log("0,2,3,5,7,11,13,17,19,23,29")
//debugger;
const stream = Primes.stream()
for(x=0;x<10;x++)
  console.log( stream.next() )















