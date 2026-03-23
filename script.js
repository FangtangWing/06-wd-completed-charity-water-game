// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly

let timer = null;
let score = 0;
let timeLeft = 30; 
const defaultBadDropChance = 0.4;
const defaultGoal = 20;

const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const goalDisplay = document.getElementById("goal");
const difficultySelect = document.getElementById("difficulty-select");
const messageDisplay = document.getElementById("game-message");
const gameContainer = document.getElementById("game-container");

let currentDifficulty = difficultySelect ? difficultySelect.value : "normal";

const difficultyDisplaySettings = {
  easy: { initialTime: 35, goalScore: 12, badDropChance: 0.3, dropIntervalMs: 750, badDropPenalty: 1 },
  normal: { initialTime: 30, goalScore: 20, badDropChance: 0.4, dropIntervalMs: 600, badDropPenalty: 2 },
  hard: { initialTime: 22, goalScore: 26, badDropChance: 0.5, dropIntervalMs: 470, badDropPenalty: 3 }
};

// Update the goal score and initial time display
function updateDifficultyPreview() {
  const settings = difficultyDisplaySettings[currentDifficulty];
  if (!settings) return;
  if (goalDisplay) {
    goalDisplay.textContent = String(getGoalScore());
  }
  if (!gameRunning) {
    timeLeft = settings.initialTime;
    updateTimeDisplay();
  }
}

function setCurrentDifficulty(value) {
  if (value !== "easy" && value !== "normal" && value !== "hard") return;
  currentDifficulty = value;
}

function getBadDropChance() {
  return difficultyDisplaySettings[currentDifficulty]?.badDropChance || defaultBadDropChance;
}

function getGoalScore() {
  return difficultyDisplaySettings[currentDifficulty]?.goalScore || defaultGoal;
}

function getDropInterval() {
  return difficultyDisplaySettings[currentDifficulty]?.dropIntervalMs || 600;
}


function getBadDropPenalty() {
  return difficultyDisplaySettings[currentDifficulty]?.badDropPenalty || 2;
}

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
  
  // Unlock difficulty selection after game ends
  if (difficultySelect) {
    difficultySelect.disabled = false;
  }

  if (score >= getGoalScore()) {
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
if (difficultySelect) {
  difficultySelect.addEventListener("change", (event) => {
    setCurrentDifficulty(event.target.value);
    updateDifficultyPreview();
  });
}

updateDifficultyPreview();

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  messageDisplay.textContent = "";
  
  // Lock difficulty selection during gameplay
  if (difficultySelect) {
    difficultySelect.disabled = true;
  }

  // Create new drops at difficulty-based interval
  dropMaker = setInterval(createDrop, getDropInterval());
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
  const isBadDrop = Math.random() < getBadDropChance();

  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  drop.addEventListener("click", () => {
    if (drop.classList.contains("bad-drop")) { 
      score -= getBadDropPenalty();
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
