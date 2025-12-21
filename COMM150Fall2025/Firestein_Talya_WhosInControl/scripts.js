// scripts.js — Shared across all pages
// Uses localStorage key: 'wic_choices' (array of 'human'/'machine')
// Functions: startSimulation(), choose(lean,next), updateSliderOnPage(), resetAll(), downloadReport()

(function(){
  // Elements that may exist on pages
  const sliderMarker = document.getElementById('sliderMarker');
  const sliderNumber = document.getElementById('sliderNumber');

  // Robotic typing effect for index.html
  function typeSystemInit() {
    const el = document.getElementById("systemInit");
    if (!el) return; // only run on index.html

    const text = "SYSTEM INITIALIZING...";
    let i = 0;
    el.style.opacity = 1;

    function typeChar() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(typeChar, 70); // typing speed
      }
    }

    // slight delay for dramatic effect
    setTimeout(typeChar, 500);
  }

  // Ensure choices array exists
  function getChoices(){ 
    try {
      return JSON.parse(localStorage.getItem('wic_choices') || '[]');
    } catch(e){
      return [];
    }
  }

  function setChoices(arr){ 
    localStorage.setItem('wic_choices', JSON.stringify(arr)); 
  }

  // Start simulation (from index.html)
  window.startSimulation = function(){
    // clear any existing session
    setChoices([]);

    // go to first question
    window.location.href = 'q1.html';
  };

  // choose(lean,nextPage) called inline by onclick on choice buttons
  window.choose = function(lean, nextPage){
    const choices = getChoices();
    choices.push(lean);
    setChoices(choices);

    // small delay for effect
    setTimeout(() => {
      window.location.href = nextPage;
    }, 200);
  };

  // update slider on any page
  window.updateSliderOnPage = function(){
    const choices = getChoices();
    const machineCount = choices.filter(c => c === 'machine').length;
    const total = choices.length;
    const pctMachine =
      total === 0 ? 50 : Math.round((machineCount / total) * 100);

    // update numeric
    if (sliderNumber) 
      sliderNumber.textContent = `Lean: ${pctMachine}% Machine`;

    // update marker position
    if (sliderMarker) 
      sliderMarker.style.left = `${pctMachine}%`;

    // Apply UI glitch/jitter depending on lean
    applyGlitch(choices);
  };

  // glitch effects when machine leaning increases
  // additional skill! dynamic glitch effect based on user decision pattern 
  function applyGlitch(choices){
    const machineCount = choices.filter(c => c === 'machine').length;
    const humanCount = choices.filter(c => c === 'human').length;

    const body = document.body;
    body.classList.remove('glitch', 'jitter');

    if (machineCount >= 3 && machineCount <= 5 && machineCount > humanCount){
      body.classList.add('glitch');
    }

    if (machineCount >= 6 && machineCount > humanCount){
      body.classList.add('glitch', 'jitter');
    }
  }

  // page load handler
  document.addEventListener('DOMContentLoaded', function(){
    updateSliderOnPage();

    const page = window.location.pathname.split('/').pop();
    if (page === 'index.html') {
      typeSystemInit();
    }
  });

  // Reset game
  window.resetAll = function(){
    setChoices([]);
    window.location.href = 'index.html';
  };

  // Download session report
  window.downloadReport = function(){
    const choices = getChoices();
    const machine = choices.filter(c => c === 'machine').length;
    const human = choices.filter(c => c === 'human').length;

    const result =
      machine > human ? 'COMPUTER' :
      human > machine ? 'HUMAN' :
      'TIED';

    const text = [
      `Who's In Control? — Session Report`,
      `Date: ${new Date().toLocaleString()}`,
      `Decisions total: ${choices.length}`,
      `Human choices: ${human}`,
      `Machine choices: ${machine}`,
      `Result: ${result}`,
      `Choices: ${choices.join(', ')}`,
      ``,
      `Reflection: This simulation tracks how patterns of convenience, trust, and algorithmic design shape decision-making.`
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whos-in-control-report.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // result page logic
  document.addEventListener('DOMContentLoaded', function(){
    const path = window.location.pathname.split('/').pop();
    if (path !== 'result.html') return;

    const choices = getChoices();
    const machine = choices.filter(c => c === 'machine').length;
    const human = choices.filter(c => c === 'human').length;

    const titleEl = document.getElementById('resultTitle');
    const textEl = document.getElementById('resultText');
    const resultCard = document.getElementById('resultCard');

    if (machine > human){
      if (titleEl) titleEl.textContent = 'CONTROL: COMPUTER';
      if (textEl) textEl.textContent =
        `Outcome: The system predicted and shaped your path. COMPUTER WINS.`;
      document.body.classList.add('glitch','jitter');
      if (resultCard) 
        resultCard.style.border = '1px solid rgba(255,40,40,0.14)';
    } 
    else if (human > machine){
      if (titleEl) titleEl.textContent = 'CONTROL: HUMAN';
      if (textEl) textEl.textContent =
        `Outcome: You resisted automated shaping. YOU WIN.`;
      if (resultCard) 
        resultCard.style.border = '1px solid rgba(80,200,160,0.12)';
    } 
    else {
      if (titleEl) titleEl.textContent = 'CONTROL: TIED';
      if (textEl) textEl.textContent =
        `Outcome: Human and machine share influence.`;
      if (resultCard) 
        resultCard.style.border = '1px solid rgba(200,200,80,0.10)';
    }

    updateSliderOnPage();
  });

})();

