//jshint  esversion: 9


console.log('Controller loaded');

const controller = (function createController(document){

  document.addEventListener("click" , function(event){
    if(!event || !event.srcElement || !event.srcElement.tagName){
      return;
    }
    if(event.srcElement.tagName === "U"){
      const id = event.srcElement.id;
      if(controller[id]){
        controller[id]();
      }
    }
  });

  function portal(){
    console.log('portal was clicked');
  }

  return {
    portal
  };

})(document);
