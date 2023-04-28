window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class InputHandler {
    // All the inputs arrowkeys and all
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === "q" || e.key === "Q") {
          this.game.player.shootTop(e.key);
        }
        // console.log(this.game.keys);
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
        // console.log(this.game.keys);
      });
    }
  }

  class Projectile {
    // lasers and all
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markedForDeletion = false;
    }

    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  class Particle {
    //  deal w cocks and bolts from enemies
  }
  class Player {
    // COntrol the MC and animation
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 1;
      this.frameX=0;
      this.frameY =0;
      this.maxFrame=37;
      this.image = document.getElementById('player')
      this.maxSpeed = 5;
      this.projectiles = [];

    }
    update() {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown"))
        this.speedY = +this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );

      if(this.frameX < this.maxFrame) this.frameX++;
      else{this.frameX = 0;}
    }
    draw(context) {
      context.fillStyle = "red";
      context.drawImage(this.image, this.frameX*this.width,this.frameY*this.height,this.width, this.height,this.x, this.y, this.width, this.height);
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }

    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--;
      }
      // console.log(this.projectiles);
    }
  }

  class Enemy {
    // BLueprint for the enemies
    constructor() {
      this.game = game;
      this.x = this.game.width;
      this.speeDx = Math.random() * 0.9 - 0.8;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
    }

    update() {
      this.x += this.speeDx;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context) {
      context.fillStyle = "black";
      context.font = "20px Helvetica";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillText(this.lives, this.x, this.y);
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.height = 169 * 0.2;
      this.width = 228 * 0.2;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
  }
  class Layer {
    //  indiviual BG layers7
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width =1768;
      this.height =500;
      this.x = 0;
      this.y = 0;
    }
    update(){
      if(this.x<=-this.width)this.x=0;
      this.x -= this.game.speed *this.speedModifier;

    }
    draw(context){
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x+this.width, this.y);
    }
  }

  class Background {
    // all layer objects together and all the animations
    constructor(game){
      this.game=game;
      this.image1=document.getElementById("layer1");
      this.image2=document.getElementById("layer2");
      this.image3=document.getElementById("layer3");
      this.image4=document.getElementById("layer4");
      this.layer1= new Layer(this.game, this.image1, 3);
      this.layer2= new Layer(this.game, this.image2, 3);
      this.layer3= new Layer(this.game, this.image3, 3);
      this.layer4= new Layer(this.game, this.image4, 3);
      this.layers=[this.layer1, this.layer2, this.layer3, this.layer4];

    }
    update(){
      this.layers.forEach(layer => layer.update());
    }

    draw(context){
      this.layers.forEach(layer => layer.draw(context));
    }


  }

  class Ui {
    //  Score timer and all
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvitica";
      this.color = "yellow";
    }

    draw(context) {
      //   score
      context.fillStyle = this.color;
      context.fillText("Score : " + this.game.score, 20, 40);
      context.fontSize = this.fontSize + "px" ;
      context.fontFamily=this.fontFamily;
      // ammo

      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 6 * i, 50, 3, 20);

        if(this.game.gameOver){
            clearInterval(this.game.enemyGeneration);
            clearInterval(this.game.ammoregen); 
            context.textAlign='center';
            let message1;
            let message2;
            if (this.game.score > this.game.winningScore){message1 = "You win1"; message2 = "Well Done!";}
            else{message1 = "You lost"; message2 = "Try again later"}
            context.color = 'black';
            context.fontSize= "50px";
            context.fontFamily = this.fontFamily;
            context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5);
            context.fontSize ="20px" ;
            context.fontFamily= this.fontFamily;
            context.fillText(message2, this.game.width * 0.5,this.game.height * 0.5+40);
        }
      }
    }
  }

  class Game {
    // Brain of the game all of it together
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.keys = [];
      this.gameOver = false;
      this.ammo = 20;
      this.ammoregen = setInterval(()=>this.ammo+=5,5000);
      this.ui = new Ui(this);
      this.enemies = [];
      this.enemyGeneration = setInterval(()=> this.addEnemy(), 2000);

      
      this.score = 0;
      this.winningScore = 10;
      this.speed=1;
    }
    update() {
      this.player.update();
      this.background.update();
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
          enemy.markedForDeletion = true;
        }
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0) {
              enemy.markedForDeletion = true;
              this.score += enemy.score;
              if (this.score > this.winningScore) this.gameOver = true;
            }
          }
        });
      });

      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

      // console.log(this.enemies);
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => enemy.draw(context));
    }

    addEnemy() {
      this.enemies.push(new Angler1(this));
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
  }

  const game = new Game(canvas.height, canvas.width);
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
