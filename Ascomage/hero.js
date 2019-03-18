

function Hero(){

  //Resources
  this.bricks = 7;
  this.gems = 5;
  this.recruits = 5;

  //Producers
  this.mines = 4;
  this.magic = 2;
  this.dungeon = 1;

  //Real estate
  this.wall = 25;
  this.tower = 15;

  //How many turns extra do we get?
  this.momentum = 0;
}
/*
  [R, "Brick Shortage"  , 0 , ()=>all.addBricks(-8)],
  [R, "Lucky Cache"     , 0 , ()=>hero.addBricks(2).addGems(2).again()],
  [R, "Friendly Terrain", 1 , ()=>hero.addWall(1).again()],
  [R, "Miners"          , 3 , ()=>hero.addMines(1)],
  [R, "Mother Lode"     , 4 , ()=>hero.addMines((other.mines > hero.mines) ? 2 : 1)],
  [R, "Dwarven Miners"  , 7 , ()=>hero.addMines(1).addWall(4)],
  [R, "Work Overtime"   , 2 , ()=>hero.addWall(5).addGems(-6)],
  [R, "Trade Secrets"   , 5 , ()=>hero.setMines(Math.max(hero.mines, other.mines))],
  [R, "Basic Wall"      , 2 , ()=>hero.addWall(3)],
  [R, "Sturdy Wall"     , 3 , ()=>hero.addWall(4)],
  [R, "Innovations"     , 2 , ()=>hero.addGems(4).addMines(1).other().addMines(1)],
  [R, "Foundations"     , 3 , ()=>hero.addWall(hero.wall?6:3)],
  [R, "Tremors"         , 7 , ()=>all.addWall(-5).again()],
  [R, "Secret Room"     , 8 , ()=>hero.addMagic(1).again()],
  [R, "Earthquake"      , 0 , ()=>all.addMines(-1)],
  [R, "Big Wall"        , 5 , ()=>hero.addWall(6)],
  [R, "Collapse"        , 4 , ()=>other.addMines(-1)],
  [R, "New Equipment"   , 6 , ()=>hero.addMines(2)],
  [R, "Strip Mine"      , 0 , ()=>hero.addMines(-1).addWall(10).addGems(5)],
  [R, "Reinforced Wall" , 8 , ()=>hero.addWall(8)],
  [R, "Porticulus"      , 9 , ()=>hero.addWall(5).addDungeon(1)],
  [R, "Crystal Rocks"   , 9 , ()=>hero.addWall(7).addGems(7)],
  [R, "Harmonic Ore"    , 11, ()=>hero.addWall(6).addTower(3)],
  [R, "Great Wall"      , 13, ()=>hero.addWall(12)],
  [R, "New Designs"     , 15, ()=>hero.addWall(8).addTower(5)],
  [R, "Ultimate Wall"   , 16, ()=>hero.addWall(15)],
  [R, "Rock Launcher"   , 18, ()=>hero.addWall(6).other().damage(10)],
  [R, "Dragon's Heart"  , 24, ()=>hero.addWall(20).addTower(8)],
  [R, "Forced Labor"    , 7 , ()=>hero.addWall(9).addRecruits(-5)],
  [R, "Rock Garden"     , 1 , ()=>hero.addWall(1).addTower(1).addRecruits(2)],
  [R, "Flood Water"     , 6 , ()=>queryHeroes(LOWEST_WALL).addDungeon(-1).addTower(-2)],
  [R, "Barracks"        , 10, ()=>hero.addRecruits(6).addWall(6).addDungeon( other.dungeon > hero.dungeon ? 1 : 0)],
  [R, "Battlements"     , 14, ()=>hero.addWall(7).other().damage(6)],
  [R, "Shift"           , 17, ()=>hero.swapWalls()]
*/

//Hero.prototype.addBricks = (n) => (this.bricks+=n, this);

/* Resources */
Hero.prototype.addBricks = function addBricks(n){
  this.bricks += n;
  return this;
}

Hero.prototype.addGems = function addGems(n){
  this.gems += n;
  return this;
}

Hero.prototype.addRecruits = function addRecruits(n){
  this.bricks += n;
  return this;
}

/* Producers */
Hero.prototype.addMines = function addMines(n){
  this.mines += n;
  return this;
}

Hero.prototype.addGems = function addGems(n){
  this.gems += n;
  return this;
}

Hero.prototype.addRecruits = function addRecruits(n){
  this.bricks += n;
  return this;
}

/* Time */
Hero.prototype.again = function again(n){
  this.momentum += (n || 1);
  return this;
}

/* Real estate */

Hero.prototype.addTower = function addTower(n){
  this.tower += n;
  return this;
}

Hero.prototype.addWall = function addWall(n){
  this.bricks += n;
  return this;
}

/* Enemy management */

Hero.prototype.setOther = function setOther(other){
  this.other = other;
}