export default class Boundary {
  static width = 48;
  static height = 48;
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
  }

  update(input) {}

  draw(c) {
    // c.fillStyle = "red";
    // this.game.debug && c.fillRect(this.x, this.y, this.width, this.height);

    c.storkeStyle = "red";
    this.game.debug && c.strokeRect(this.x, this.y, this.width, this.height);
  }
}
