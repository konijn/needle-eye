function guid() {

  guid.current = guid.current || 0;
  guid.current++;
  return guid.current;

}
