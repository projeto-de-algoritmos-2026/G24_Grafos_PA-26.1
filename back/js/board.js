function draw() {
  const canvas = document.getElementById("toy-canvas");
  const ctx = canvas.getContext("2d");

  const cellSize = 67;

  //lembrando que nosso tabuleiro é 0 a 8, (0,0) é o 1° q.

  //locais de muro (x,y):
  //  2,0 (topo)
  //  4,8 (topo)
  //  6,8 (topo)
  //  5,0 (topo)

  //  0,2 (esq.)
  //  8,2 (esq.)
  //  8,5 (esq.)
  //  0,5 (esq.)

  //  7,3 (baixo + esq)
  //  6,6 (baixo + dir)

  //  3,2 (topo + esq)
  //  2,7 (topo + dir)

  //  4,4 (CENTRO)

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const x = col * cellSize; //local X na grid
      const y = row * cellSize; //local Y na grid

      //CENTRO (4,4)
      if (row == 4 && col == 4) {
        ctx.fillStyle = "#393939";
        ctx.fillRect(x,y,cellSize,cellSize);
      }

      if (row == 2 && col == 0) {
        //  PAREDE TOPO (2,0)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
        
        ctx.restore();
      }

      if (row == 4 && col == 8) {
        //  PAREDE TOPO (4,8)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
        
        ctx.restore();
      }

      if (row == 6 && col == 8) {
        //  PAREDE TOPO (6,8)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
        
        ctx.restore();
      }

      if (row == 5 && col == 0) {
        //  PAREDE TOPO (5,0)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
        
        ctx.restore();
      }

      if (row == 0 && col == 2) {
        //  PAREDE ESQUERDA (0,2)
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
      
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
  
        ctx.restore();
      }

      if (row == 8 && col == 2) {
        //  PAREDE ESQUERDA (8,2)
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
      
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
  
        ctx.restore();
      }

      if (row == 8 && col == 5) {
        //  PAREDE ESQUERDA (8,5)
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
      
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
  
        ctx.restore();
      }

      if (row == 0 && col == 5) {
        //  PAREDE ESQUERDA (0,5)
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
      
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
  
        ctx.restore();
      }

      if (row == 7 && col == 3) {
        //  PAREDE BAIXO (7,3)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x + cellSize, y + cellSize);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
        
        ctx.restore();

        //  PAREDE ESQUERDA
        ctx.save();
      
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      
        ctx.restore();
      }

      if (row == 6 && col == 6) {
        //  PAREDE BAIXO (6,6)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x + cellSize, y + cellSize);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
        
        ctx.restore();

        //  PAREDE ESQUERDA
        ctx.save();
      
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      
        ctx.restore();
      }

      if (row == 3 && col == 2) {
        //  PAREDE TOPO (3,2)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
        
        ctx.restore();

        //  PAREDE ESQUERDA
        ctx.save();
      
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      
        ctx.restore();
      }

      if (row == 2 && col == 7) {
        //  PAREDE TOPO (2,7)
        ctx.save();
        
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
        
        ctx.restore();

        //  PAREDE ESQUERDA
        ctx.save();
      
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000000";
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      
        ctx.restore();
      }
  
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(x,y,cellSize,cellSize
      );
    }
  }
}

draw();