export class Robot {
  constructor(row, col, color) {
    this.row = row;
    this.col = col;
    this.renderRow = row;
    this.renderCol = col;
    this.color = color;
    this.moves = 0;
  }
}
export class Bases {
    constructor(row,col,color,format) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.format = format;
    }
}

const basetriaverde = new Bases(3, 14, "green", "triangulo");
const basetriavermelho = new Bases(6, 1, "red", "triangulo");
const basetriamarelo = new Bases(13, 9, "yellow", "triangulo");
const basetriaazul = new Bases(1, 11, "blue", "triangulo");
const basequadvermelho = new Bases(6, 12, "red", "quadrado");
const basequadverde = new Bases(5, 6, "green", "quadrado");
const basequadamarelo = new Bases(1, 5, "yellow", "quadrado");
const basequadazul = new Bases(14, 2, "blue", "quadrado");



const robotinhovermelho = new Robot(0, 0, "red");
const robotinhoVerde = new Robot(0, 15, "green");
const robotinhoAmarelo = new Robot(15, 0, "yellow");
const robotinhoAzul = new Robot(15, 15, "blue");

export {
  robotinhoVerde,
  robotinhovermelho,
  robotinhoAzul,
  robotinhoAmarelo,
  basequadverde,
  basetriaverde,
  basequadvermelho,
  basetriavermelho,
  basetriamarelo,
  basetriaazul,
  basequadamarelo,
  basequadazul
};