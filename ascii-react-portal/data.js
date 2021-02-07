//jshint  esversion: 9


const data = (function createData(){

  const gameVersion = "1.0.0";

  let game = {

  };

  function load(){
    game = JSON.parse(localStorage.getItem(gameVersion));
    ui.show(game);
  }

  function save(){
    localStorage.setItem(gameVersion, JSON.stringify(game));
  }

  function reset(){
    game = {};
    save();
  }

  load();


  return {
    data,
    load,
    reset
  };

})();
