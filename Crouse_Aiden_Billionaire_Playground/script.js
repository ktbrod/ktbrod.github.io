const startBtn = document.getElementById("startSinglePlayer");
const gameWindow = document.getElementById("gameWindow");
const menu = document.getElementById("menu");

let asteroidInterval;
let asteroids = [];
let score = 0;
let scoreDisplay;
let timeLeftDisplay;
let endGameDisplay;
let playCountDisplay;
let ship;
let shipCountFromBottom;
let shipCountFromLeft;
let shipRotation = 0;
let timeLeft = 30; //seconds
let gamePlays = 0;
let listOfScoreDivs = document.createElement("div")
let soundElement = new Audio('audio/Glass.m4a')
const nyanModeMusic = new Audio("audio/nyan.mp3");
nyanModeMusic.loop = true;
let isNyanMode = false;
let isGameRunning = false;




//gameWindow screen light reflection simulation
function enableGyroscopeLighting() {
    const gameWindow = document.getElementById("gameWindow");

    function applyGradient(angleDegrees) {
        gameWindow.style.backgroundImage =
            `linear-gradient(${angleDegrees}deg, black, gray)`;
    }

    // Request permission (required on iOS)
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === "granted") {
                startMotionTracking();
            }
        });
    } else {
        startMotionTracking();
    }

    function startMotionTracking() {
        window.addEventListener("devicemotion", (event) => {
            if (!event.rotationRate) return;

            const pitchRate = event.rotationRate.beta || 0;

            // Convert pitch rotation into a gradient angle
            let gradientAngle = 50 + pitchRate * 0.5;
            gradientAngle = Math.max(0, Math.min(180, gradientAngle)); // clamp

            applyGradient(gradientAngle);
        });
    }
}
document.getElementById("enableMotionButton").addEventListener("click", enableGyroscopeLighting);


function enableNyanMode() {
    if (isNyanMode) return;
    isNyanMode = true;

    // Make the ship big enough for the Nyan Cat GIF
    ship.style.width = "140px";
    ship.style.height = "100px";

    // Change ship to Nyan Cat GIF
    ship.style.backgroundImage = 'url("images/nyan-cat.gif")';
    ship.style.backgroundSize = "contain";
    ship.style.backgroundRepeat = "no-repeat";
    ship.style.backgroundPosition = "center";

    // Play Nyan Cat music
    nyanModeMusic.currentTime = 0;
    nyanModeMusic.play();

    // Rainbow background
    document.body.classList.add("rainbow-body-effect");
}

function disableNyanMode() {
    if (!isNyanMode) return;
    isNyanMode = false;

    // Restore original ship size
    ship.style.width = "60px";
    ship.style.height = "100px";

    // Restore original ship image
    ship.style.backgroundImage = 'url("images/Rocket.png")';
    ship.style.backgroundSize = "cover";
    ship.style.backgroundRepeat = "no-repeat";
    ship.style.backgroundPosition = "center";

    // Stop Nyan Cat music
    nyanModeMusic.pause();

    // Remove rainbow background
    document.body.classList.remove("rainbow-body-effect");
}



function determinePlayCount() {
    if (localStorage.getItem('Plays') != null) {
        gamePlays = localStorage.getItem('Plays');
    }
    else {
        localStorage.setItem('Plays', 0);
    }

    gamePlays = parseInt(localStorage.getItem('Plays'))
}


// Start button
startBtn.addEventListener("click", startAsteroidsGame);

// Escape key listener for reset to home 
document.addEventListener("keydown", function (e) {
    if (e.key === "p") {
        resetGame();
    }
});


//Start singleplayer game logic
function startAsteroidsGame() {

    isGameRunning = true;

    if (endGameDisplay) {
        endGameDisplay.style.display = "none";
    }

    determinePlayCount();
    timeLeft = 30;
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdownDisplay();
    }, 1000);


    // Hide the menu
    menu.style.display = "none";

    // Reset score on game start
    score = 0;


    // Create score display
    if (!scoreDisplay) { //if the display does not exist then create it and apply styling choices below (may need t edit later)
        scoreDisplay = document.createElement("p");
        scoreDisplay.id = "scoreDisplay";
        scoreDisplay.style.position = "absolute";
        scoreDisplay.style.top = "20px";
        scoreDisplay.style.left = "20px";
        scoreDisplay.style.color = "white";
        scoreDisplay.style.fontSize = "1.5em";
        scoreDisplay.style.fontFamily = '"Iceland", sans-serif';
        gameWindow.appendChild(scoreDisplay); //add score to the gameWindow container
    }

    //Create time display
    if (!timeLeftDisplay) { //if the time display does not exist then create it and apply styling choices below (may need t edit later)
        timeLeftDisplay = document.createElement("p");
        timeLeftDisplay.id = "timeDisplay";
        timeLeftDisplay.style.position = "absolute";
        timeLeftDisplay.style.top = "80px";
        timeLeftDisplay.style.left = "20px";
        timeLeftDisplay.style.color = "white";
        timeLeftDisplay.style.fontSize = "1.5em";
        timeLeftDisplay.style.fontFamily = '"Iceland", sans-serif';
        timeLeftDisplay.style.display = "block";
        gameWindow.appendChild(timeLeftDisplay);
    }
    else {
        timeLeftDisplay.style.display = "block";
    }

    updateScoreDisplay();
    updateCountdownDisplay();

    ship = document.createElement("div"); // Create a ship div
    ship.classList.add("ship"); //make the specific div a member of the ship class, inheriting all styling choices
    gameWindow.appendChild(ship); //add ship to game container

    //Initial ship state below 
    // Style and position the ship
    ship.style.width = "60px";
    ship.style.height = "100px";
    shipCountFromBottom = "40"; // above bottom edge
    shipCountFromLeft = "50"; //from left (halfway initial)
    ship.style.bottom = shipCountFromBottom + 'px';
    ship.style.left = shipCountFromLeft + '%';
    //end initial ship state



    // Start spawning asteroids every falf second
    asteroidInterval = setInterval(spawnAsteroid, 500);
    collisionCheckInterval = setInterval(detectCollision, 250)
}

function updateCountdownDisplay() {
    timeLeftDisplay.innerText = timeLeft;

    if (timeLeft == 0) {
        clearInterval(countdownInterval);
        //need to display score here and save
        resetGame();
    }


}

function moveShip(e) {

    if (!ship) {
        return;
    }
    let newShipRotation = shipRotation;

    ship.style.transition = "bottom 0.2s ease, left 0.2s ease, transform 0.2s ease";
    if (e.key === "w") {
        shipCountFromBottom = parseInt(shipCountFromBottom) + 20;
        ship.style.bottom = parseInt(shipCountFromBottom) + 'px';
        newShipRotation = 0;

    }
    if (e.key === "a") {
        shipCountFromLeft -= 5;
        ship.style.left = parseInt(shipCountFromLeft) + '%';
        newShipRotation = -90;

    }
    if (e.key === "s") {
        shipCountFromBottom = parseInt(shipCountFromBottom) - 20
        ship.style.bottom = parseInt(shipCountFromBottom) + 'px';
        newShipRotation = 180;

    }
    if (e.key === "d") {
        shipCountFromLeft = parseInt(shipCountFromLeft) + 5;
        ship.style.left = parseInt(shipCountFromLeft) + '%';
        newShipRotation = 90;
    }

    if (newShipRotation != shipRotation) {
        let appliedRotation = newShipRotation;

        if (isNyanMode) {
            if (newShipRotation === 0) appliedRotation = -90;
            if (newShipRotation === 90) appliedRotation = 0;
            if (newShipRotation === 180) appliedRotation = 90;
            if (newShipRotation === -90) appliedRotation = 180;
        }


        ship.style.transform = `rotate(${appliedRotation}deg)`;
        shipRotation = newShipRotation;
    }


    checkShipOutOfBounds();
}

function checkShipOutOfBounds() {
    if (!isGameRunning || !ship) {
        disableNyanMode();
        return;
    }

    const rect = ship.getBoundingClientRect();
    const parent = gameWindow.getBoundingClientRect();

    const isOut =
        rect.top < parent.top ||
        rect.left < parent.left ||
        rect.right > parent.right ||
        rect.bottom > parent.bottom;

    if (isOut) {
        enableNyanMode();
    } else {
        disableNyanMode();
    }
}



function startRainbowBackground() {
    document.body.classList.add("rainbow-body-effect");
}

function stopRainbowBackground() {
    document.body.classList.remove("rainbow-body-effect");
}



//Listen for movement keypresses 
document.addEventListener("keydown", moveShip)

function spawnAsteroid() {
    const asteroid = document.createElement("div"); //create asteroid div
    asteroid.classList.add("asteroid"); //apply asteroid class to inherit styling choices

    const randomX = Math.random() * (gameWindow.offsetWidth); //used to randomize positioning
    asteroid.style.left = randomX + "px";
    asteroid.style.top = "10px";
    gameWindow.appendChild(asteroid); //add to game window container
    asteroids.push(asteroid);

    // Animate falling
    let position = 0;
    const fallSpeed = 3 + Math.random() * 4;
    const fall = setInterval(() => {
        position += fallSpeed;
        asteroid.style.top = position + 'px';

        if (position > (gameWindow.offsetHeight - 80)) { //remove when reaching screen edge
            asteroid.remove();
            asteroids = asteroids.filter(a => a !== asteroid);
            clearInterval(fall);
        }
    }, 30);
}


function detectCollision() {

    const shipPositional = ship.getBoundingClientRect();

    asteroids = asteroids.filter(asteroid => {
        const asteroidPositional = asteroid.getBoundingClientRect();

        const isColliding = !(
            shipPositional.bottom < asteroidPositional.top ||
            shipPositional.top > asteroidPositional.bottom ||
            shipPositional.right < asteroidPositional.left ||
            shipPositional.left > asteroidPositional.right
        );

        if (isColliding) {
            increaseScore();
            if (asteroid.parentNode) {
                asteroid.parentNode.removeChild(asteroid); // remove from DOM
            }
            return false; // remove from asteroids array
        }

        return true; // keep asteroid if no collision
    });
}



//Increase the score when asteroid is hit (TODO)
function increaseScore() {
    score += 10000000; // +10 million
    updateScoreDisplay();
    playOnScore();
}

function updateScoreDisplay() {
    scoreDisplay.innerText = `💰 $${score.toLocaleString()}`;

    //TODO If score is X; play something
}

function playOnScore() {

    if (score % 50000000 === 0 && score !== 0) {
        getRandomImage();
        soundElement.play(); //Additional Skill
    }
}

function getRandomImage() {
    const images = ["images/Memes/Elon Meme.jpg", "images/Memes/Gates meme.jpg",
        "images/Memes/Taylor Meme.png", "images/Memes/Not_a_billionaire_meme.jpg", "images/Memes/Katy Meme 1.jpg", "images/Memes/Katy meme 2.png", "images/Memes/Kim K Money Meme.jpeg", "images/Memes/Kylie meme.png"

    ]

    const selectedImage = images[Math.floor(Math.random() * images.length)]

    const img = document.createElement("img");
    img.classList.add("memeImage")
    img.src = selectedImage;
    img.style.position = "absolute";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";

    gameWindow.appendChild(img);

    setTimeout(() => {
        img.remove();

    }, 2000)

}



//When user presses escape, menu is brought back and screen will go blank
function resetGame() {

    isGameRunning = false;

    saveScore();
    timeLeftDisplay.style.display = "none"
    clearInterval(countdownInterval); // Stop the timer
    timeLeft = -1;
    timeLeft = -1;



    // Stop asteroid spawning
    clearInterval(asteroidInterval);

    // Remove existing asteroids
    asteroids.forEach(a => a.remove());
    asteroids = [];

    //Remove ship
    ship.remove()



    // Remove score display
    if (scoreDisplay) {
        scoreDisplay.remove();
        scoreDisplay = null;
    }

    if (!endGameDisplay) { //Create endGameDisplay
        endGameDisplay = document.createElement("p");
        endGameDisplay.id = "endGameDisplay";
        endGameDisplay.style.position = "absolute";
        endGameDisplay.style.top = "100px";
        endGameDisplay.style.left = "20px";
        endGameDisplay.style.color = "white";
        endGameDisplay.style.fontSize = "1.5em";
        endGameDisplay.style.fontFamily = '"Iceland", sans-serif';
        endGameDisplay.innerText = "Your Income: $" + score;
        gameWindow.appendChild(endGameDisplay);
    }

    endGameDisplay.innerText = "Your Income: $" + score;


    // Show menu again
    menu.style.display = "flex";
    gamePlays = parseInt(localStorage.getItem('Plays')) || 0;
    gamePlays += 1;
    localStorage.setItem('Plays', gamePlays);

    if (playCountDisplay) {
        layCountDisplay.style.diplay = "none";
    }



}

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);

    scores.sort((a, b) => b - a);

    scores = scores.slice(0, 5);

    localStorage.setItem('scores', JSON.stringify(scores));
}



const scoreboardButton = document.getElementById("scoreboard");
const totalPlayCount = localStorage.getItem('Plays');
let scoreCards;

scoreboardButton.addEventListener("click", showScoreBoard);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        reset();
    }
});


function showScoreBoard() {
    menu.style.display = "none";
    gameWindow.innerHTML = "";

    listOfScoreDivs = document.createElement("div");
    listOfScoreDivs.id = "scoreboardContainer";

    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    const countOfScores = scores.length;

    listOfScoreDivs.innerHTML = "";
    listOfScoreDivs.style.display = "flex";
    listOfScoreDivs.style.flexDirection = "column";
    listOfScoreDivs.style.justifyContent = "center";
    listOfScoreDivs.style.alignItems = "center";
    listOfScoreDivs.style.gap = "20px";
    listOfScoreDivs.style.width = "90%";
    listOfScoreDivs.style.marginTop = "100px";

    for (let i = 0; i < countOfScores; i++) {
        const scoreCard = document.createElement("div");
        scoreCard.innerText = "Number " + i + ": income (Score): $" + scores[i];
        scoreCard.classList.add("scoreCard")
        listOfScoreDivs.append(scoreCard);


    }
    gameWindow.append(listOfScoreDivs);



    showPlayCount();
}

function showPlayCount() {
    playCountDisplay = document.createElement('p');
    playCountDisplay = document.createElement("p");
    playCountDisplay.id = "endGameDisplay";
    playCountDisplay.style.position = "absolute";
    playCountDisplay.style.top = "100px";
    playCountDisplay.style.left = "20px";
    playCountDisplay.style.color = "white";
    playCountDisplay.style.fontSize = "1.5em";
    playCountDisplay.style.fontFamily = '"Iceland", sans-serif';
    playCountDisplay.innerText = "Total Plays: " + totalPlayCount;

    gameWindow.appendChild(playCountDisplay);

}

function reset() {
    menu.style.display = "flex";
    gameWindow.appendChild(menu);

    if (listOfScoreDivs) {
        listOfScoreDivs.innerHTML = "";
    }

    if (playCountDisplay) {
        playCountDisplay.style.display = "none";
    }

}


/*
Despite the fact that only typically uber wealthy individuals can experience, and capitalize, on the mysteries of space, we can hope that this
wont always be the case. For we can all imagine and dream of the wacky wonders of the space beyond. 
*/
