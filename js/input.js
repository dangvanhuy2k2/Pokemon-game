import attacks from "./attacks.js";

export class InputHandler {
  constructor(game) {
    this.game = game;
    this.lastKey = "";
    this.keys = {
      w: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
    };

    this.keyBoards = ["w", "s", "a", "d"];

    window.addEventListener("keydown", ({ key }) => {
      if (this.keyBoards.includes(key)) {
        this.keys[key].pressed = true;
        this.lastKey = key;
        // this.game.player.move(key);
        this.game.player.changeDirection(key);
        this.game.player.isMoving = true;
      }
    });

    window.addEventListener("keyup", ({ key }) => {
      if (this.keyBoards.includes(key)) {
        this.keys[key].pressed = false;
        this.game.player.stopMove(this.lastKey);
      }
    });
  }
}

export class InputHandlerBattle {
  constructor(battle) {
    this.battle = battle;

    document.getElementById("dialogueBox").addEventListener("click", (e) => {
      console.log("click");
      if (this.battle.queues.length > 0) {
        const enemyAttack = this.battle.queues.shift();
        enemyAttack();
      } else e.target.style.display = "none";
    });
  }

  initEvents() {
    document.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const selectedAttack = attacks[e.target.innerHTML];
        this.battle.pet.attack({
          attack: selectedAttack,
          recipient: this.battle.enemy,
        });

        this.battle.queues.push(() => {
          const randomSkill =
            this.battle.enemy.attacks[
              Math.floor(Math.random() * this.battle.enemy.attacks.length)
            ];
          this.battle.enemy.attack({
            attack: randomSkill,
            recipient: this.battle.pet,
          });
        });
      });

      button.addEventListener("mouseenter", (e) => {
        const elAttackType = document.getElementById("attackType");
        elAttackType.style.color = attacks[e.target.innerHTML].color;
        elAttackType.innerHTML = attacks[e.target.innerHTML].type;
      });

      button.addEventListener("mouseout", (e) => {
        const elAttackType = document.getElementById("attackType");
        elAttackType.style.color = "black";
        elAttackType.innerHTML = "Attack Type";
      });
    });
  }
}
