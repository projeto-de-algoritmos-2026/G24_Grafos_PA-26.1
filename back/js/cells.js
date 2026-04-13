import { 
    setWallBottom, 
    setWallLeft, 
    setWallRight, 
    setWallTop, 
    setCenter
} from "./cat.js";


// paredes externas
for (let col = 0; col < 16; col++) {
    setWallTop(0, col);
    setWallBottom(15, col);
}

for (let row = 0; row < 16; row++) {
    setWallLeft(row, 0);
    setWallRight(row, 15);
}


setWallTop(4,0); setWallBottom(3,0);
setWallTop(11,0); setWallBottom(10,0);
setWallTop(6,1); setWallBottom(5,1);
setWallTop(9,1); setWallBottom(8,1);
setWallTop(15,2); setWallBottom(14,2);
setWallTop(5,3); setWallBottom(4,3);
setWallTop(2,5); setWallBottom(1,5);
setWallTop(9,5); setWallBottom(8,5);
setWallTop(5,6); setWallBottom(4,6);
setWallTop(13,6); setWallBottom(12,6);
setWallTop(7,7); setWallBottom(6,7);
setWallTop(7,8); setWallBottom(6,8);
setWallTop(9,7); setWallBottom(8,7);
setWallTop(9,8); setWallBottom(8,8);
setWallTop(11,8); setWallBottom(10,8);
setWallTop(5,9); setWallBottom(4,9);
setWallTop(14,9); setWallBottom(13,9);
setWallTop(1,11); setWallBottom(0,11);
setWallTop(7,12); setWallBottom(6,12);
setWallTop(11,13); setWallBottom(10,13);
setWallTop(3,14); setWallBottom(2,14);
setWallTop(14,14); setWallBottom(13,14);
setWallTop(2,15); setWallBottom(1,15);
setWallTop(10,15); setWallBottom(9,15);

setCenter(7,7);
setCenter(8,7);
setCenter(7,8);
setCenter(8,8);

setWallRight(6,1); setWallLeft(6,2);
setWallRight(9,1); setWallLeft(9,2);
setWallRight(14,1); setWallLeft(14,2);
setWallRight(0,2); setWallLeft(0,3);
setWallRight(4,3); setWallLeft(4,4);
setWallRight(1,4); setWallLeft(1,5);
setWallRight(9,4); setWallLeft(9,5);
setWallRight(5,5); setWallLeft(5,6);
setWallRight(15,5); setWallLeft(15,6);
setWallRight(7,6); setWallLeft(7,7);
setWallRight(8,6); setWallLeft(8,7);
setWallRight(12,6); setWallLeft(12,7);
setWallRight(0,8); setWallLeft(0,9);
setWallRight(7,8); setWallLeft(7,9);
setWallRight(8,8); setWallLeft(8,9);
setWallRight(10,8); setWallLeft(10,9);
setWallRight(13,8); setWallLeft(13,9);
setWallRight(4,9); setWallLeft(4,10);
setWallRight(1,10); setWallLeft(1,11);
setWallRight(6,11); setWallLeft(6,12);
setWallRight(15,11); setWallLeft(15,12);
setWallRight(11,12); setWallLeft(11,13);
setWallRight(3,14); setWallLeft(3,15);
setWallRight(14,14); setWallLeft(14,15);
