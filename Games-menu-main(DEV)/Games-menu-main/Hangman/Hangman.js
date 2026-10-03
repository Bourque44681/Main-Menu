document.addEventListener("DOMContentLoaded", function(){
    //--------
    //Variables
    //--------

    const letterPlacementsCont = document.getElementById("letterPlacements");
    const ALreadyChosenFrame = document.getElementById("alreadyChosen");
    const alreadyChosenCont = document.getElementById("alrCont");
    const currentTyping = document.getElementById("CurrentTyping")

    const head = document.getElementById("head");
    const torso = document.getElementById("torso");
    const armR = document.getElementById("armR");
    const armL = document.getElementById("armL");
    const legR = document.getElementById("legR");
    const legL = document.getElementById("legL");


    var Words = ["poops"];
    var word = null;

    var TypingOnDiv = 1;

    // Holds the DIV item of each slot
    var LetterPlacementDivs = [];
    var AlreadyChosenDivs = [];
    
    // Value of the current slot selected (index form)
    var CurrentKeepTrack = 0;
    var MaxCurrent;
    var AlreadyKeepTrack = 0;
    var MaxAlready;

    // tracks which slots have something in them
    var LetterPlacementTrack = [];

    // holds the value of letters that the player has correctly gussed
    var CorrectlyGussedLetters =[];

    //---------------
    // Initial set up
    //---------------

    // Hides the hangman pieces
    function ResetStf(){
        head.style.visibility = "hidden";
        torso.style.visibility = "hidden";
        armR.style.visibility = "hidden";
        armL.style.visibility = "hidden";
        legR.style.visibility = "hidden";
        legL.style.visibility = "hidden";
    }

    //Sets up the document
    function SetUpDoc(){
        let RandomWord = Words[Math.floor(Math.random() * Words.length)];
        word = RandomWord;
        // Picks random word, put amont of letters in word into the Letter Placement Div
        let wordLength = RandomWord.length;
        for (let i = 0; i < wordLength; i++){
            let NewDiv = document.createElement("div");
            NewDiv.classList.add("LPslot");
            letterPlacementsCont.appendChild(NewDiv);
            LetterPlacementDivs.push(NewDiv);
            LetterPlacementTrack.push(false);
            CorrectlyGussedLetters.push(false);
            
        };
        //Puts 18 slots into the Already Gussed Div
        for (let i = 0; i <18; i++) {
            let thingy = document.createElement("div");
            thingy.classList.add("ACslot")
            alreadyChosenCont.appendChild(thingy);
            AlreadyChosenDivs.push(thingy);
        };
    };

    // flashes the typing bar so you know where your typing
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    async function runForever() {
        while (true) {
            if (currentTyping.style.opacity === "1") {
                currentTyping.style.opacity = ".2";
            }
            else {
                currentTyping.style.opacity = "1";
            };
            await sleep(600);
        }
    }

    //--------------------------------
    //finished Game Events -- win/lose
    //--------------------------------
    function gameFinished(won){
        if (won){
            console.log("You Won!");
        }
        else{
            console.log("You lost");
        };
    }


    //-----------------------------------------
    // Tracking values & found letters n'stuff
    //-----------------------------------------

    //Check if Letter Placements are Full (reader to be entered)
    function CheckLetterPlacementFull(){
        let count = 0;
        let ListLength = LetterPlacementTrack.length;

        // if something there, add to count
        for (let i = 0; i<ListLength; i++){
            if (LetterPlacementTrack[i] === true){
                count++;
            };
        }
        if (count === ListLength){
            // return true if full
            return true;
        }
        else{
            // return false if not full
            return false;
        };
    };

    // Set first availble slot
    function GetFirstLetterPlacement(){
        CurrentKeepTrack = 0;

        let needCheck = false;
        //Find next available spot, if none, sets it to last slot that you gussed (not a guessed word)
        for (let i = 0; i<MaxCurrent; i++){

            if (LetterPlacementTrack[i] === false){
                CurrentKeepTrack = i;
                slotToTarget = LetterPlacementDivs[CurrentKeepTrack];
                slotToTarget.appendChild(currentTyping);
                needCheck = false;
                break;
            }
            else{
                CurrentKeepTrack = MaxCurrent;
                needCheck = true;
            };
        };

        if (needCheck){
            for (let i = LetterPlacementDivs.length; i > 0; i--){
                if (CorrectlyGussedLetters[i] === false){
                    CurrentKeepTrack = i + 1;
                    break;
                }
            }
        }
    };

    // Set first availble slot
    function GetFirstAlreadyChosen(){
        AlreadyKeepTrack = 0;
        slotToTarget = AlreadyChosenDivs[AlreadyKeepTrack];
        slotToTarget.appendChild(currentTyping);
    }


    // Swap Current Typing depending on which div clicked
    document.addEventListener("click", function(event){
        let target = event.target;

        if (target === letterPlacementsCont){
            GetFirstLetterPlacement();
            TypingOnDiv = 1;
        }
        else if (target === ALreadyChosenFrame){
            GetFirstAlreadyChosen();
            TypingOnDiv = 2;
        }
    })


    //--------------------------
    // Resting letter Placements
    //--------------------------

    function resetLettersPlacement(){
        let count = 0;
        while (LetterPlacementDivs.length > 0){
            LetterPlacementDivs[0].remove();
            LetterPlacementDivs.shift();
            LetterPlacementTrack[count] = false;
            count++;
            
        }

        let wordLength = LetterPlacementTrack.length;
        for (let i = 0; i < wordLength; i++){
            let NewDiv = document.createElement("div");
            NewDiv.classList.add("LPslot");
            letterPlacementsCont.appendChild(NewDiv);
            LetterPlacementDivs.push(NewDiv);

            if (CorrectlyGussedLetters[i] !== false){   
                newH1 = document.createElement("h1");
                newH1.classList.add("text");
                newH1.textContent = CorrectlyGussedLetters[i];
                NewDiv.appendChild(newH1);
                LetterPlacementTrack[i] = true;
            }
            
        };
        GetFirstLetterPlacement();

    }

    //------------------
    //Guessing Functions
    //------------------

    function gotLetterWong(amount){
        console.log("You got "+amount+" letters wrong.")
    }

    function GuessedWord(gussedWord){
        let GotWrong = 0;
        let lettersAlrGussed = [];
        if (gussedWord === word){
            gameFinished(true);
            for (let i = 0; i < word.length; i++){
                CorrectlyGussedLetters[i] = word[i];
            }
            return;
        }
        else {
            for (let i = 0; i<gussedWord.length;i++){
                // if letters are the same, add the letter to the correclty gussed list
                if (word.includes(gussedWord[i])){
                    for (let e = 0; e<word.length;e++){
                        if (word[e] === gussedWord[i]){
                            CorrectlyGussedLetters[e] = gussedWord[i];
                        }
                    }
                }
                else {
                    if (lettersAlrGussed.includes(gussedWord[i])){
                        //idk what to do here, soooooooooo  
                    }
                    else {
                        GotWrong++;
                        lettersAlrGussed.push(gussedWord[i]);
                    }
                }
            }
        }
        gotLetterWong(GotWrong);
    }

    //-------------------
    // Typing/Adding Text
    //-------------------

    const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    document.addEventListener("keydown", function(event){
        let key = event.key;
        if (letters.includes(key) || key === "Backspace" || key === "Enter"){
  
            // Letter Placement Div Typing (full word guess)
            if (TypingOnDiv === 1){

                // Check if backspace
                if (key === "Backspace"){
                    //Backspacing Logic
                    GetFirstLetterPlacement();

                    //check if at last slot to prevent error
                    if (CurrentKeepTrack === 0){
                        return;
                    }
                    
                    slotToTarget = LetterPlacementDivs[CurrentKeepTrack - 1];

                    if (CorrectlyGussedLetters[CurrentKeepTrack - 1] === false){
                        h1 = slotToTarget.querySelector("h1");
                        h1.remove();
                        LetterPlacementTrack[CurrentKeepTrack - 1] = false;
                        GetFirstLetterPlacement();
                    }
                    else {
                        og = CurrentKeepTrack;
                        let good = false;
                        for (let i = og - 1; i > -1;i--){
                            if (CorrectlyGussedLetters[i] === false){
                                slotToTarget = LetterPlacementDivs[i];
                                LetterPlacementTrack[i] = false;
                                good = true;
                                break;
                            }
                        }
                        if (good){
                            h1 = slotToTarget.querySelector("h1");
                            h1.remove();
                            GetFirstLetterPlacement();
                        }
                    }
                }
                else {
                    // check if full so no over lapping/ can enter
                    let check = CheckLetterPlacementFull();
                    if (key === "Enter"){


                        if (check){
                            // Entering whole word Logic
                            let gussedWord = "";
                            for (let i = 0; i < LetterPlacementDivs.length;i++){
                                gussedWord += LetterPlacementDivs[i].textContent;
                            }
                            GuessedWord(gussedWord);
                            resetLettersPlacement();

                        }
                        else{
                            return;
                        }
                    }
                    else {
                        if (check){return};
                        // Typing a letter Logic
                        slotToTarget = LetterPlacementDivs[CurrentKeepTrack];

                        //create new H1 and add it
                        NewH1 = document.createElement("h1");
                        NewH1.classList.add("text");
                        NewH1.textContent = key;
                        slotToTarget.appendChild(NewH1);
                        LetterPlacementTrack[CurrentKeepTrack] = true;

                        GetFirstLetterPlacement();
                    }

                }
            }
            else {
                // Already Guessed Div Typing (single letter guess)
            }
        };
    })

    //-----------------------
    // Initial call's / setup
    //------------------------

    SetUpDoc();
    // sets max of the currentKeepTrack Value - 1 bc its a index tracking value
    MaxCurrent = LetterPlacementTrack.length;
    ResetStf();
    runForever();
    GetFirstLetterPlacement();


})