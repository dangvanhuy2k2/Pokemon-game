import Background from "./js/background.js";
import { InputHandler } from "./js/input.js";
import Player from "./js/player.js";
import collisions from "./data/collisions.js";
import battleZones from "./data/battleZones.js";
import Boundary from "./js/boundary.js";
import Battle from "./js/battle.js";
import { checkCollisonTwoRect } from "./js/utils.js";
import { SoundController } from "./js/sound.js";

window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas");
  const c = canvas.getContext("2d");

  canvas.width = 1024;
  canvas.height = 576;
  let lastTime = 0;

  let battle;

  class Game {
    constructor(gameWidth, gameHeight) {
      this.width = gameWidth;
      this.height = gameHeight;
      this.lastTime = 0;

      this.offsetMap = {
        x: -735,
        y: -650,
      };

      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.background = new Background(
        this.offsetMap.x,
        this.offsetMap.y,
        "map",
        "foregroundObjects"
      );

      this.sound = new SoundController();

      this.isStopAnimate = false;

      this.debug = false;

      this.collisionsMap = this.#createMap2d(collisions);
      this.battleZonesMap = this.#createMap2d(battleZones);

      this.boundaries = this.#createBoundaries(this.collisionsMap);
      this.battleZones = this.#createBoundaries(this.battleZonesMap);

      this.animateId = undefined;

      this.moveable = [
        this.background,
        ...this.boundaries,
        ...this.battleZones,
      ];

      this.#initGame();
    }

    #initGame() {
      this.sound.playSound("mapSound");
    }

    #createBoundaries(array) {
      const newBoundaries = [];
      array.forEach((row, y) => {
        row.forEach((symbol, x) => {
          if (symbol === 1025)
            newBoundaries.push(
              new Boundary(
                this,
                x * Boundary.width + this.offsetMap.x,
                y * Boundary.height + this.offsetMap.y
              )
            );
        });
      });

      return newBoundaries;
    }

    #createMap2d(array) {
      const newArray2d = [];
      for (let i = 0; i < array.length; i += 70)
        newArray2d.push(array.slice(i, 70 + i));

      return newArray2d;
    }

    #move() {
      if (this.input.keys["s"].pressed && this.input.lastKey === "s") {
        for (let i = 0; i < this.boundaries.length; ++i) {
          if (
            checkCollisonTwoRect(this.player, {
              ...this.boundaries[i],
              y: this.boundaries[i].y - 3,
            })
          )
            return;
        }
        this.moveable.forEach((el) => (el.y -= 3));
      } else if (this.input.keys["w"].pressed && this.input.lastKey === "w") {
        for (let i = 0; i < this.boundaries.length; ++i) {
          if (
            checkCollisonTwoRect(this.player, {
              ...this.boundaries[i],
              y: this.boundaries[i].y + 3,
            })
          )
            return;
        }
        this.moveable.forEach((el) => (el.y += 3));
      } else if (this.input.keys["a"].pressed && this.input.lastKey === "a") {
        for (let i = 0; i < this.boundaries.length; ++i) {
          if (
            checkCollisonTwoRect(this.player, {
              ...this.boundaries[i],
              x: this.boundaries[i].x + 3,
            })
          )
            return;
        }
        this.moveable.forEach((el) => (el.x += 3));
      } else if (this.input.keys["d"].pressed && this.input.lastKey === "d") {
        for (let i = 0; i < this.boundaries.length; ++i) {
          if (
            checkCollisonTwoRect(this.player, {
              ...this.boundaries[i],
              x: this.boundaries[i].x - 3,
            })
          )
            return;
        }
        this.moveable.forEach((el) => (el.x -= 3));
      }
    }

    #calAreaCollionTwoRect(rect1, rect2) {
      const widthAreaCollions =
        Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
        Math.max(rect1.x, rect2.x);

      const heightAreaCollions =
        Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
        Math.max(rect1.y, rect2.y);

      return heightAreaCollions * widthAreaCollions;
    }

    #handleBattleZones() {
      this.battleZones.forEach((boundary) => {
        boundary.update();
      });

      if (this.player.isMoving) {
        for (let i = 0; i < this.battleZones.length; ++i) {
          const overlapping = this.#calAreaCollionTwoRect(
            this.player,
            this.battleZones[i]
          );

          if (
            checkCollisonTwoRect(this.player, this.battleZones[i]) &&
            overlapping > (this.player.width * this.player.height) / 2 &&
            Math.random() < 0.07
          ) {
            this.isStopAnimate = true;
            break;
          }
        }
      }
    }

    update(deltaTime) {
      if (this.isStopAnimate) return;

      this.background.update();
      this.boundaries.forEach((boundary) => boundary.update());

      this.#handleBattleZones();

      this.#move();
      this.player.update(deltaTime);
    }

    draw(c) {
      this.background.draw(c, 1);
      this.boundaries.forEach((boundary) => boundary.draw(c));
      this.battleZones.forEach((boundary) => boundary.draw(c));
      this.player.draw(c);
      this.background.draw(c, 2);
    }

    animate(timeStamp = 0) {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      this.draw(c);
      this.update(deltaTime);
      if (this.isStopAnimate) {
        this.sound.pauseSound("mapSound");
        const gameAniamte = () => {
          this.animate();
          this.isStopAnimate = false;
          this.sound.playSound("mapSound");
        };
        battle = new Battle(c, gameAniamte.bind(this));
        battle.active();
        this.animateId && cancelAnimationFrame(this.animateId);
        return;
      }
      requestAnimationFrame(this.animate.bind(this));
    }
  }
  const game = new Game(canvas.width, canvas.height);

  game.animate(0);
});
