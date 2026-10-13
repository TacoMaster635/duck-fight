// DOM Elements
const fightBtn = document.getElementById('fightBtn');
const countDisplay = document.getElementById('countDisplay');
const unitLabel = document.getElementById('unitLabel');
const commentary = document.getElementById('commentary');
const duckEmoji = document.getElementById('duckEmoji');
const enemyBadge = document.getElementById('enemyBadge');
const historyList = document.getElementById('historyList');

// Duck Class Definitions (Weights now correctly total 1.0)
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
        weight: 0.20,
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
        weight: 0.10,
        modifier: (base) => Math.floor(Math.random() * 900) + 100,
        comment: "Abracadabra! The wizard duck altered reality itself."
    },
    {
        name: "Cosmic Duck",
        emoji: "🌌",
        weight: 0.001,
        modifier: (base) => Math.floor(Math.random() * 987654321),
        comment: "It's from out of this world!"
    }
];

let battleCount = 0;


const DUCK_FIGHT_SAVE_KEY = "duckFight_playerData_v1";


const duckTypes = [
  "Standard Mallard"
  "Angry Goose",
  "Rubber Duck",
  "Cyber Duck",
  "Wizard Duck",
  "Cosmic Duck"
];

function createNewPlayerData() {
  const duckCounts = {};

  for (const duckType of duckTypes) {
    duckCounts[duckType] = 0;
  }

  return {
    name: "Duck Fighter",
    totalDucksFought: 0,
    ducksByType: duckCounts
  };
}

function loadPlayerData() {
  const savedData = localStorage.getItem(DUCK_FIGHT_SAVE_KEY);

  if (savedData === null) {
    return createNewPlayerData();
  }

  try {
    const parsedData = JSON.parse(savedData);
    const defaultData = createNewPlayerData();


    for (const duckType of duckTypes) {
      if (
        !parsedData.ducksByType ||
        typeof parsedData.ducksByType[duckType] !== "number"
      ) {
        defaultData.ducksByType[duckType] = 0;
      } else {
        defaultData.ducksByType[duckType] =
          parsedData.ducksByType[duckType];
      }
    }

    if (
      typeof parsedData.name === "string" &&
      parsedData.name.trim() !== ""
    ) {
      defaultData.name = parsedData.name;
    }

    if (typeof parsedData.totalDucksFought === "number") {
      defaultData.totalDucksFought =
        parsedData.totalDucksFought;
    }

    return defaultData;
  } catch (error) {
    console.error("Duck Fight save could not be loaded:", error);
    return createNewPlayerData();
  }
}

function savePlayerData() {
  localStorage.setItem(
    DUCK_FIGHT_SAVE_KEY,
    JSON.stringify(playerData)
  );
}

let playerData = loadPlayerData();

/*
  Call this whenever the player fights ducks.

  Example:
  recordDuckFight("Rare Duck", 7);
*/
function recordDuckFight(duckType, amount = 1) {
  if (!duckTypes.includes(duckType)) {
    console.error(`Unknown duck type: ${duckType}`);
    return;
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    console.error("Duck amount must be a positive whole number.");
    return;
  }

  playerData.totalDucksFought += amount;
  playerData.ducksByType[duckType] += amount;

  savePlayerData();
  updateAccountMenu();
}

function updateAccountMenu() {
  const welcomeMessage =
    document.getElementById("welcomeMessage");

  const totalDucksFought =
    document.getElementById("totalDucksFought");

  const duckTypeStats =
    document.getElementById("duckTypeStats");

  welcomeMessage.textContent = `Welcome, ${playerData.name}!`;

  totalDucksFought.textContent =
    playerData.totalDucksFought.toLocaleString();

  duckTypeStats.replaceChildren();

  for (const duckType of duckTypes) {
    const statRow = document.createElement("div");
    statRow.className = "duck-stat";

    const duckName = document.createElement("span");
    duckName.textContent = duckType;

    const duckAmount = document.createElement("strong");
    duckAmount.textContent =
      playerData.ducksByType[duckType].toLocaleString();

    statRow.append(duckName, duckAmount);
    duckTypeStats.appendChild(statRow);
  }
}

function savePlayerName() {
  const playerNameInput =
    document.getElementById("playerName");

  const newName = playerNameInput.value.trim();

  if (newName === "") {
    alert("Please enter a fighter name.");
    return;
  }

  playerData.name = newName;
  savePlayerData();
  updateAccountMenu();

  playerNameInput.value = "";
}

function openAccountMenu() {
  document
    .getElementById("accountMenu")
    .classList.remove("hidden");

  updateAccountMenu();
}

function closeAccountMenu() {
  document
    .getElementById("accountMenu")
    .classList.add("hidden");
}

function resetPlayerStats() {
  const shouldReset = window.confirm(
    "Reset your local Duck Fight stats? This cannot be undone."
  );

  if (!shouldReset) {
    return;
  }

  const savedName = playerData.name;

  playerData = createNewPlayerData();
  playerData.name = savedName;

  savePlayerData();
  updateAccountMenu();
}

document
  .getElementById("accountButton")
  .addEventListener("click", openAccountMenu);

document
  .getElementById("closeAccountButton")
  .addEventListener("click", closeAccountMenu);

document
  .getElementById("saveNameButton")
  .addEventListener("click", savePlayerName);

document
  .getElementById("resetStatsButton")
  .addEventListener("click", resetPlayerStats);

document
  .getElementById("playerName")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      savePlayerName();
    }
  });

document
  .getElementById("accountMenu")
  .addEventListener("click", function (event) {
    if (event.target.id === "accountMenu") {
      closeAccountMenu();
    }
  });

updateAccountMenu();


function getRandomDuckType() {
    const rand = Math.random();
    let cumulativeWeight = 0;
    
    for (const type of duckTypes) {
        cumulativeWeight += type.weight;
        if (rand <= cumulativeWeight) {
            return type;
        }
    }
    return duckTypes[0]; // Fallback
}

function generateBaseDuckCount() {
    const rand = Math.random();
    if (rand < 0.03) return 0;
    if (rand < 0.06) return 1;
    return Math.floor(Math.random() * 148) + 2;
}

function recordHistory(className, count) {
    if (battleCount === 1) {
        historyList.innerHTML = ''; 
    }

    const item = document.createElement('li');
    item.className = 'history-item';
    item.innerHTML = `<span>${className}: ${count}</span> <span>Just now</span>`;
    
    historyList.prepend(item);

    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Main Button Event Handler
fightBtn.addEventListener('click', () => {
    battleCount++;
    
    fightBtn.disabled = true;
    duckEmoji.classList.add('quacking');
    countDisplay.textContent = "...";
    enemyBadge.textContent = "Scanning Target...";
    commentary.textContent = "Assessing the avian battlefield...";

    setTimeout(() => {
        const selectedType = getRandomDuckType();
        const baseCount = generateBaseDuckCount();
        const finalCount = selectedType.modifier(baseCount);

        // Update UI with class specifics
        duckEmoji.textContent = selectedType.emoji;
        enemyBadge.textContent = `Target: ${selectedType.name}`;
        countDisplay.textContent = finalCount.toLocaleString();
        unitLabel.textContent = finalCount === 1 ? "Duck" : "Ducks";
        commentary.textContent = selectedType.comment;
        
        duckEmoji.classList.remove('quacking');
        fightBtn.disabled = false;

        recordHistory(selectedType.name, finalCount);
    }, 450);
});

document.addEventListener('keydown', (e) => {
    if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        battleCount++;
        
        fightBtn.disabled = true;
        duckEmoji.classList.add('quacking');
        countDisplay.textContent = "...";
        enemyBadge.textContent = "Scanning Target...";
        commentary.textContent = "Assessing the avian battlefield...";
    
        setTimeout(() => {
            const selectedType = getRandomDuckType();
            const baseCount = generateBaseDuckCount();
            const finalCount = selectedType.modifier(baseCount);
    
            // Update UI with class specifics
            duckEmoji.textContent = selectedType.emoji;
            enemyBadge.textContent = `Target: ${selectedType.name}`;
            countDisplay.textContent = finalCount.toLocaleString();
            unitLabel.textContent = finalCount === 1 ? "Duck" : "Ducks";
            commentary.textContent = selectedType.comment;
            
            duckEmoji.classList.remove('quacking');
            fightBtn.disabled = false;
    
            recordHistory(selectedType.name, finalCount);
        }, 450);
    }
});
