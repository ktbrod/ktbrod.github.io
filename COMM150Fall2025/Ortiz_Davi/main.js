let playerRoll = 0;
let computerRoll = 0;
let score = 0;

const diceContainer = document.querySelector(".dice-container");
const btnRollDice = document.querySelector(".btn-roll-dice");


function createDice(number) {
    const dotPositionMatrix = {
        1: [[50,50]],
        2: [[20,20],[80,80]],
        3: [[20,20],[50,50],[80,80]],
        4: [[20,20],[20,80],[80,20],[80,80]],
        5: [[20,20],[20,80],[50,50],[80,20],[80,80]],
        6: [[20,20],[20,80],[50,20],[50,80],[80,20],[80,80]]
    };

    const dice = document.createElement("div");
    dice.classList.add("dice");

    dotPositionMatrix[number].forEach(([top, left]) => {
        const dot = document.createElement("div");
        dot.classList.add("dice-dot");
        dot.style.setProperty("--top", top + "%");
        dot.style.setProperty("--left", left + "%");
        dice.appendChild(dot);
    });

    return dice;
}

function randomizeDice() {
    diceContainer.innerHTML = "";

    
    playerRoll = Math.floor(Math.random() * 6) + 1;

    
    computerRoll = Math.floor(Math.random() * 6) + 1;

    let bias = Math.random();
    if (bias < 0.4) {
        computerRoll = Math.min(computerRoll + 1, 6);
    }

   
    diceContainer.appendChild(createDice(playerRoll));
    diceContainer.appendChild(createDice(computerRoll));

    console.log("Player:", playerRoll, "Computer:", computerRoll);
}
/*loops for the score*/

function winner() {
    if (playerRoll < computerRoll) {
        score -= 1;
    } else if (playerRoll > computerRoll) {
        score += 1;
    } else {
        score += 0.05;
    }

    /*scoreInput.value = score.toFixed(2);*/
    document.getElementById("baitdollars").innerText= score;
}

btnRollDice.addEventListener("click", () => {
    const interval = setInterval(randomizeDice, 20);

    setTimeout(() => {
        clearInterval(interval);
        winner();
    }, 1000);
});

/* this should stop the preload*/
document.getElementById("myform").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Game Over! Final Bait Dollars: " + score);
});
