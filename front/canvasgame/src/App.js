import logo from './logo.svg';
import './App.css';

function App() {
  var ctx = null;
  var tileW= 40, tileH = 40;
  var mapW = 10, mapH = 10;

  var currentSeconds = 0, frameCount = 0, frameLastSecond = 0;
  var lastFrameTime = 0;

  var keyDown = {
    37: false,
    38: false,
    39: false,
    40: false,
  }

  var player = new Character();

  var gameMap = [
    0,0,0,0,0,0,0,0,0,0,
    0,1,1,1,0,1,1,1,1,0,
    0,1,0,1,0,1,0,0,1,0,
    0,1,1,1,1,1,1,1,1,0,
    0,1,0,1,0,1,0,0,1,0,
    0,1,1,1,1,1,1,1,1,0,
    0,1,0,1,0,1,0,1,0,0,
    0,1,1,1,0,1,1,1,1,0,
    0,0,0,0,0,0,0,0,0,0,
  ];

  

  function Character() {
    this.tileFrom = [1,1];
    this.tileTo = [1,1];
    this.timeMoved = 0;
    this.dimentions = [30, 30];
    this.position = [45, 45];
    this.delayMove = 200;
  }

  Character.prototype.placeAt = function(x, y) {
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [
      ((tileW*x)+ ((tileW - this.dimentions[0]) / 2)),
      ((tileH* y) + (tileH- this.dimentions[1])/ 2)
    ]
  }

  Character.prototype.processMovement = function(t) {
    if(this.tileFrom[0] === this.tileTo[0] && this.tileFrom[1] === this.tileTo[1]) {
      return false;
    }

    if(t-this.timeMoved >= this.delayMove) {
      this.placeAt(this.tileTo[0], this.tileTo[1]);

    } else {
        this.position[0] = (this.tileFrom[0] * tileW) + 
        ((tileW - this.dimentions[0]) / 2)

        this.position[1] = (this.tileFrom[1] * tileH) +
        ((tileH - this.dimentions[1]) / 2)

        if(this.tileTo[0] !== this.tileFrom[0]) {
          var diff = (tileW / this.delayMove) * (t - this.timeMoved);
          this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff)
        }

        if(this.tileTo[1] !== this.tileFrom[1]) {
          var diff = (tileH / this.delayMove) * (t - this.timeMoved);
          this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff)
        }

        this.position[0] = Math.round(this.position[0])
        this.position[1] = Math.round(this.position[1])
    }

    return true;
  }

  function toIndex(x, y) {
    return ((y * mapW) + x)
  }

  window.onload = function() {
    ctx = document.getElementById('game').getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";

    window.addEventListener('keydown', function(e) {
      if(e.keyCode >= 37 && e.keyCode <= 40) {
        keyDown[e.keyCode] = true;
      }
    })
    window.addEventListener('keyup', function(e) {
      if(e.keyCode >= 37 && e.keyCode <= 40) {
        keyDown[e.keyCode] = false;
      }
    })
  }

  function drawGame() {
    if(ctx == null) {
      return;
    }

    var currentFrameTime = Date.now();
    var timeElapsed = currentFrameTime - lastFrameTime;

    let sec = Math.floor(Date.now() / 1000);
    if(sec !== currentSeconds) {
      currentSeconds = sec;
      frameLastSecond = frameCount;
      frameCount = 1;
    }
    else {
      frameCount++;
    }

    if(!player.processMovement(currentFrameTime)) {

      if(keyDown[38] && player.tileFrom[1] > 0 && 
        gameMap[toIndex(player.tileFrom[0], 
          player.tileFrom[1] -1 )] === 1) {

            player.tileTo[1] -= 1;
          }

      else if (
        keyDown[40] && player.tileFrom[1] < (mapH -1) &&
        gameMap[toIndex(player.tileFrom[0],
          player.tileFrom[1] +1)] === 1) {

            player.tileTo[1] += 1
          }
      
      if(keyDown[37] && player.tileFrom[0] > 0 &&
        gameMap[toIndex(player.tileFrom[0] - 1, 
          player.tileFrom[1])] === 1) {
            
            player.tileTo[0] -= 1;
          }
      
      else if (
        keyDown[39] && player.tileFrom[0] < (mapW -1 ) &&
        gameMap[toIndex(player.tileFrom[0] + 1,
          player.tileFrom[1])] === 1) {
            player.tileTo[0] += 1
          }

        if(player.tileFrom[0] !== player.tileTo[0] || player.tileFrom[1] !== player.tileTo[1]) {
          player.timeMoved = currentFrameTime;
        }
    }

    for(var y = 0; y < mapH; y++) {
      for(var x = 0; x < mapW; x++) {
        switch(gameMap[((y*mapW) + x)]) {
          case 0: 
            ctx.fillStyle = "#f22929";
            break;
          default:
            ctx.fillStyle = "#eeeeee";
        }

        ctx.fillRect(x*tileW, y * tileH, tileW, tileH);
      }
    }

    ctx.fillStyle = "#ffb600";
    ctx.fillRect(player.position[0], player.position[1], player.dimentions[0], player.dimentions[1]);

    ctx.fillStyle = "#ff0000";
    ctx.fillText("FPS: " + frameLastSecond, 10, 20);

    lastFrameTime = currentFrameTime;
    requestAnimationFrame(drawGame);
  }


  return (
    <div className="App">
    <canvas id='game' width='600' height='600'></canvas>
  </div>
  );
}

export default App;
