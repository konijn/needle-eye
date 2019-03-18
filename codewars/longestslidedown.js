function longestSlideDown(p){
  
  p = p.reverse();
  var i, row;
  let max = 0;
  
  for( i = 1; i < p.length ; i++ ) {
    row = p[i];
    for(n = 0 ; n < row.length; n++){
      row[n] = row[n] + Math.max(p[i-1][n] , p[i-1][n+1]);
    }
  }
  
  return row[0];
  
}
