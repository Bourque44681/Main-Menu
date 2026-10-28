document.addEventListener("DOMContentLoaded", function () {
  //----------------------------------------
  // Public vairables that I want everywhere
  //----------------------------------------

  //General
  var GamePaused = false;
  var GameStarted = false;

  //Background
  const speed = .5;

  // Shooting
  let BullSpeed = 5;
  let reloadTime = 1.2;
  let reloding = false;
  const bullet = document.getElementById("shoot");

  //Asteroids
  let astroidSpeed = .2;
  let canSpawn = true;
  let astroidSpinScope = 1;
  const varients = [];
  varients.push("Images/Asteroid 1.png");
  varients.push("Images/Asteroid 2.png");
  varients.push("Images/Asteroids 3.png");
  varients.push("Images/Asteroid 4.png");

  const astroidPiecesTemplete = document.getElementById("templete");

  //Menu's
  let quitGame = document.getElementById("quit");
  const ResumePlayButton = document.getElementById("play-resume")
  const MainMenu = document.getElementById("MENU-div");

  //Player Movement
  const shipSpeed = 5;

  //collition checks
  let bullets = [];
  let astroids = [];
  var removeAstroids = [];
  var removeBullets = [];
  

  //----------------------------------------
  // Public vairables that I want everywhere
  //----------------------------------------


  //-----------------
  // BACKGROUND MOVING
  //-----------------

  const screen = document.getElementById("screenShakeContainer");
  let Background = document.getElementById("Background");

  const PlayerShip = document.getElementById("Rocketship");
    
  let currentY = 0; // Track the position manually

  // 1. Setup the two backgrounds (no need to constantly clone inside the loop)
  const Background2 = Background.cloneNode(true);
  screen.appendChild(Background2);

  // 2. Position them absolutely
  Background.style.position = 'absolute';
  Background.style.top = '-1vw';
  Background.style.left = '-2vw';

  Background2.style.position = 'absolute';
  Background2.style.top = '-1vw'; 
  Background2.style.left = '-2vw';

  let bgHeight = Background.offsetHeight;

  function MoveBackground() {
    if (!GamePaused){
      bgHeight = Background.offsetHeight;
      currentY += speed;
      // If the first background has fully moved off-screen downward, reset the loop
      if (currentY >= bgHeight) {
        currentY = 0;
      }

      Background.style.transform = `translateY(${currentY}px)`;
      Background2.style.transform = `translateY(${currentY - bgHeight + 1}px)`;
    };

    requestAnimationFrame(MoveBackground);
  }
  if (Background) {
    requestAnimationFrame(MoveBackground);
  }

  //---------------------
  //---------------------
  // FUNCTIONS-----------
  //---------------------
  //---------------------

  //bet u can't guess what this one does
  function Reset(){
    ResumePlayButton.textContent = "Play";
    PlayerShip.style.visibility = "hidden";
  }


  //-----------------
  // GET DEM ASTROIDS
  //-----------------

  let beginningRocks = [];

  function makeBigRockMoveDown(bigRock, currentY, degs, direction, spinAmount, fallSpeed){
    let rect = bigRock.getBoundingClientRect();
    currentY += fallSpeed;
    degs = (Math.abs(degs) + spinAmount) * direction;

    bigRock.style.transform = `translateY(${currentY}px) rotate(${degs}deg)`;
    if (rect.y > window.innerHeight){
    
      let index = astroids.indexOf(bigRock);
      removeAstroids.push(astroids[index]);

      //removing astroids in collition check to prevent array distoration
    }
  
    requestAnimationFrame(() => makeBigRockMoveDown(bigRock, currentY, degs, direction, spinAmount, fallSpeed));
  }
  
  function spawnBigRock(){

    let newThing = document.createElement("img");
    screen.appendChild(newThing);
    newThing.src = varients[Math.round(Math.random() * 3)];
    newThing.classList.add("woahWATCHout");

    let xPos = Math.random()*91

    newThing.style.left = `${xPos}vw`;
    let direction = 0;
    let num = Math.floor(Math.random() * 2);
    let spinAmount = Math.ceil(Math.random() * astroidSpinScope);
    let fallSpeed = astroidSpeed;

    if (num === 1){
      direction = -1;
      fallSpeed += spinAmount;
    }
    else {
      direction = 1;
      fallSpeed += spinAmount;
    }
    if (GameStarted){
      astroids.push(newThing);
    }
    else {
      beginningRocks.push(newThing);
    }
    requestAnimationFrame(() => makeBigRockMoveDown(newThing, 0, 0, direction, spinAmount, fallSpeed));
  }

  

  //--------------------------------------------------
  //this is for the rock spawning in the start UP menu
  //--------------------------------------------------
  async function RockSpawnBeginning(){
    while (true){
      await sleep(1)
      if (!canSpawn){break;};
      spawnBigRock();
    };

  };

  // game spawning astroiders


  //--------------------
  // GAME PAUSE/MENU STF
  //--------------------
  function PauseGame(toPause){
    if (toPause === false){
      GamePaused = false;
    }
    else{
      GamePaused = true;
    }
  }

  
  

  //------------
  // SHIP STUFF 
  //------------

  //moving yeah

  var right = 0;
  var left = 0;

  var playerX = 0;

  var rightHeld = false;
  var leftHeld = false;
  
  var isCanMove = false;

  function MovePlayer() {
    if (!GamePaused && GameStarted){
      console.log(GameStarted);
       wayToGo = left + right;
      if (wayToGo > 0){
        wayToGo = 1;
      }
      else if (wayToGo < 0){
        wayToGo = -1;
      }
      let PlayerShipB = PlayerShip.getBoundingClientRect();
      let MoveRestriction = screen.getBoundingClientRect();
      
      if ((!(MoveRestriction.left - 28> PlayerShipB.left) || wayToGo === 1) && ((! (MoveRestriction.right + 9 < PlayerShipB.right)|| wayToGo === -1))){
        playerX += wayToGo * shipSpeed;
        PlayerShip.style.transform = `translateX(${playerX}px)`;
      };
    };

    requestAnimationFrame(MovePlayer);
  }
  requestAnimationFrame(MovePlayer);


    //--------------------
    // shooting-----------
    //--------------------

  function MoveBullet(bull, currentY, offset){
    if (!GamePaused){
      currentY -= BullSpeed;
      bull.style.transform = `translate(${offset}px, ${currentY}px)`;

      let getBounding = bull.getBoundingClientRect();
      if (Math.abs(getBounding.y) >= window.innerHeight){
        let index = bullets.indexOf(bull);
        removeBullets.push(bullets[index]);
        
        // moved bullet delition to collitions to prevent array distortion
        return;
      } 
    }
    
    requestAnimationFrame(() => MoveBullet(bull, currentY, offset));
  }

  const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

  async function shoot(){
    if (GamePaused || reloding || !GameStarted){return;};
    
    let newBullet = bullet.cloneNode(true); 
    bullets.push(newBullet);

    newBullet.removeAttribute("id");
    screen.appendChild(newBullet); 

    let bound = PlayerShip.getBoundingClientRect();

    let xPos = bound.left + bound.width / 2;
    let yPos = bound.top;


    newBullet.style.margin = "0";
    newBullet.style.left = `${xPos}px`;
    newBullet.style.top = `${yPos}px`;

    let bound2 = newBullet.getBoundingClientRect();
    let offset = ((Math.abs((bound.left + bound.width / 2) - (bound2.x))) * -1) -1.8
    
    newBullet.style.transform = `translateX(${offset}px)`;
    
    bound2 = newBullet.getBoundingClientRect();
    newBullet.style.opacity = "1";


    requestAnimationFrame(() => MoveBullet(newBullet, 0, offset));
  
    if (upHeld){
      reloding = true;
      await sleep(reloadTime);
      if (!upHeld){
        reloding = false;
        return;
      };
      reloding = false;
      requestAnimationFrame(shoot);
    }
  } 

  async function MainGameLoop(){
    while (true){
      await sleep(2);
      spawnBigRock();
    }
  }


  let stf = true;
  function showHideMenu(bool) {
    stf = !stf;
    if (bool){
      document.body.style.cursor = "default";
      MainMenu.style.visibility = "visible";
      MainMenu.style.opacity = "1";
      ResumePlayButton.textContent = "Resume";
    }
    else {
      MainMenu.style.transition = "0.3s ease";
      document.body.style.cursor = "none";
      MainMenu.style.opacity = "0";
      MainMenu.style.visibility = "hidden";
      GamePaused = false;
    }
  }

  function movePeices(speed, piece, direction, y, horizontal, opacity){
    y = (Math.abs(y) +speed) * direction;

    if (horizontal){
      piece.style.transform = `translateX(${y}px)`
    }
    else {
      piece.style.transform = `translateY(${y}px)`
    }
    
    opacity -= .02;
    piece.style.opacity = opacity;
    requestAnimationFrame(() => movePeices(speed, piece, direction, y, horizontal, opacity));

    if (piece.style.opacity < -.4){
      piece.remove();
    }
  }
  
  function createAstroidDestoryPieces(rock){
    let bound = rock.getBoundingClientRect();

    astroidPiecesTemplete.style.left = `${bound.right - (bound.width / 2)}px`;
    astroidPiecesTemplete.style.top =  `${bound.top + (bound.height / 2)}px`;
    
    let direction = 1
    let speed = 1;
    
    for (let i = 0; i< 8; i++){
      let piece = astroidPiecesTemplete.cloneNode(true);
      screen.appendChild(piece);
      piece.removeAttribute("id");
      direction *= -1
      piece.style.visibility = "visible";
      movePeices(speed, piece, direction, 0, false, 1);
      speed++;
    }
    
    speed = 1;
    for (let i = 0; i< 8; i++){
      let piece = astroidPiecesTemplete.cloneNode(true);
      screen.appendChild(piece);
      piece.removeAttribute("id");
      direction *= -1
      piece.style.visibility = "visible";
      movePeices(speed, piece, direction, 0, true, 1);
      speed ++;
    }
    
  }

  async function deleteItem(item){
    item.style.opacity = "0";
    await sleep(3);
    item.remove();
  }

  //collisions
  
  function checkColliding(item1, item2){
    let rect1 = item1.getBoundingClientRect();
    let rect2 = item2.getBoundingClientRect();
    return !(rect1.top > rect2.bottom || rect1.bottom < rect2.top || rect1.left > rect2.right || rect1.right < rect2.left);
    }

  function checkCollitionsLoop() {
    removeAstroids.length = 0;
    removeBullets.length = 0;

    for (let bullet = 0; bullet < bullets.length; bullet++){
      for (let rock = 0; rock < astroids.length; rock++){
        let colliding = checkColliding(bullets[bullet], astroids[rock]);
        if (colliding){
          removeAstroids.push(astroids[rock]);
          removeBullets.push(bullets[bullet]);
          createAstroidDestoryPieces(astroids[rock]);
        }
      } 
    }

    for (let i = 0; i < removeAstroids.length; i++){
      let index = astroids.indexOf(removeAstroids[i]);
      astroids.splice(index, 1);
      deleteItem(removeAstroids[i]);
    }

    for (let i = 0; i <removeBullets.length; i++){
      let index = bullets.indexOf(removeBullets[i]);
      bullets.splice(index, 1);
      deleteItem(removeBullets[i]);
    }
    requestAnimationFrame(checkCollitionsLoop);
  }


  // Menu buttons clicked
  document.addEventListener("click", async function(event){
    let item = event.target;
    
    if (item === quitGame){
      window.close();
    }
    else if (item === ResumePlayButton){
      showHideMenu(false);
      if (!GameStarted){
        canSpawn = false;
        while (beginningRocks.length > 0){
          beginningRocks[0].style.opacity = "0";
          beginningRocks.shift();
        };
        PlayerShip.style.visibility = "visible";
        screen.classList.add("shakeAnim");
        PlayerShip.classList.add("shipMove");
        // await sleep(2);        // THIS IS VERY IMPORTANT, ACTIVATE THIS BEFORE FINISHING THE GAME (fixes the player being able to move in the beginning)
        GameStarted = true;
        MainGameLoop();
        requestAnimationFrame(checkCollitionsLoop);
      }
    }
  })
  //---------------------
  //---------------------
  // FUNCTIONS-----------
  //---------------------
  //---------------------


  //-----------
  // EVENTS----
  //-----------

  document.addEventListener("visibilitychange", function(){
    if (document.visibilityState === "hidden" && GameStarted){
      MainMenu.style.transition = "none";
      PauseGame(true);
      showHideMenu(true);
    }
  })

  document.addEventListener("keydown", function(event){
    if (event.key === "Escape"){
      if (stf === false ){
      PauseGame(true);
      showHideMenu(true);
    }
    else {
      PauseGame(false);
      showHideMenu(false);
    }
    };
  })

  let upHeld = false;

  document.addEventListener("keydown", function(event) {
    
    if (event.key === "ArrowLeft" || event.key === "a") {
      left = -1;
      leftHeld = true;
    }

    if (event.key === "ArrowRight" || event.key === "d") {
      right = 1;
      rightHeld = true;
    }

    if (event.key === "ArrowUp" || event.key === "w"){
      if (event.repeat){return;};
      upHeld = true;
      shoot();
    }
  });

  document.addEventListener("keyup", function(event) {

      if (event.key === "ArrowLeft" || event.key === "a"){
        left = 0;
        leftHeld = false;
      }
        
      else if (event.key === "ArrowRight" || event.key === "d") {
        right = 0;
        rightHeld = false
      }

      else if (event.key === "ArrowUp"|| event.key === "w"){
        upHeld = false;
      }
  });

  // Initial Calls
  Reset();
  spawnBigRock();
  RockSpawnBeginning();
});