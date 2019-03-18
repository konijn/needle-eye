function Cursor( x , y )
{ //Constructor for a cursor instance
  this.x = Math.max( x || 0 , 0 );
  this.y = Math.max( y || 0 , 0 );
}

Cursor.prototype.advance = function()
{ //Infinite columns!
  this.x++;    
}

Cursor.prototype.recede = function()
{ //Go left if you can, otherwise go up
  this.x ? this.x-- : this.up();    
}

Cursor.prototype.up = function()
{ //Go up if you can, undefined is NOOP
  this.y ? this.y-- : undefined;    
}

Cursor.prototype.down = function()
{ //Infinite rows!
  this.y++;
}