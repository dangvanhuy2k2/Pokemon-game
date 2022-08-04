export default class Background {
  constructor(x, y, ...layerIds) {
    this.layerIds = layerIds;
    // this.layer1 = document.getElementById("map");
    // this.layer2 = document.getElementById("foregroundObjects");

    // this.layers = [this.layer1, this.layer2];
    this.layers = [];

    this.x = x;
    this.y = y;

    this.#createLayers();
  }

  #createLayers() {
    this.layers = this.layerIds.map((layerId, idx) => {
      this[`layer${idx + 1}`] = document.getElementById(layerId);
      return this["layer" + idx + 1];
    });
  }

  update() {}

  draw(c, layerNumber) {
    c.drawImage(this["layer" + layerNumber], this.x, this.y);
    // this.layers.forEach((layer) => c.drawImage(layer, this.x, this.y));
  }
}
