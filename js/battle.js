import Background from "./background.js";
import { InputHandlerBattle } from "./input.js";
import { Draggle, Emby } from "./pokemon.js";
import { SoundController } from "./sound.js";

let lastTime = 0;

export default class Battle {
  constructor(ctx, callback) {
    this.gameAnimate = callback;
    this.isActive = true;
    this.background = new Background(0, 0, "battleBackground");
    this.c = ctx;

    this.sound = new SoundController();

    this.enemy = null;
    this.pet = null;

    this.skills = [];

    this.queues = [];

    this.input = new InputHandlerBattle(this);

    this.animateId;
  }

  #initBattle() {
    document.getElementById("enemyHealthBar").style.width = "100%";
    document.getElementById("playerHealthBar").style.width = "100%";
    document.getElementById("attacksBox").replaceChildren();

    const dialog = document.getElementById("dialogueBox");
    dialog.style.display = "none";
    dialog.innerHTML = ``;
    document.getElementById("userInterface").style.display = "block";

    this.enemy = new Draggle(this, 800, 100, "draggle", "draggle", "enemy");
    this.#initAttackBox();
    this.pet = new Emby(this, 280, 352, "emby", "emby", "pet");

    this.input.initEvents();
  }

  // reset() {
  //   this.enemy = new Draggle(this, 800, 100, "draggle", "draggle", "enemy");
  //   this.#initAttackBox();
  //   this.pet = new Emby(this, 280, 352, "emby", "emby", "pet");
  //   this.queues = [];
  // }

  #initAttackBox() {
    this.enemy.attacks.forEach((attack) => {
      const btn = document.createElement("button");
      btn.innerHTML = attack.name;
      document.getElementById("attacksBox").appendChild(btn);
    });
  }

  animateEnd() {
    if (this.enemy.health <= 0) {
      this.sound.pauseSound("battleSound");
      this.sound.playSound("victorySound");
    }
    gsap.to("#overlappingDiv", {
      opacity: 1,
      onComplete: () => {
        this.isActive = false;
      },
    });
  }

  active() {
    this.sound.playSound("initBattleSound");
    this.isActive = true;
    gsap.to("#overlappingDiv", {
      opacity: 1,
      repeat: 3,
      yoyo: true,
      duration: 0.4,
      onComplete: () => {
        gsap.to("#overlappingDiv", {
          opacity: 1,
          duration: 0.4,
          onComplete: () => {
            this.sound.pauseSound("initBattleSound");
            this.sound.playSound("battleSound");
            this.#initBattle();
            this.animate();
            gsap.to("#overlappingDiv", {
              opacity: 0,
              duration: 0.4,
            });
          },
        });
      },
    });
  }

  animate(timeStamp = 0) {
    if (!this.isActive) {
      document.getElementById("userInterface").style.display = "none";
      this.gameAnimate();
      this.sound.pauseSound("victorySound");
      gsap.to("#overlappingDiv", {
        opacity: 0,
      });
      this.animateId && cancelAnimationFrame(this.animateId);
      return;
    }
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    this.draw();
    this.update(deltaTime);
    this.animateId = requestAnimationFrame(this.animate.bind(this));
  }

  update(deltaTime) {
    this.background.update();
    this.pet.update(deltaTime);
    this.skills.forEach((skill) => skill.update(deltaTime));
    this.skills = this.skills.filter((skill) => !skill.markForDeletion);
    this.enemy.update(deltaTime);
  }

  draw() {
    this.background.draw(this.c, 1);
    this.pet.draw(this.c);
    this.skills.forEach((skill) => skill.draw(this.c));
    this.enemy.draw(this.c);
  }
}
