
const R = {color: 'red', name: 'red'};
const B = {color: 'blue', name: 'blue'};
const G = {color: 'green', name: 'green'};

//Inspiration
//https://github.com/Nishant-MC/Open-ArcoMage

cards = [
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

];