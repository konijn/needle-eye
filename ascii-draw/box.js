function Box( cell1 , cell2 )
{ //Constructor for box instances by using 2 cells
  //Find the upper left corner
  var x1 = Math.min( cell1.x , cell2.x );
  var y1 = Math.min( cell1.y , cell2.y );
  //Find the bottom right corner
  var x2 = Math.max( cell1.x , cell2.x );
  var y2 = Math.max( cell1.y , cell2.y );    
  //Set the normalized from & to
  this.from = {  x : x1, y : y1 };
  this.to   = {  x : x2, y : y2 };   
}


Box.prototype.each = function( f )
{ //Loop over each cell, call f with an x,y object
  with (this)
    for( var x = from.x ; x <= to.x ; x++ )
      for( var y = from.y ; y <= to.y ; y++ )
        f( { x : x , y : y } );
}

Box.prototype.eachRow = function( f )
{ //Loop over each row, call f
  with (this)
    for( var y = from.y ; y <= to.y ; y++ )
      f( y );
}

//Loop over each column, call f
Box.prototype.eachColumn = function( f )
{ //Loop over each row, call f
  with (this)
    for( var x = from.x ; x <= to.x ; x++ )
      f( x );
}