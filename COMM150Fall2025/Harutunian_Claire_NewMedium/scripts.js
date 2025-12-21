function changeBackgroundColor() {
  document.body.style.backgroundColor = "lightblue"
}

function displayCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    document.getElementById('dateDisplay').innerHTML = formattedDate;
}

window.onload = displayCurrentDate;

/*additional skill!*/
function calculatePercentage() {
  let userInput = prompt("Welcome to New Medium: A Digital Board Game. On a scale of 1 to 10, how excited are you to play?");

  let number = parseFloat(userInput);

  let percentage = number * 10;

  alert(`Your excitement percentage: ${percentage}%. Enjoy the game!`);
}