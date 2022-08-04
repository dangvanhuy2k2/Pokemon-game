export default class Player {
  constructor(game) {
    this.game = game;

    this.image = undefined;

    this.maxFameX = 4;
    this.maxFameY = 1;
    this.width = undefined;
    this.height = undefined;
    this.frameX = 0;
    this.frameY = 0;

    this.currentDirection = undefined;
    this.isMoving = false;
    this.infoDirections = {
      w: {
        image: document.getElementById("playerUp"),
        direction: "up",
        frameX: 0,
      },
      s: {
        image: document.getElementById("playerDown"),
        direction: "down",
        frameX: 0,
      },
      a: {
        image: document.getElementById("playerLeft"),
        direction: "left",
        frameX: 0,
      },
      d: {
        image: document.getElementById("playerRight"),
        direction: "right",
        frameX: 1,
      },
    };

    this.changeDirection("s");

    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height * 0.5 - this.height * 0.5;

    this.timer = 0;
    this.fps = 10;
    this.timerInterval = 1000 / this.fps;
  }

  stopMove(lastKey) {
    this.isMoving = false;
    this.frameX = this.infoDirections[lastKey].frameX;
  }

  // move(key) {
  //   if (this.infoDirections[key].direction === this.currentDirection) {
  //     if (this.timer % 2 === 0) {
  //       ++this.frameX;
  //       if (this.frameX >= this.maxFameX) this.frameX = 0;
  //     }
  //     return;
  //   }

  //   this.changeDirection(key);
  // }

  changeDirection(key) {
    if (this.infoDirections[key].direction === this.currentDirection) return;
    this.currentDirection = this.infoDirections[key].direction;
    this.image = this.infoDirections[key].image;
    this.width = this.image.width / this.maxFameX;
    this.height = this.image.height / this.maxFameY;
    this.frameX = this.infoDirections[key].frameX;
  }

  update(deltaTime) {
    this.timer += deltaTime;
    if (this.timer > this.timerInterval) {
      this.timer = 0;
      if (this.isMoving) {
        ++this.frameX;
        if (this.frameX >= this.maxFameX) this.frameX = 0;
      }
    }
  }

  draw(c) {
    this.game.debug && c.strokeRect(this.x, this.y, this.width, this.height);

    c.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
