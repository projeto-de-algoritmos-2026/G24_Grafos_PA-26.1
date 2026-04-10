import { 
    setWallBottom, 
    setWallLeft, 
    setWallRight, 
    setWallTop, 
    setCenter
} from "./cat.js";

//NOSSAS BARREIRAS.

// topo
setWallTop(2, 0);
setWallTop(4, 8);
setWallTop(6, 8);
setWallTop(5, 0);

// esquerda
setWallLeft(0, 2);
setWallLeft(8, 2);
setWallLeft(8, 5);
setWallLeft(0, 5);

// baixo + esquerda
setWallBottom(7, 3);
setWallLeft(7, 3);

// baixo + direita
setWallBottom(6, 6);
setWallRight(6, 6);

// topo + esquerda
setWallTop(3, 2);
setWallLeft(3, 2);

// topo + direita
setWallTop(2, 7);
setWallRight(2, 7);

// centro
setCenter(4, 4);
setWallBottom(3, 4);  
setWallTop(5, 4);    
setWallRight(4, 3);  
setWallLeft(4, 5);    