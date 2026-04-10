export class Robot {
  constructor(row, col, color) {
    this.row = row;
    this.col = col;
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

const basetriaverde = new Bases(7,3,"green","triangulo");
const basetriavermelho = new Bases(6,6,"red","triangulo");
const basequadvermelho = new Bases(3,2,"red","quadrado");
const basequadverde = new Bases(2,7,"green","quadrado");



const robotinhovermelho = new Robot(0,0,"red");
const robotinhoVerde = new Robot(8,8,"green");

export {robotinhoVerde, robotinhovermelho};
export {basequadverde, basetriaverde, basequadvermelho, basetriavermelho}