const fightBtn = document.getElementById("fightBtn");
const countDisplay = document.getElementById("countDisplay");
const unitLabel = document.getElementById("unitLabel");
const commentary = document.getElementById("commentary");
const duckEmoji = document.getElementById("duckEmoji");
const enemyBadge = document.getElementById("enemyBadge");
const historyList = document.getElementById("historyList");

const accountButton = document.getElementById("accountButton");
const accountMenu = document.getElementById("accountMenu");
const closeAccountButton = document.getElementById("closeAccountButton");
const saveNameButton = document.getElementById("saveNameButton");
const resetStatsButton = document.getElementById("resetStatsButton");
const playerNameInput = document.getElementById("playerName");
const welcomeMessage = document.getElementById("welcomeMessage");
const totalDucksFought = document.getElementById("totalDucksFought");
const duckTypeStats = document.getElementById("duckTypeStats");
const achievementList = document.getElementById("achievementList");
const achievementToast = document.getElementById("achievementToast");
const toastName = document.getElementById("toastName");
const toastEmoji = document.getElementById("toastEmoji");

const duckTypes = [
  {
    name: "Standard Mallard",
    emoji: "🦆",
    weight: 0.399,
    modifier: (base) => base,
    comment: "A classic baseline flock. Fair fight!"
  },
  {
    name: "Angry Goose",
    emoji: "🦢",
    weight: 0.2,
    modifier: (base) => Math.max(1, Math.floor(base * 0.3)),
    comment: "WARNING: Geese are pure chaos. Your score plummeted!"
  },
  {
    name: "Rubber Duck",
    emoji: "🛀",
    weight: 0.15,
    modifier: (base) => base * 5,
    comment: "Squeaky clean victory! Zero threat, massive numbers."
  },
  {
    name: "Cyber Duck",
    emoji: "🤖",
    weight: 0.15,
    modifier: (base) => base * 2,
    comment: "A mechanical menace from the future. High tech feathers!"
  },
  {
    name: "Wizard Duck",
    emoji: "🧙‍♂️",
    weight: 0.1,
    modifier: () => Math.floor(Math.random() * 900) + 100,
    comment: "Abracadabra! The wizard duck altered reality itself."
  },
  {
    name: "Cosmic Duck",
    emoji: "🌌",
    weight: 0.001,
    modifier: () => Math.floor(Math.random() * 987654321),
    comment: "It's from out of this world!"
  }
];

const achievementsData = [
  {
    id: "first_fight",
    name: "First Blood",
    desc: "Complete your very first duck battle.",
    emoji: "🐣",
    check: (p) => p.totalDucksFought > 0
  },
  {
    id: "flock_master",
    name: "Flock Master",
    desc: "Accumulate 1,000 total ducks fought.",
    emoji: "🦆",
    check: (p) => p.totalDucksFought >= 1000
  },
  {
    id: "avian_overlord",
    name: "Avian Overlord",
    desc: "Accumulate 50,000 total ducks fought.",
    emoji: "👑",
    check: (p) => p.totalDucksFought >= 50000
  },
  {
    id: "rubber_squeezer",
    name: "Squeaky Clean",
    desc: "Encounter and defeat a Rubber Duck.",
    emoji: "🛀",
    check: (p) => p.ducksByType["Rubber Duck"] > 0
  },
  {
    id: "spell_bound",
    name: "Hogwarts Graduate",
    desc: "Encounter a Wizard Duck.",
    emoji: "🧙‍♂️",
    check: (p) => p.ducksByType["Wizard Duck"] > 0
  },
  {
    id: "star_gazer",
    name: "Stargazer",
    desc: "Encounter the rare Cosmic Duck.",
    emoji: "🌌",
    check: (p) => p.ducksByType["Cosmic Duck"] > 0
  }
];

const duckTypeNames = duckTypes.map((duckType) => duckType.name);
const DUCK_FIGHT_SAVE_KEY = "duckFight_playerData_v2";
const FIGHT_COOLDOWN = 800;

let battleCount = 0;
let fightInProgress = false;
let lastFightTime = 0;
let toastTimeout = null;

function createNewPlayerData() {
  const duckCounts = {};
  for (const duckName of duckTypeNames) {
    duckCounts[duckName] = 0;
  }

  return {
    name: "Duck Fighter",
    totalDucksFought: 0,
    ducksByType: duckCounts,
    achievements: {}
  };
}

function loadPlayerData() {
  const savedData = localStorage.getItem(DUCK_FIGHT_SAVE_KEY);

  if (!savedData) {
    return createNewPlayerData();
  }

  try {
    const parsedData = JSON.parse(savedData);
    const loadedData = createNewPlayerData();

    if (typeof parsedData.name === "string" && parsedData.name.trim() !== "") {
      loadedData.name = parsedData.name.trim();
    }

    if (typeof parsedData.totalDucksFought === "number" && parsedData.totalDucksFought >= 0) {
      loadedData.totalDucksFought = parsedData.totalDucksFought;
    }

    for (const duckName of duckTypeNames) {
      const savedCount = parsedData.ducksByType?.[duckName];
      if (typeof savedCount === "number" && savedCount >= 0) {
        loadedData.ducksByType[duckName] = savedCount;
      }
    }

    if (parsedData.achievements && typeof parsedData.achievements === "object") {
      loadedData.achievements = parsedData.achievements;
    }

    return loadedData;
  } catch (error) {
    console.error("Could not load Duck Fight save:", error);
    return createNewPlayerData();
  }
}

let playerData = loadPlayerData();

function savePlayerData() {
  localStorage.setItem(DUCK_FIGHT_SAVE_KEY, JSON.stringify(playerData));
}

function showAchievementToast(achievement) {
  toastEmoji.textContent = achievement.emoji;
  toastName.textContent = achievement.name;
  achievementToast.classList.remove("hidden");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    achievementToast.classList.add("hidden");
  }, 3500);
}

function checkAchievements() {
  let newlyUnlocked = false;

  for (const ach of achievementsData) {
    if (!playerData.achievements[ach.id] && ach.check(playerData)) {
      playerData.achievements[ach.id] = true;
      showAchievementToast(ach);
      newlyUnlocked = true;
    }
  }

  if (newlyUnlocked) {
    savePlayerData();
  }
}

function recordDuckFight(duckName, amount) {
  if (!duckTypeNames.includes(duckName)) return;
  if (!Number.isInteger(amount) || amount < 0) return;

  playerData.totalDucksFought += amount;
  playerData.ducksByType[duckName] += amount;

  checkAchievements();
  savePlayerData();
  updateAccountMenu();
}

function updateAccountMenu() {
  welcomeMessage.textContent = `Welcome, ${playerData.name}!`;
  totalDucksFought.textContent = playerData.totalDucksFought.toLocaleString();

  duckTypeStats.replaceChildren();
  for (const duckType of duckTypes) {
    const statRow = document.createElement("div");
    statRow.className = "duck-stat";

    const duckName = document.createElement("span");
    duckName.textContent = `${duckType.emoji} ${duckType.name}`;

    const duckAmount = document.createElement("strong");
    duckAmount.textContent = playerData.ducksByType[duckType.name].toLocaleString();

    statRow.append(duckName, duckAmount);
    duckTypeStats.appendChild(statRow);
  }

  achievementList.replaceChildren();
  for (const ach of achievementsData) {
    const isUnlocked = !!playerData.achievements[ach.id];

    const achItem = document.createElement("div");
    achItem.className = `achievement-badge-item ${isUnlocked ? "unlocked" : ""}`;

    const iconDiv = document.createElement("div");
    iconDiv.className = "achievement-icon";
    iconDiv.textContent = isUnlocked ? ach.emoji : "🔒";

    const infoDiv = document.createElement("div");
    infoDiv.className = "achievement-info";

    const titleSpan = document.createElement("span");
    titleSpan.className = "achievement-name";
    titleSpan.textContent = ach.name;

    const descSpan = document.createElement("span");
    descSpan.className = "achievement-desc";
    descSpan.textContent = ach.desc;

    infoDiv.append(titleSpan, descSpan);
    achItem.append(iconDiv, infoDiv);
    achievementList.appendChild(achItem);
  }
}

function savePlayerName() {
  const newName = playerNameInput.value.trim();
  if (newName === "") {
    alert("Please enter a fighter name.");
    return;
  }

  playerData.name = newName;
  playerNameInput.value = "";

  savePlayerData();
  updateAccountMenu();
}

function openAccountMenu() {
  accountMenu.classList.remove("hidden");
  playerNameInput.value = playerData.name;
  updateAccountMenu();
}

function closeAccountMenu() {
  accountMenu.classList.add("hidden");
}

function resetPlayerStats() {
  const shouldReset = window.confirm("Reset your local Duck Fight stats and achievements? This cannot be undone.");
  if (!shouldReset) return;

  const savedName = playerData.name;
  playerData = createNewPlayerData();
  playerData.name = savedName;

  savePlayerData();
  updateAccountMenu();
}

function getRandomDuckType() {
  const randomNumber = Math.random();
  let cumulativeWeight = 0;

  for (const duckType of duckTypes) {
    cumulativeWeight += duckType.weight;
    if (randomNumber <= cumulativeWeight) {
      return duckType;
    }
  }

  return duckTypes[0];
}

function generateBaseDuckCount() {
  const randomNumber = Math.random();
  if (randomNumber < 0.03) return 0;
  if (randomNumber < 0.06) return 1;
  return Math.floor(Math.random() * 148) + 2;
}

function recordHistory(duckName, count) {
  if (battleCount === 1) {
    historyList.replaceChildren();
  }

  const item = document.createElement("li");
  item.className = "history-item";

  const result = document.createElement("span");
  result.textContent = `${duckName}: ${count.toLocaleString()}`;

  const time = document.createElement("span");
  time.textContent = "Just now";

  item.append(result, time);
  historyList.prepend(item);

  if (historyList.children.length > 5) {
    historyList.lastElementChild.remove();
  }
}

function startFight() {
  const now = Date.now();
  if (now - lastFightTime < FIGHT_COOLDOWN) return;
  if (fightInProgress) return;

  lastFightTime = now;
  fightInProgress = true;
  battleCount++;

  fightBtn.disabled = true;
  duckEmoji.classList.add("quacking");

  countDisplay.textContent = "...";
  enemyBadge.textContent = "Scanning Target...";
  commentary.textContent = "Assessing the avian battlefield...";

  setTimeout(() => {
    const selectedType = getRandomDuckType();
    const baseCount = generateBaseDuckCount();
    const finalCount = Math.floor(selectedType.modifier(baseCount));

    duckEmoji.textContent = selectedType.emoji;
    enemyBadge.textContent = `Target: ${selectedType.name}`;
    countDisplay.textContent = finalCount.toLocaleString();
    unitLabel.textContent = finalCount === 1 ? "Duck" : "Ducks";
    commentary.textContent = selectedType.comment;

    recordHistory(selectedType.name, finalCount);
    recordDuckFight(selectedType.name, finalCount);

    duckEmoji.classList.remove("quacking");
    fightBtn.disabled = false;
    fightInProgress = false;
  }, 450);
}

fightBtn.addEventListener("click", startFight);

document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isTyping = activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";

  if (event.code === "Space" && !event.repeat && !isTyping) {
    event.preventDefault();
    startFight();
  }

  if (event.key === "Escape" && !accountMenu.classList.contains("hidden")) {
    closeAccountMenu();
  }
});

accountButton.addEventListener("click", openAccountMenu);
closeAccountButton.addEventListener("click", closeAccountMenu);
saveNameButton.addEventListener("click", savePlayerName);
resetStatsButton.addEventListener("click", resetPlayerStats);

playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    savePlayerName();
  }
});

accountMenu.addEventListener("click", (event) => {
  if (event.target === accountMenu) {
    closeAccountMenu();
  }
});

// Initial load check
checkAchievements();
updateAccountMenu();
