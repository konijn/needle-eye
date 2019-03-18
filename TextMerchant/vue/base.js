
Array.prototype.filterClass = function arrayFilterClass(_constructor){
  return this.filter(o => o instanceof _constructor);
}

Array.prototype.filterValue = function arrayFilterValue(propertyName, value){
  return this.filter(o => o[propertyName] == value)
}


Array.prototype.sortBy = function arraySortBy(propertyName){
  return this.sort((a,b) => a[propertyName]-b[propertyName]);
}

Array.prototype.first = function arrayFirst(){
  return this[0];
}


Array.prototype.toCamelCase = function toCamelCase(){
  let str = this;
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

HTMLCollection.prototype.indexOf = function indexOf(e){
  for(let i = 0;i < this.length;i++)
    if(e===this[i])
      return i;
}