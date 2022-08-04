import attacks from "./attacks.js";
import Skill from "./skill.js";

class Pokemon {
  constructor(battle, x, y, imageId, name, type) {
    this.battle = battle;

    this.image = document.getElementById(imageId);

    this.x = x;
    this.y = y;

    this.maxFameX = 4;
    this.maxFameY = 1;
    this.width = this.image.width / this.maxFameX;
    this.height = this.image.height / this.maxFameY;
    this.frameX = 0;
    this.frameY = 0;
    this.type = type;

    this.health = 100;
    this.opacity = 1;

    this.skill = [];

    this.name = name.charAt(0).toUpperCase() + name.slice(1);

    this.timer = 0;
    this.fps = 10;
    this.timerInterval = 1000 / this.fps;
  }

  update(deltaTime) {
    this.timer += deltaTime;
    if (this.timer > this.timerInterval) {
      this.timer = 0;
      ++this.frameX;
      if (this.frameX >= this.maxFameX) this.frameX = 0;
    }
  }

  checkFaint() {
    if (this.health <= 0) {
      const dialog = document.getElementById("dialogueBox");
      dialog.style.display = "block";
      dialog.innerHTML = `${this.name} faint`;
      this.battle.queues = [];

      gsap.to(this, {
        y: this.y + 20,
      });

      gsap.to(this, {
        opacity: 0,
        onComplete: () => {
          this.battle.animateEnd();
        },
      });
    }
  }

  attack({ attack, recipient }) {
    const dialog = document.getElementById("dialogueBox");
    dialog.style.display = "block";
    dialog.innerHTML = `${this.name} use ${attack.name}`;

    const tl = gsap.timeline();

    let movement = 20;
    if (this.type !== "pet") movement *= -1;

    let idHealth =
      recipient.type === "pet" ? "#playerHealthBar" : "#enemyHealthBar";

    switch (attack.name) {
      case "Fireball": {
        this.battle.sound.playSound("initFireballSound");
        const fireball = new Skill(this.x, this.y, "fireball");
        this.battle.skills.push(fireball);

        gsap.to(fireball, {
          x: recipient.x,
          y: recipient.y,
          duration: 1,
          onComplete: () => {
            fireball.markForDeletion = true;

            recipient.health -= attack.damage;
            this.battle.sound.playSound("fireballHitSound");

            gsap.to(idHealth, {
              width: recipient.health + "%",
            });

            gsap.to(recipient, {
              x: recipient.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });

            gsap.to(recipient, {
              opacity: 0,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });

            recipient.checkFaint();
          },
        });

        break;
      }
      case "Tanker": {
        tl.to(this, {
          x: this.x - movement,
        })
          .to(this, {
            x: this.x + movement * 2,
            duration: 0.1,

            onComplete: () => {
              this.battle.sound.playSound("tackleHitSound");
              recipient.health -= attack.damage;
              gsap.to(idHealth, {
                width: recipient.health + "%",
              });

              gsap.to(recipient, {
                x: recipient.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });

              gsap.to(recipient, {
                opacity: 0,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });

              recipient.checkFaint();
            },
          })
          .to(this, {
            x: this.x,
          });
        break;
      }
    }
  }

  draw(c) {
    c.save();
    c.globalAlpha = this.opacity;
    // c.strokeRect(this.x, this.y, this.width, this.height);

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
    c.restore();
  }
}

export class Emby extends Pokemon {
  constructor(battle, x, y, imageId, name, type = "pet") {
    super(battle, x, y, imageId, name, type);
    this.attacks = [attacks.Tanker, attacks.Fireball];
  }
}

export class Draggle extends Pokemon {
  constructor(battle, x, y, imageId, name, type = "pet") {
    super(battle, x, y, imageId, name, type);
    this.attacks = [attacks.Tanker, attacks.Fireball];
  }
}
