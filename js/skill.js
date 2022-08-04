export default class Skill {
  constructor(x, y, imageId) {
    this.image = document.getElementById(imageId);

    this.x = x;
    this.y = y;

    this.maxFameX = 4;
    this.maxFameY = 1;
    this.width = this.image.width / this.maxFameX;
    this.height = this.image.height / this.maxFameY;
    this.frameX = 0;
    this.frameY = 0;

    this.health = 100;
    this.opacity = 1;

    this.timer = 0;
    this.fps = 10;
    this.timerInterval = 1000 / this.fps;

    this.markForDeletion = false;

    this.angle = 0;
    this.va = Math.random() * 0.01 + 0.02;
  }

  update(deltaTime) {
    this.angle += this.va;

    this.timer += deltaTime;
    if (this.timer > this.timerInterval) {
      this.timer = 0;
      ++this.frameX;
      if (this.frameX >= this.maxFameX) this.frameX = 0;
    }
  }

  draw(c) {
    c.save();
    c.translate(this.x + this.width * 0.5, this.y + this.height * 0.5);
    c.rotate(this.type === "pet" ? this.angle : this.angle * -1);
    // c.strokeRect(0, 0, this.width, this.height);

    c.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );

    c.restore();
  }
}
