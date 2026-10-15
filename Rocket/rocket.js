document.addEventListener("DOMContentLoaded", function () {
  //----------------------------------------
  // Public vairables that I want everywhere
  //----------------------------------------

  var GamePaused = false;

  //-----------------
  // BACKGROUND MOVING
  //-----------------

  const screen = document.getElementById("screenShakeContainer");
  let Background = document.getElementById("Background");

  const PlayerShip = document.getElementById("Rocketship");
    
  let currentY = 0; // Track the position manually
  const speed = 2;  // High values like 20 move too fast with requestAnimationFrame

  // 1. Setup the two backgrounds (no need to constantly clone inside the loop)
  const Background2 = Background.cloneNode(true);
  screen.appendChild(Background2);

  // 2. Position them absolutely
  Background.style.position = 'absolute';
  Background.style.top = '-1vw';
  Background.style.left = '-1vw';

  Background2.style.position = 'absolute';
  Background2.style.top = '-1vw'; 
  Background2.style.left = '-1vw';

  const bgHeight = Background.offsetHeight; // Get the actual pixel height

  function MoveBackground() {
    if (!GamePaused){
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

  //------------
  // SHIP STUFF 
  //------------

  //moving yeah
  
  var right = 0;
  var left = 0;

  var playerX = 0;
  const shipSpeed = 5;

  var rightHeld = false;
  var leftHeld = false;
  
  var isCanMove = false;

  function MovePlayer() {
    if (!GamePaused){
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
    
  let BullSpeed = 5;
  let reloadTime = .6;
  let reloding = false;

  function MoveBullet(bull, currentY, offset){
    if (!GamePaused){
      currentY -= BullSpeed;
      bull.style.transform = `translate(${offset}px, ${currentY}px)`;

      let getBounding = bull.getBoundingClientRect();
      if (Math.abs(getBounding.y) >= window.innerHeight){
        bull.remove();
        return;
      } 
    }
    
    requestAnimationFrame(() => MoveBullet(bull, currentY, offset));
  }

  const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

  async function shoot(){
    if (GamePaused || reloding){return;};
    
    const bullet = document.getElementById("shoot"); 
    let newBullet = bullet.cloneNode(true); 

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

    //--------------------
    // shooting-----------
    //--------------------

    
  let upHeld = false;

  document.addEventListener("keydown", function(event) {
      if (event.key === "ArrowRight") {
          right = 1;
          rightHeld = true;
      } else if (event.key === "ArrowLeft") {
          left = -1;
          leftHeld = true;
      }

      if (event.key === "ArrowUp" ){
        if (event.repeat){return;};
        upHeld = true;
        shoot();
        
      }
  });

  document.addEventListener("keyup", function(event) {
      if (event.key === "ArrowLeft"){
        left = 0;
        leftHeld = false;
      }
        
      else if (event.key === "ArrowRight") {
        right = 0;
        rightHeld = false
      }

      else if (event.key === "ArrowUp"){
        upHeld = false;
      }
  });


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

  //-------------------
  //TEMP ESC MENU------
  //-------------------

  let stf = false;
  document.addEventListener("keydown",function(e){
    if (!(e.key === "Escape")){return;};
    if (stf === false){
      PauseGame(true);
      stf = true;
    }
    else {
      stf = false;
      PauseGame(false);
    }
    
  })


  //-----------------
  // GET DEM ASTROIDS
  //-----------------

  // i don't wanna do this honestly
});

/*
Menus
  Play / resume
  
  Settings
    Sound
    Other stf

  Quit
*/