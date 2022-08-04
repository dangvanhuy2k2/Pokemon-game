export class SoundController {
  constructor() {
    this.mapSound = document.getElementById("mapSound");
    this.initBattleSound = document.getElementById("initBattle");
    this.fireballHitSound = document.getElementById("fireballHit");
    this.initFireballSound = document.getElementById("initFireball");
    this.tackleHitSound = document.getElementById("tackleHit");
    this.victorySound = document.getElementById("victory");
    this.battleSound = document.getElementById("battleSound");
  }

  playSound(type) {
    this[type].currentTime = 0;
    this[type].muted = false;
    this[type].play();
  }

  pauseSound(type) {
    this[type].muted = true;
    this[type].currentTime = 0;
    this[type].pause();
  }
}
