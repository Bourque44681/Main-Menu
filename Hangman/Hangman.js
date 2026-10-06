document.addEventListener("DOMContentLoaded", function(){
    //--------
    //Variables
    //--------

    const GameEndingInfo = document.getElementById("GameEndingInfo");
    const GameEndingInfoH1 = document.getElementById("GameEndingInfoH1");


    const letterPlacementsCont = document.getElementById("letterPlacements");
    const ALreadyChosenFrame = document.getElementById("alreadyChosen");
    const alreadyChosenCont = document.getElementById("alrCont");
    const currentTyping = document.getElementById("CurrentTyping");

    const head = document.getElementById("head");
    const torso = document.getElementById("torso");
    const armR = document.getElementById("armR");
    const armL = document.getElementById("armL");
    const legR = document.getElementById("legR");
    const legL = document.getElementById("legL");

    // max length: 9
    var Words = ["apple", "banana", "yellow", "orange", "grape", "melon", "berry", "peach", "mango", "kiwi",
"pear", "plum", "lime", "lemon", "apricot", "fig", "date", "papaya", "guava", "coconut",
"strawberry", "blueberry", "raspberry", "blackberry", "watermelon", "pineapple", "nectarine",
"tomato", "carrot", "potato", "onion", "garlic", "pepper", "spinach", "lettuce", "broccoli",
"cabbage", "celery", "cucumber", "pumpkin", "squash", "corn", "bean", "pea", "ginger",
"basil", "mint", "oregano", "thyme", "parsley", "rosemary", "sage", "cherry", "olive",
"almond", "walnut", "pecan", "hazelnut", "cashew", "pistachio", "rice", "wheat", "oats",
"barley", "bread", "butter", "cheese", "milk", "yogurt", "cream", "honey", "sugar",
"salt", "peppercorn", "cinnamon", "vanilla", "chocolate", "coffee", "tea", "juice",
"water", "soda", "cookie", "cake", "pie", "pasta", "noodle", "soup", "salad", "sandwich",
"burger", "pizza", "taco", "burrito", "salsa", "ketchup", "mustard", "mayonnaise",
"chicken", "beef", "pork", "fish", "shrimp", "crab", "lobster", "egg", "tofu", "beansprout",
"forest", "river", "mountain", "ocean", "desert", "island", "valley", "hill", "cloud",
"rain", "snow", "wind", "storm", "sun", "moon", "star", "sky", "tree", "flower",
"grass", "leaf", "stone", "sand", "fire", "ice", "metal", "wood", "glass", "paper",
"pencil", "book", "chair", "table", "window", "door", "house", "road", "car", "train",
"bus", "bicycle", "phone", "computer", "keyboard", "screen", "music", "sound", "light",
"color", "shape", "circle", "square", "triangle", "energy", "time", "space", "dream", "idea", "poet"];
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
    var AlreadyLettersTrack = [];

    // holds the value of letters that the player has correctly gussed
    var CorrectlyGussedLetters =[];
    var MissgussedWords = [];

    // keeps track of the hidden/shown body parts
    var HandmanBodyPartsList = [head, torso, legR, legL, armR, armL]
    var HiddenKeepTrack = 0;

    // self explanitory
    var gameOver = false;
    let won = null;
    //after the game ends, waits for the gameinfo to appear
    let canContinue = false;

    //---------------
    // Initial set up
    //---------------


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
            AlreadyLettersTrack.push(false);
            MissgussedWords.push(false);
        };

    };

        //resets the stuff
    function ResetStf(){
        head.style.visibility = "hidden";
        torso.style.visibility = "hidden";
        armR.style.visibility = "hidden";
        armL.style.visibility = "hidden";
        legR.style.visibility = "hidden";
        legL.style.visibility = "hidden";
        GameEndingInfo.style.opacity = "0%";
        GameEndingInfo.style.visibility = "hidden";
        currentTyping.style.visibility = "visible";
        gameOver = false;
        canContinue = false;
        TypingOnDiv = 1;
        CurrentKeepTrack = 0;
        MaxCurrent;
        AlreadyKeepTrack = 0;
        MaxAlready;
        LetterPlacementTrack = [];
        AlreadyLettersTrack = [];
        CorrectlyGussedLetters =[];
        MissgussedWords = [];
        HiddenKeepTrack = 0;
        won = null;
        while (LetterPlacementDivs.length > 0){
            LetterPlacementDivs[0].remove();
            LetterPlacementDivs.shift();
        }
        while (AlreadyChosenDivs.length > 0){
            AlreadyChosenDivs[0].remove();
            AlreadyChosenDivs.shift();
        }
        LetterPlacementDivs = [];
        AlreadyChosenDivs = [];
        SetUpDoc();
    }


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

    async function winLoseShow(){
        await sleep(1000)
        GameEndingInfo.style.opacity = "100%";
        await sleep(350);
        canContinue = true;
    }

    //--------------------------------
    //finished Game Events -- win/lose
    //--------------------------------
    function gameFinished(won){
        currentTyping.style.visibility = "hidden";
        GameEndingInfo.style.visibility = "visible";
        if (gameOver){return;};
        gameOver = true;
        if (won){
            console.log("You Won!");
            for (let i = 0; i < word.length;i++){
                LetterPlacementDivs[i].style.backgroundColor = "rgb(34, 150, 5)";
            }
            GameEndingInfoH1.textContent = "You Won!"
        }
        else{
            console.log("You lost");
            GameEndingInfoH1.textContent = "You lost"
            for (let i = 0; i <word.length; i++){
                if (CorrectlyGussedLetters[i] !== false){
                    LetterPlacementDivs[i].style.backgroundColor = "rgb(34, 150, 5)";
                }
                else {
                    LetterPlacementDivs[i].style.backgroundColor = "rgb(139, 2, 2)";
                    newH1 = document.createElement("h1");
                    newH1.classList.add("text");
                    newH1.textContent = word[i];
                    LetterPlacementDivs[i].appendChild(newH1);
                }
            }
        };
        winLoseShow();
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

        for (let i = 0; i<18; i++){
            if (AlreadyLettersTrack[i] === false){
                AlreadyKeepTrack = i;
                break;
            };
        };

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
        if (gameOver){return;};
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

        if (TypingOnDiv === 1){
            GetFirstLetterPlacement();
        }
        else {
            GetFirstAlreadyChosen();
        }

    }

    function resetAlreadyChosen(){
        let count = 0;
        while (AlreadyChosenDivs.length > 0){
            AlreadyChosenDivs[0].remove();
            AlreadyChosenDivs.shift();
            AlreadyLettersTrack[count] = false;
            count++;
        }

        for (let i = 0; i <18; i++) {
            let thingy = document.createElement("div");
            thingy.classList.add("ACslot")
            alreadyChosenCont.appendChild(thingy);
            AlreadyChosenDivs.push(thingy);
            
            if (MissgussedWords[i] !== false){
                newH1 = document.createElement("h1");
                newH1.classList.add("text2");
                newH1.textContent = MissgussedWords[i];
                thingy.appendChild(newH1);
                AlreadyLettersTrack[i] = true;
            }
        };


    }

    //------------------
    //Guessing Functions
    //------------------

    function gotLetterWong(amount){
        //the HiddenKeepTrack check failes every now and then, so this is to make sure the check doesn't fail
        let count = 0;
        for (let i = 0; i<HandmanBodyPartsList.length;i++){
            if (HandmanBodyPartsList[i].style.visibility === "visible"){
                count++;
            };
        };

        if (HiddenKeepTrack !== 6 && count !== HandmanBodyPartsList.length){
            HandmanBodyPartsList[HiddenKeepTrack].style.visibility = "visible";
        };
        HiddenKeepTrack++;
        if (HiddenKeepTrack === 6){
            won = false;
        };
    }

    function GuessedLetter(letter){
        if (MissgussedWords.includes(letter)){return;}
        let good = false;
        for (let i = 0; i< word.length; i++){
            if (word[i] === letter){
                CorrectlyGussedLetters[i] = letter;
                good = true;
            }
        }
        if (!good){
            gotLetterWong(1);
        }
        else {
            resetLettersPlacement();
        }

        GetFirstAlreadyChosen();
        MissgussedWords[AlreadyKeepTrack] = letter;
        AlreadyLettersTrack[AlreadyKeepTrack] = true;
    }

    function GuessedWord(gussedWord){
        for (let i = 0; i<gussedWord.length; i++){
            GetFirstAlreadyChosen();
            GuessedLetter(gussedWord[i]);
        }
        resetAlreadyChosen();

        let GotWrong = 0;
        let lettersAlrGussed = [];
        if (gussedWord === word){
            won = true;
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
    }

    //-------------------
    // Typing/Adding Text
    //-------------------

    const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    let lastLetter;
    let check = false;
    document.addEventListener("keydown", function(event){
        let key = event.key;
        if (gameOver) {
            if (key === "Enter" & canContinue){
                ResetStf();
                MaxCurrent = LetterPlacementTrack.length;
                GetFirstLetterPlacement();
            }
        }
        else if (letters.includes(key) || key === "Backspace" || key === "Enter"){
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
                            GetFirstLetterPlacement();

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
                GetFirstAlreadyChosen();
                // Already Guessed Div Typing (single letter guess)
                if (key === "Backspace"){
                    // backspace logic stuff here
                    h1 = AlreadyChosenDivs[AlreadyKeepTrack].querySelector("h1");
                    if (h1 !== null){
                        h1.remove();
                        check = false;
                    }
                }
                else if (key === "Enter"){
                    // entering one letter logic
                    check = false;
                    GuessedLetter(lastLetter);
                    resetAlreadyChosen();
                    GetFirstAlreadyChosen();
                    
                }
                else {

                    if (AlreadyLettersTrack[AlreadyKeepTrack] === false && !check){
                        check = true;
                        lastLetter = key;
                        slotToTarget = AlreadyChosenDivs[AlreadyKeepTrack];
                        newH1 = document.createElement("h1");
                        newH1.textContent = key;
                        newH1.classList.add("text2");
                        slotToTarget.appendChild(newH1);
                    }
                }
            }
        };
        // make sure that the gameFinished function goes off
        let gussedWord = "";
        let count = 0;
        for (let i = 0; i < LetterPlacementDivs.length;i++){
            gussedWord += LetterPlacementDivs[i].textContent;
            if (CorrectlyGussedLetters[i] !== false){
                count++;
            }
        }
        if (won !== null || (gussedWord === word && count === word.length)|| HiddenKeepTrack === 6){
            resetLettersPlacement();
            resetAlreadyChosen();
            gameFinished(won);
        };
    })

    //-----------------------
    // Initial call's / setup
    //------------------------


    // sets max of the currentKeepTrack Value - 1 bc its a index tracking value
    ResetStf();
    MaxCurrent = LetterPlacementTrack.length;
    runForever();
    GetFirstLetterPlacement();
})