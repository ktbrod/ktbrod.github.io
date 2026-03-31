const API_BASE = "https://api.artic.edu/api/v1";
const IMAGE_BASE = "https://www.artic.edu/iiif/2";

const topics = ["landscape", "portrait", "flowers", "city", "animals"];

let topicIndex = 0;
let page = 1;
let artworks = [];
let artIndex = 0;
let currentArt = null;
let currentImage = null;
let statusText = "Loading artworks...";

function setup() {
  const canvas = createCanvas(min(windowWidth, 1100), min(windowHeight, 760));
  canvas.parent("sketch-root");
  textFont("Georgia");
  fetchArtworks();
}

function draw() {
  background("#f6f2e7");

  fill("#1f2a44");
  textAlign(LEFT, TOP);
  textSize(18);
  text("Art Institute of Chicago API Demo", 24, 18);

  textSize(13);
  text(
    `Topic: ${topics[topicIndex]} | Page: ${page} | Result: ${artIndex + 1}/${max(artworks.length, 1)}`,
    24,
    48
  );

  textSize(12);
  fill("#3b4455");
  text(
    "Keys: [Space] next artwork  [T] next topic  [N] next page  [R] reload",
    24,
    68
  );

  fill("#7a3e2d");
  text(statusText, 24, 90);

  const frameX = 24;
  const frameY = 120;
  const frameW = width - 48;
  const frameH = height - 230;

  noFill();
  stroke("#bcae8a");
  strokeWeight(3);
  rect(frameX, frameY, frameW, frameH);

  if (currentImage) {
    const margin = 14;
    const boxW = frameW - margin * 2;
    const boxH = frameH - margin * 2;
    const scale = min(boxW / currentImage.width, boxH / currentImage.height);
    const drawW = currentImage.width * scale;
    const drawH = currentImage.height * scale;
    const x = frameX + (frameW - drawW) / 2;
    const y = frameY + (frameH - drawH) / 2;

    noStroke();
    image(currentImage, x, y, drawW, drawH);
  }

  if (currentArt) {
    const captionY = height - 100;
    fill("#1f2a44");
    noStroke();
    textSize(16);
    text(currentArt.title || "Untitled", 24, captionY);

    textSize(13);
    fill("#3b4455");
    const artist = currentArt.artist_display || "Unknown artist";
    const date = currentArt.date_display || "Unknown date";
    text(`${artist} | ${date}`, 24, captionY + 24);

    fill("#55617a");
    text(`API endpoint: ${buildApiUrl()}`, 24, captionY + 48, width - 48, 70);
  }
}

function keyPressed() {
  if (key === " ") {
    showNextArtwork();
  }

  if (key === "t" || key === "T") {
    topicIndex = (topicIndex + 1) % topics.length;
    page = 1;
    fetchArtworks();
  }

  if (key === "n" || key === "N") {
    page += 1;
    fetchArtworks();
  }

  if (key === "r" || key === "R") {
    fetchArtworks();
  }
}

function windowResized() {
  resizeCanvas(min(windowWidth, 1100), min(windowHeight, 760));
}

async function fetchArtworks() {
  statusText = "Fetching data...";
  currentImage = null;

  try {
    const response = await fetch(buildApiUrl());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    artworks = (payload.data || []).filter((item) => item.image_id);

    if (!artworks.length) {
      currentArt = null;
      statusText = "No artworks with images on this page. Press N for another page.";
      return;
    }

    artIndex = 0;
    showArtwork(artworks[artIndex]);
    statusText = `Loaded ${artworks.length} artworks.`;
  } catch (error) {
    currentArt = null;
    statusText = `Request failed: ${error.message}`;
  }
}

function showNextArtwork() {
  if (!artworks.length) {
    statusText = "No data loaded yet. Press R to retry.";
    return;
  }

  artIndex = (artIndex + 1) % artworks.length;
  showArtwork(artworks[artIndex]);
}

function showArtwork(artwork) {
  currentArt = artwork;
  currentImage = null;
  statusText = `Loading image: ${artwork.title || "Untitled"}`;

  const imageUrl = `${IMAGE_BASE}/${artwork.image_id}/full/843,/0/default.jpg`;
  loadImage(
    imageUrl,
    (img) => {
      currentImage = img;
      statusText = `Showing: ${artwork.title || "Untitled"}`;
    },
    () => {
      statusText = "Image failed to load. Press Space for the next artwork.";
    }
  );
}

function buildApiUrl() {
  const topic = encodeURIComponent(topics[topicIndex]);
  const fields = encodeURIComponent("id,title,artist_display,date_display,image_id");
  return `${API_BASE}/artworks/search?q=${topic}&query[term][is_public_domain]=true&fields=${fields}&limit=12&page=${page}`;
}
