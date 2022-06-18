function drawGame(ctx, canvas, tileSize, snakeParts, applePosition) {
  clearScreen(ctx, canvas);
  drawApple(ctx, tileSize, applePosition);
  drawSnake(ctx, tileSize, snakeParts);
  drawGrid(ctx, canvas, tileSize);
}

function clearScreen(ctx, canvas) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}  

function drawSnake(ctx, tileSize, snakeParts) {
  const diff = 1
  ctx.fillStyle = 'rgb(103, 188, 17)';
  for (let i = 0; i < snakeParts.length-1; i++) {
    ctx.fillRect((snakeParts[i][0]-diff) * tileSize, (snakeParts[i][1]-diff) * tileSize, tileSize, tileSize);
  }
  ctx.fillStyle = "rgb(236, 229, 20)";
  ctx.fillRect((snakeParts[snakeParts.length-1][0]-diff) * tileSize, (snakeParts[snakeParts.length-1][1]-diff) * tileSize, tileSize, tileSize);
}

function drawApple(ctx, tileSize, applePosition) {
  const diff = 1
  ctx.fillStyle = "rgb(211, 32, 175)";
  ctx.fillRect((applePosition[0]-diff) * tileSize, (applePosition[1]-diff) * tileSize, tileSize, tileSize);
}

function drawClock(ctx, canvas, tileSize, snakeParts, applePositions) {
  clearScreen(ctx, canvas);
  const diff = 1
  ctx.fillStyle = 'rgb(103, 188, 17)';
  for (let i = 0; i < snakeParts.length; i++) {
    ctx.fillRect((snakeParts[i][0]-diff) * tileSize, (snakeParts[i][1]-diff) * tileSize, tileSize, tileSize);
  }
  ctx.fillStyle = "rgb(211, 32, 175)";
  for (let i = 0; i < applePositions.length; i++) {
    ctx.fillRect((applePositions[i][0]-diff) * tileSize, (applePositions[i][1]-diff) * tileSize, tileSize, tileSize);
  }
}

function drawGrid(ctx, canvas, tileSize){
    var bw = canvas.width;
    var bh = canvas.height;
    var p = 0.5;

    for (var x = 0; x <= bw; x += tileSize) {
        ctx.moveTo(x + p, p);
        ctx.lineTo(x + p, bh + p);
    }

    for (var y = 0; y <= bh; y += tileSize) {
        ctx.moveTo(p, y + p);
        ctx.lineTo(bw + p, y + p);
    }

    ctx.strokeStyle = "rgba(209, 209, 209)";
    ctx.stroke();
}

function run(ctx, canvas, snakeParts, applePosition){
  let tileCount = 20; // number of rows and columns
  let tileSize = canvas.width / tileCount; // size of block

  drawGame(ctx, canvas, tileSize, snakeParts, applePosition);
}

function switch_games_displays() {
  const cb = document.querySelector("#cbLearnPlay");
  let canvas_ = 0;
  let ctx_ = 0;
  let snakeParts_ = 0;
  let applePosition_ = 0;

  if (cb.checked)
  {
    // Game mode
    canvas_ = document.getElementById("game_window_intro2");
    ctx_ = canvas_.getContext("2d");
    snakeParts_ = [[11,9],[12,9],[12,10],[12,11],[12,12],[11,9],[11,12],[10,12],[9,12],[9,11],[9,10],[9,9],[9,8],[9,7],[10,7],[11,7],[12,7],[13,7],[14,7],[14,8],[14,9],[14,10],[14,11],[14,12],[14,13],[14,14],[13,14],[12,14],[11,14],[10,14],[9,14],[8,14],[7,14],[7,13],[7,12],[7,11],[7,10],[7,9],[7,8],[7,7]]; 
    applePosition_ = [5,5];
  }
  else 
  {
    // Train mode
    canvas_ = document.getElementById("game_window");
    ctx_ = canvas_.getContext("2d");
    snakeParts_ = [[10,17],[10,16],[10,15],[9,15],[8,15],[8,14],[8,13],[9,13],[10,13],[11,13],[12,13],[12,12],[12,11],[11,11],[10,11],[9,11],[8,11],[8,10],[8,9],[9,9],[10,9],[11,9],[12,9],[12,8],[12,7],[11,7],[10,7],[10,6],[10,5]]; 
    applePosition_ = [10,3];
  };
  run(ctx_, canvas_, snakeParts_, applePosition_);
};


function loadingScreen(){
  const cb = document.querySelector("#cbLearnPlay");
  if (cb.checked)
  {
    // Game mode
    canvas_ = document.getElementById("game_window_intro2");
  }
  else 
  {
    // Train mode
    canvas_ = document.getElementById("game_window");
  };
  ctx_ = canvas_.getContext("2d");
  snakeParts_ = [[6,15],[7,15],[8,15],[9,15],[10,15],[11,15],[12,15],[13,15],[14,15],[15,15],[14,14],[13,13],[12,12],[11,11],[10,10],[9,9],[8,8],[7,7],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[15,6],[14,7],[13,8],[12,9],[11,10],[10,11],[9,12],[8,13],[7,14]]; 
  applePositions_ = [[8,14],[9,14],[10,14],[11,14],[12,14],[13,14],[10,13],[11,13]];
  drawClock(ctx_, canvas_, 22, snakeParts_, applePositions_) 
}