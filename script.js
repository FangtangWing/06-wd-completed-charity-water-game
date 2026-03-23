// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly

let timer = null;
let score = 0;
let timeLeft = 30; 
const badDropChance = 0.4;

const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const messageDisplay = document.getElementById("game-message");
const gameContainer = document.getElementById("game-container");

const winningMessages = [
  "🎉Good job. You win this game.🎉",
  "🎉Now you collect 20 drops in 30 seconds. You are the winner!🎉 ",
  "🎉Great work on water saving! Click the link on the pageto join us.🎉"
];

const losingMessages = [
  "Nice try. Next time you will win.",
  "Keep going. You can do it in next round!",
  "Don't give up! Click the link on the pageto join us."
];

function updateScoreDisplay() {
  scoreDisplay.textContent = String(score);
}
function updateTimeDisplay() {
  timeDisplay.textContent = String(timeLeft);
}

function getRandomMessage(messages) {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

function endGame() {
  gameRunning = false;
  clearInterval(timer);
  clearInterval(dropMaker);
  gameContainer.replaceChildren();

  if (score >= 20) {
    messageDisplay.textContent = getRandomMessage(winningMessages);
  } else {
    messageDisplay.textContent = getRandomMessage(losingMessages);
  }
}

updateScoreDisplay();
updateTimeDisplay();
messageDisplay.textContent = "";



// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  messageDisplay.textContent = "";

  // Create new drops every second (600 milliseconds)
  dropMaker = setInterval(createDrop, 600);
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft -= 1;
      updateTimeDisplay();
    } else {
      timeLeft = 0;
      updateTimeDisplay();
      endGame();
    }
  }, 1000);

  score = 0;
  timeLeft = 30;
  updateTimeDisplay();
  updateScoreDisplay();
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";
  const isBadDrop = Math.random() < badDropChance;

  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  drop.addEventListener("click", () => {
    if (drop.classList.contains("bad-drop")) { 
      score -= 2;
      if (score < 0) score = 0;
    } else {
      score += 1;
    }

    updateScoreDisplay();
    drop.remove();
  });

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
