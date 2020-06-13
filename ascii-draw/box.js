/*jshint -W085, esversion: 6  */

function Box( cell1 , cell2 )
{ //Constructor for box instances by using 2 cells
  //Find the upper left corner
  const x1 = Math.min( cell1.x , cell2.x );
  const y1 = Math.min( cell1.y , cell2.y );
  //Find the bottom right corner
  const x2 = Math.max( cell1.x , cell2.x );
  const y2 = Math.max( cell1.y , cell2.y );
  //Set the normalized from & to
  this.from = {  x : x1, y : y1 };
  this.to   = {  x : x2, y : y2 };
}


Box.prototype.each = function boxEach( f )
{ //Loop over each cell, call f with an x,y object
  with (this)
    for( let x = from.x ; x <= to.x ; x++ )
      for( let y = from.y ; y <= to.y ; y++ )
        f( { x : x , y : y } );
};

Box.prototype.eachRow = function boxEachRow( f )
{ //Loop over each row, call f
  with (this)
    for( let y = from.y ; y <= to.y ; y++ )
      f( y );
};

//Loop over each column, call f
Box.prototype.eachColumn = function boxEachColumn( f )
{ //Loop over each row, call f
  with (this)
    for( let x = from.x ; x <= to.x ; x++ )
      f( x );
};
