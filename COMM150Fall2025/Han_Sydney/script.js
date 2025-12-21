//Minimum 2 Javascript Functions

// Function 1: Navigate to seeds page from main button
function goToSeeds() {
  window.location.href = "seeds.html";
}

// Function 2: Show care info when a plant is clicked
function showPlantInfo(name) {
  const careText = document.getElementById("careText");
  let message = "";

  switch (name) {
    case "Olive Tree":
      message =
        "Olive Tree:<br>Needs moderate sunlight and water once every 2–3 days. Allow the top soil to dry slightly.";
      break;
    case "Tulip":
      message =
        "Tulip:<br>Prefers bright, indirect light and lightly moist soil. Great for quick growth.";
      break;
    case "Sunflower":
      message = 
        "Sunflower:<br>Prefers hot climate, moist soil but dry in between watering, slow grower.";
        break;
    case "Red Carnation":
      message =
        "Red Carnation:<br>Low-maintenance foliage plant that can handle medium light and weekly watering.";
      break;
    case "Hydrangea":
      message =
        "Hydrangea:<br>Loves bright, indirect light and regular misting to keep leaves fresh.";
      break;
    case "Basil Plant":
      message =
        "Basil Plant:<br>Very hardy, tolerates low light and infrequent watering. Avoid overwatering.";
      break;
    default:
      message =
        name +
        ":<br>Click different plants and tools to learn how they support your Zen Garden.";
  }

  careText.innerHTML = message;
}

// Function 3: Watering counter
let waterCount = 0;
function waterGarden() {
  waterCount++;
  const countSpan = document.getElementById("waterCount");
  countSpan.textContent = waterCount;
}

// additional skill Function: Toggle dark/light garden theme
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}


function handlePlantClick(imgElement, name) {
  showPlantInfo(name);
  swapPlantImage(imgElement);
}

function cyclePlantImages(imgElement, name) {
  showPlantInfo(name);

  const images = imgElement.getAttribute("data-images").split(",");

  let index = parseInt(imgElement.getAttribute("data-index")) || 0;

  index = (index + 1) % images.length; 

  imgElement.src = images[index];

  imgElement.setAttribute("data-index", index);
}

