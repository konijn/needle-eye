/*
  Game object
*/

function Game() {
}

Game.prototype.restart = function restartGame() {

  this.hero = new Hero();
  this.enemy = new Hero();

  this.hero.setOther(this.enemy);
  this.enemy.setOther(this.hero);

}
