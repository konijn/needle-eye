
console.log('Controller loaded');

const controller = (function createController(document){

  document.addEventListener("click" , function(event){
    if(event.srcElement.tagName === "U"){
      console.log(this, event.srcElement.id);

    }
  });



})(document);
