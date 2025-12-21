document.addEventListener("DOMContentLoaded", () => {

    //   SCORE SYSTEM
    
    // Reset score ONLY on very first site visit
    if (sessionStorage.getItem("firstVisit") === null) {
        localStorage.setItem("score", 0);
        sessionStorage.setItem("firstVisit", "yes");
    }

    // Get saved score, or 0 if none exists
    let score = Number(localStorage.getItem("score")) || 0;

    // The element that displays the score
    const scoreDisplay = document.getElementById("scoreDisplay") || 
                         document.getElementById("displayclicks");

    // score on page load
    if (scoreDisplay) {
        scoreDisplay.innerText = score;
    }

    // function to add points
    window.addPoint = function () {
        score++;
        localStorage.setItem("score", score);

        if (scoreDisplay) {
            scoreDisplay.innerText = score;

            // Optional pop animation
            scoreDisplay.classList.add("score-pop");
            setTimeout(() => scoreDisplay.classList.remove("score-pop"), 300);
        }
    };

    // 
    //   CARD FLIP - 2nd JAVAsc feature
    // 
    document.querySelectorAll(".flag-card").forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
        });
    });

    /* 
       ALIAS keepScore TO addPoint
     */
    window.keepScore = window.addPoint;

    // 
    //   TEXT FITTING SCRIPT  - Additional skill*
    // 
    const fitContainers = document.querySelectorAll('.results-container, .flag-card h2, .intro h2, .intro p');

    function fitTextToContainer(element, maxFontSize = 24, minFontSize = 10) {
        let fontSize = maxFontSize;
        element.style.fontSize = fontSize + 'px';

        while ((element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) 
               && fontSize > minFontSize) {
            fontSize -= 1;
            element.style.fontSize = fontSize + 'px';
        }
    }

    fitContainers.forEach(container => fitTextToContainer(container, 28, 12));

    window.addEventListener('resize', () => {
        fitContainers.forEach(container => fitTextToContainer(container, 28, 12));
    });
});
