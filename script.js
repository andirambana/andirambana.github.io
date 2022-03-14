const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

let MOVE_INTERVAL = 100;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    level: 1,
    speed: 100,
    nyawa: 1,
  };
}
let snake1 = initSnake("blue");

let apple = {
  position: initPosition(),
};

let apple2 = {
  position: initPosition(),
};

let life = {
  position: initPosition(),
};

function drawLife(ctx, x, y, color) {
  ctx.fillStyle = color;
  let img = document.getElementById("heart");
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake(ctx, x, y) {
  let img = document.getElementById("snake-head");
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnakeBody(ctx, x, y) {
  let img = document.getElementById("snake-body");
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawApple(ctx, x, y) {
  let img = document.getElementById("Apple");
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 40, scoreCanvas.scrollHeight / 1.7);
}

function drawcountspeed(snake) {
  let scoreCanvasspeed;
  if (snake.color == snake1.color) {
    scoreCanvasspeed = document.getElementById("speed");
  }
  let scoreCtx2 = scoreCanvasspeed.getContext("2d");

  scoreCtx2.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx2.font = "30px Arial";
  scoreCtx2.fillStyle = snake.color;
  scoreCtx2.fillText(snake.speed, 25, scoreCanvasspeed.scrollHeight / 1.7);
}

function drawLevel(snake) {
  let levelSnake;
  if (snake.color == snake1.color) {
    levelSnake = document.getElementById("level");
  }
  let scoreLevel = levelSnake.getContext("2d");

  scoreLevel.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreLevel.font = "30px Arial";
  scoreLevel.fillStyle = snake.color; 
  scoreLevel.fillText(snake.level, 40, levelSnake.scrollHeight / 1.7);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    var heart = document.getElementById("Life");
        for (let i = 0; i < snake1.nyawa; i++) {
            ctx.drawImage(heart, i * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
    }
    drawSnake(ctx, snake1.head.x, snake1.head.y, snake1.color);
    for (let i = 1; i < snake1.body.length; i++) {
      drawSnakeBody(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }
    drawApple(ctx, apple.position.x, apple.position.y);
    drawApple(ctx, apple2.position.x, apple2.position.y);
    drawScore(snake1);
    drawLevel(snake1);
    drawcountspeed(snake1);
    if (snake1.score == 2 || (snake1.score % 2 == 1 && snake1.score != 1)) {
      drawLife(ctx, life.position.x, life.position.y, life.color);
      drawLife(snake1);
      life.position = initPosition;
    }
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eatLife(snake, apple3) {}

function eat(snake, apple) {
  var audio = new Audio("assets/eat.mp3");
  if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
    apple.position = initPosition();
    snake.score++;
    audio.play();
    if (snake.score % 5 == 0) {
      var audio = new Audio ('assets/level-up.mpeg');
      audio.play();
      snake.level++;
      snake.speed -= 20;
      alert("Selamat! Kamu naik ke level " + snake.level);
    }
    snake.body.push({ x: snake.head.x, y: snake.head.y });
  }
  if (snake.head.x == life.position.x && snake.head.y == life.position.y) {
    snake.score++;
    snake.nyawa++;
    life.position = initPosition();
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apple);
  eat(snake, apple2);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apple);
  eat(snake, apple2);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apple);
  eat(snake, apple2);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apple);
  eat(snake, apple2);
}

function checkCollision(snakes) {
  let isCollide = false;
  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (
          snakes[i].head.x == snakes[j].body[k].x &&
          snakes[i].head.y == snakes[j].body[k].y
        ) {
          if (snake1.nyawa > 0) {
            snake1.nyawa--;
            var audio = new Audio ('assets/crack.mpeg');
            audio.play();
            snake1.position = initPosition();
            isCollide = false;
          } else {
            isCollide = true;
          }
        }
      }
    }
  }
  if (isCollide) {
    var audio = new Audio ('assets/game-over.mp3');
    audio.play();
    alert("Game over");
    snake1 = initSnake("blue");
    MOVE_INTERVAL = 100;
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision([snake1])) {
    setTimeout(function () {
      move(snake);
    }, MOVE_INTERVAL);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "a") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "d") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "w") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "s") {
    turn(snake1, DIRECTION.DOWN);
  }
  if (event.key === "A") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "D") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "W") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "S") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}

initGame();
