var width, height, last;
let svg = document.getElementById('playground');
let circles = [];


function listenToResize() {

  function captureSize() {
    height = window.innerHeight || document.documentElement.clientHeight;
    width = window.innerWidth || document.documentElement.clientWidth;
    svg.setAttribute("height", height + "px");
    svg.setAttribute("width", width + "px");
  }

  window.addEventListener("resize", captureSize);

  captureSize();
}

listenToResize();

svg.addEventListener("click", addImp);

function addImp(e) {
  console.log(e, 'Hello World')
  //<circle id='top' cx="32" cy="32" r="32" fill="url(#image)" stroke="blue"/>
  let imp = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a circle in SVG's namespace  
  imp.setAttribute('id', guid());
  imp.setAttribute('r', 32);
  /*magic to make the tiling work..*/
  imp.setAttribute('cx', e.x - e.x % 64 + 32);
  imp.setAttribute('cy', e.y - e.y % 64 + 32);
  imp.setAttribute('fill', 'url(#imp)');
  imp.style.stroke = "blue"; //Set stroke colour
  svg.appendChild(imp);
}

function step(timestamp) {
  last = last || timestamp;
  let progress = timestamp - last;
 
  movingList = document.getElementsByTagName("circle");
  for (e of movingList) {
    //e.style.left = Math.min(progress) + 'px';
    e.setAttribute( 'cx', e.getAttribute('cx')*1 + progress/100 );
    if (isOutOfBounds(e)) {
      removeElement(e);
    }
  }
  window.requestAnimationFrame(step);
}

//window.requestAnimationFrame(step);

function removeElement(e) {
  e.parentNode.removeChild(e);
}

function removeElementId(id) {
  removeElement(document.getElementById(elementId));
}

function isOutOfBounds(e) {

  let bounding = e.getBoundingClientRect();
  return bounding.top < 0 || bounding.left < 0 || bounding.bottom > height || bounding.right > width;
}