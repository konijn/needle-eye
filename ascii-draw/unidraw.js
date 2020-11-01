/* Unidraw, because we can*/
//Documentation:
//  http://en.wikipedia.org/wiki/Box-drawing_character
//Competition:
//  http://www.asciidraw.com/#Draw
//  http://asciiflow.com/

(function IIFE(){
"use strict";

var canvas,
    context,
    clipboard;

var model = (function()
{
  //Privates
  var cells = [],
      tabSize = 4;
  //Exposed
  var cursor = new Cursor();
  function write( x, y, s )
  {
    //Make sure that we have an array for y
    //Always assume overwrite mode
    var originalX = x;
    cells[y] = cells[y] || [];
    for( var i = 0; i < s.length ; i++)
    {
      var c = s[i];
      if( c.charCodeAt(0) > 31 )
      {
        cells[y][x++] = s[i];
      }
      else if ( c == "\n" )
      {
        y++;
        cells[y] = cells[y] || [];
        x = originalX;
      }
      else if ( c == '\t' )
      {
        x += tabSize;
      }
    }
    return new Cursor( x, y );
  }
  function setCell( cursor , c )
  {
    return write( cursor.x , cursor.y , c );
  }
  function getCell( cursor )
  {
    return cells[cursor.y] ? cells[cursor.y][cursor.x] || " " : " ";
  }
  function stringify()
  {
    var s = '', x, y;
    for( y = 0 ; y < cells.length ; y++ )
    {
      if( cells[y] )
        for( x = 0 ; x < cells[y].length ; x++ )
          s = s + ( cells[y][x] || " " );
      s = s + '\n';
    }
    return s?s:" ";
  }
  function backspace()
  { //Move everything one character to the left of the cursor
    if( cells[ model.cursor.y ] )
      cells[ model.cursor.y ].splice( model.cursor.x-1 , 1 );
    model.cursor.recede();
  }
  function addVersion( key )
  { //Called internally. add a version to a version array (found with `key`)
    var json = localStorage[key];
    var versions = json ? JSON.parse( json ) : [];
    versions.push( stringify() );
    try{
      localStorage[key] = JSON.stringify( versions );
    }catch(exception){
      if(exception  instanceof DOMException){
        //Lets drop half of the undo's.. this still allows a long history..
        //

      }
    }
  }
  function getVersion( key )
  { //Called internally, get a version (and remove it) from a version array
    var json = localStorage[key];
    var versions = json ? JSON.parse( json ) : [];
    var version = versions.pop();
    localStorage[key] = JSON.stringify( versions );
    return version;
  }
  function storeVersion()
  { //Called from controller, removes all redo versions
    addVersion( 'undo' , stringify()  );
    localStorage.removeItem( 'redo' );
  }
  function restoreVersion()
  { //Called from controller, adds a redo version
    var version = getVersion( 'undo' );
    if(version){
      addVersion( 'redo' );
      cells = [];
      write( 0 , 0 , version );
    }
  }
  function redo()
  { //Called from controller, puts version back on to undo
    var version = getVersion( 'redo' );
    if(version){
      addVersion( 'undo' );
      cells = [];
      write( 0 , 0 , version );
    }
  }
  function isLineCharacter(  cursor, dx , dy , returnValue )
  {
    cursor = { x: cursor.x + dx , y: cursor.y + dy };
    return ~'╔═╦╗║╠╬╣╚╩╝><'.indexOf( getCell( cursor ) ) ? returnValue : 0;
  }

  //Modulify
  return {
    write: write,
    stringify: stringify,
    setCell: setCell,
    getCell: getCell,
    cursor: cursor,
    backspace: backspace,
    storeVersion: storeVersion,
    restoreVersion: restoreVersion,
    redo: redo,
    isLineCharacter: isLineCharacter
  };
}());

var ui = (function()
{
  //Privates
  var fontSize = 15,
      breatheDuration = 5 * 1000, //5 seconds
      lightGrey = 211,
      black = 0,
      greyRange = lightGrey - black,
      p = 20, //Padding..
      magicalMultiplier = 0.8, //Dont ask
      w,  //Width
      h,  //Height
      fh, //fontHeight
      fw, //fontWidth
      vo, //Vertical offset for writing
      ho, //Horizontal offset for writing
      metrics,
      box;

  //Exposed
  function breathe()
  { //Set the `caret` in a grey shade that follows a breathing cycle
    var rightNow = new Date(),
        position = rightNow % breatheDuration,
        radians = position / breatheDuration * Math.PI,
        sine = Math.sin( radians ),
        shade = Math.floor( lightGrey - greyRange/2 + sine * greyRange / 2 ),
        cx = model.cursor.x,
        cy = model.cursor.y;

    context.strokeStyle = 'rgb(' + shade + ',' + shade + ',' + shade + ')';
    context.lineWidth = 0.5;
    context.beginPath();

    context.moveTo(cx*fw + p, cy*fh + p);
    context.lineTo(cx*fw + p + fw, cy*fh + p);
    context.lineTo(cx*fw + p + fw, cy*fh + p + fh);
    context.lineTo(cx*fw + p , cy*fh + p + fh);
    context.lineTo(cx*fw + p, cy*fh + p);
    context.stroke();
  }
  function drawBox()
  {
    context.strokeStyle = 'black';
    context.lineWidth = 0.5;
    context.beginPath();

    context.moveTo(box.from.x   *fw + p, box.from.y   *fh + p);  //Top left
    context.lineTo((box.to.x+1) *fw + p, box.from.y   *fh + p);  //Top Right
    context.lineTo((box.to.x+1) *fw + p, (box.to.y+1) *fh + p);  //Bottom Right
    context.lineTo(box.from.x   *fw + p, (box.to.y+1) *fh + p);  //Bottom Left
    context.lineTo(box.from.x   *fw + p, box.from.y   *fh + p);  //Top Left
    context.stroke();
  }
  function setBox( cell1 , cell2 )
  {
    box = new Box( cell1 , cell2 );
  }
  function clearBox()
  {
    box = undefined;
  }
  function getBox()
  {
    return box;
  }
  function adapt()
  { //Adapt the UI to the current size of the body
    //Clearly, the UI maintains it's own model
    w = canvas.width  = document.body.clientWidth;
    h = canvas.height = window.innerHeight;
    document.documentElement.style.overflow = 'hidden';
    context.font = fontSize + (~navigator.userAgent.indexOf('Mac') ? "px Consolas" : "px Monospace"); //EVIL Mac Fix
    metrics = context.measureText('A');
    fh = fontSize+1;
    fw = metrics.width;
    vo = p+fh*magicalMultiplier;
    ho = p;
    drawGrid();
  }
  function drawGrid()
  {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var x = 0; x < w; x += fw)
    {
      context.moveTo(x + p, 0 + p);
      context.lineTo(x + p, h );
    }

    for (var y = 0; y < h; y += fh)
    {
      context.moveTo(0 + p, y + p);
      context.lineTo(w , y + p);
    }
    context.lineWidth = 0.1;
    context.strokeStyle = "lightgrey";
    context.stroke();

    context.strokeStyle = "black";
    context.fillStyle = "black";

    var string = model.stringify();
    if( string ){
      var strings = string.split("\n");
      for( var row = 0 ; row < strings.length ; row++ )
        for( var col = 0 ; col < strings[row].length ; col++ )
          context.fillText( strings[row][col] , ho  + fw * col  , vo + fh * row );
    }

    if( box )
      drawBox( box.from , box.to );
  }
  function translate( cursor )
  { //Translate screen coordinates to cell coordinates
    var x = Math.floor((cursor.x - p ) / fw ),
        y = Math.floor((cursor.y - p ) / fh );
    //Cheat on boundaries
    x = x < 0 ? 0 : x;
    y = y < 0 ? 0 : y;
    //Return a new cell cursor object
    return new Cursor(x,y);
  }

  //Modulify
  return {
    breathe : breathe,
    drawGrid : drawGrid,
    adapt: adapt,
    translate: translate,
    setBox: setBox,
    clearBox: clearBox,
    getBox: getBox
  };
}());

var controller = (function()
{
  var BACKSPACE = 8,
      TAB = 9,
      ARROW_LEFT = 37,
      ARROW_UP = 38,
      ARROW_RIGHT = 39,
      ARROW_DOWN = 40,
      DELETE = 46,
      KEY_A = 65,
      KEY_B = 66,
      KEY_C = 67,
      KEY_X = 88,
      KEY_Y = 89,
      KEY_Z = 90;

  var startingCell,
      currentCell;

  function normalizeEvent(e)
  { //Normalize which for key events, inspiration:SO
    if ( e.which === null && (e.charCode !== null || e.keyCode !== null) ) {
      e.which = e.charCode !== null ? e.charCode : e.keyCode;
    }
  }

  function onContentLoaded()
  { //Could have been called onInit
    //Set the 3 globals
    canvas  = document.getElementById("canvas");
    context = canvas.getContext ("2d");
    clipboard = document.getElementById('clipboard');
    //Occupy full body & draw the initial UI
    ui.adapt();
    //Set up listeners
    window.addEventListener( "resize", ui.adapt );
    canvas.addEventListener( "mouseover", onMouseOver );
    canvas.addEventListener( "mousemove", onMouseOver );
    canvas.addEventListener( "mousedown", onMouseDown );
    canvas.addEventListener( "mouseup", onMouseUp );
    canvas.addEventListener( "click", onClick );
    document.addEventListener( "keypress", onKeyPress );
    document.addEventListener( "keydown", onKeyDown );
    document.addEventListener( "paste", onPaste );
    //Make the cursor breathe
    setInterval( ui.breathe , 1000/12 ); // 12 frames per second
  }
  function onPaste(e)
  { //Determine where to paste, paste, determine & set new cursor location, redraw everything
    var cursor = model.cursor;
    model.cursor = model.write(  cursor.x , cursor.y ,  e.clipboardData.getData('text/plain') );
    ui.drawGrid();
  }
  function onMouseDown(e)
  {
    //Remember where we start
    startingCell = ui.translate( e );
    //Clear any old boxes
    ui.clearBox();
    //Force the UI in onMouseOver to draw the new cursor without a mouse up
    currentCell = { x : -1 , y : -1 };
    onMouseOver(e);
  }
  function onMouseUp()
  {
    ui.setBox( startingCell , currentCell );
    currentCell = startingCell = undefined;
  }
  function onMouseOver(e)
  { //Are we dragging?, which cell are we on, update if we are in a different cell, and draw
    if(!startingCell)
      return;
    var cell = ui.translate( e );
    if( cell.x != currentCell.x || cell.y != currentCell.y )
    {
      currentCell = cell;
      model.cursor =  cell;
      ui.setBox( startingCell , currentCell );
      ui.drawGrid();
    }
  }
  function onClick(e)
  { //Move the cursor to where the user clicked
    model.cursor = ui.translate( e );
    ui.drawGrid();
  }
  function onKeyPress(e)
  { //console.log( e , String.fromCharCode( e.charCode || 32 ) );
    if( e.ctrlKey  )
      return;
    model.storeVersion();
    model.setCell( model.cursor, String.fromCharCode( e.charCode || 32 ) );
    ui.clearBox();
    model.cursor.advance();
    ui.drawGrid();
  }
  function onKeyDown(e)
  { //console.log( e , String.fromCharCode( e.charCode || 32 ) );
    normalizeEvent(e);
    var box = ui.getBox();

    if( e.which == BACKSPACE )
    {
      model.backspace();
      e.preventDefault();
    }
    else if( e.which == TAB )
    {
      model.cursor =  model.setCell( model.cursor , '\t' );
      e.preventDefault();
    }
    else if( e.which == ARROW_LEFT ){
      model.cursor.recede();
    }
    else if( e.which == ARROW_RIGHT ){
      model.cursor.advance();
    }
    else if( e.which == ARROW_UP ){
      model.cursor.up();
    }
    else if( e.which == ARROW_DOWN ){
      model.cursor.down();
    }
    else if( e.key == 'Home' && e.ctrlKey ){
      model.cursor = new Cursor( 0, 0 );
    }
    else if( e.key == 'Home' )
    { //Move to complete left unless already there, in that case go top left
      if(model.cursor.x){
        model.cursor.x = 0;
      }else{
        model.cursor.y = 0;
      }
    }
    else if( ( e.which == KEY_C || e.which == KEY_X ) && e.ctrlKey )
    { //Copy a box or a whole character
      if( box )
      {
        var lines = [];
        box.eachRow( function(y){ lines[ y - box.from.y ] = ''; } );
        box.each( function(cursor){ lines[ cursor.y - box.from.y ] += model.getCell(cursor); } );
        var line = lines.join("\n");
        clipboard.value = line;
      }
      else
      {
        clipboard.value = model.getCell( ui.getCursor() ) || " ";
      }
      /*Clipboards are fickle*/
      if(e.which == KEY_X){
        box.each( function(cursor){ model.setCell( cursor, " " ); } );
      }
      clipboard.focus();
      clipboard.select();
    }
    else if( e.which == KEY_A && e.ctrlKey )
    {
      if( box )
      {

      }
    }
    else if( e.which == KEY_B && e.ctrlKey )
    {
      /* Styles:
         ╔═╦═╗  ⇓
         ║ ║ ║  ☺☺
         ╠═╬═╣
         ╚═╩═╝ */
      var onLeft   = 1; //Bitflag 1
      var onRight  = 2; //Bitflag 2
      var onTop    = 4; //Bitflag 3
      var onBottom = 8; //Bitflag 4
      var lineRules = {};
      lineRules[onLeft+onRight] = '═';
      lineRules[onTop+onBottom] = '║';
      lineRules[onTop+onLeft] = '╝';
      lineRules[onTop+onRight] = '╚';
      lineRules[onBottom+onLeft] = '╗';
      lineRules[onBottom+onRight] = '╔';
      lineRules[onLeft+onRight+onTop+onBottom] = '╬';
      lineRules[onLeft+onRight+onTop] = '╩';
      lineRules[onLeft+onRight+onBottom] = '╦';
      lineRules[onTop+onBottom+onLeft] = '╣';
      lineRules[onTop+onBottom+onRight] = '╠';

      if( box )
      {
        model.storeVersion();
        //Show intent
        box.eachRow( function(y){ model.write( box.from.x, y, '║' ); model.write( box.to.x, y , '║' ); } );
        box.eachColumn( function(x){ model.write( x, box.from.y, '═' ); model.write( x, box.to.y , '═' ); } );
        //Line up
        box.each(  function lineUp( cursor )
        {
          if( !model.isLineCharacter( cursor , 0 , 0 , true ) )
            return;

          var neighbourBitFlag =
             model.isLineCharacter( cursor , -1 , +0 , onLeft ) +
             model.isLineCharacter( cursor , +1 , +0 , onRight ) +
             model.isLineCharacter( cursor , +0 , +1 , onBottom ) +
             model.isLineCharacter( cursor , +0 , -1 , onTop );

            if( lineRules[neighbourBitFlag] )
              model.setCell( cursor , lineRules[neighbourBitFlag] );
          });
        }
      }
      else if (e.which == DELETE)
      {
        if( box ){
          box.each( function(cursor){ model.setCell( cursor, " " ); } );
        }
      }
      else if ( e.which == KEY_Z && e.ctrlKey )
      { //Undo
        model.restoreVersion();
      }
      else if ( e.which == KEY_Y && e.ctrlKey )
      { //Undo
        model.redo();
      }
      //Clear the selection box after a key press (Control does not count)
      if( e.key != "Control" && box )
      {
        ui.clearBox();
      }
      //Draw the grid in all cases
      ui.drawGrid();
  }
  return {
    onContentLoaded: onContentLoaded,
  };
}());

//Engage!
document.addEventListener( "DOMContentLoaded", controller.onContentLoaded, false );

})();
