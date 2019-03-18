

console._log = console.log;

console.log = function customLogger(...stuff){

  console._log(...stuff);
  document.body.innerHTML += ([...stuff].join(' ') + '<br>')

}