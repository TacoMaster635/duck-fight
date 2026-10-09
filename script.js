// DOM Elements
const fightBtn = document.getElementById('fightBtn');
const countDisplay = document.getElementById('countDisplay');
const unitLabel = document.getElementById('unitLabel');
const commentary = document.getElementById('commentary');
const duckEmoji = document.getElementById('duckEmoji');
const enemyBadge = document.getElementById('enemyBadge');
const historyList = document.getElementById('historyList');

// Duck Class Definitions
const duckTypes = [
    {
        name: "Standard Mallard",
        emoji: "🦆",
        weight: 0.40, // 40% chance
        modifier: (base) => base,
        comment: "A classic baseline flock. Fair fight!"
    },
    {
        name: "Angry Goose",
        emoji: "🦢",
        weight: 0.20, // 20% chance
        modifier: (base) => Math.max(1, Math.floor(base * 0.3)), // Geese cut your score down!
        comment: "WARNING: Geese are pure chaos. Your score plummeted!"
    },
    {
        name: "Rubber Duck",
        emoji: "🛀",
        weight: 0.15, // 15% chance
        modifier: (base) => base * 5, // Massive bonus
        comment: "Squeaky clean victory! Zero threat, massive numbers."
    },
    {
        name: "Cyber Duck",
        emoji: "🤖",
        weight: 0.15, // 15% chance
        modifier: (base) => base * 2,
        comment: "A mechanical menace from the future. High tech feathers!"
    },
    {
        name: "Wizard Duck",
        emoji: "🧙‍♂️",
        weight: 0.10, // 10% chance
        modifier: (base) => Math.floor(Math.random() * 900) + 100, // Chaotic random high score
        comment: "Abracadabra! The wizard duck altered reality itself."
    }
];

let battleCount = 0;

function getRandomDuckType() {
    const rand = Math.random();
    let cumulativeWeight = 0;
    for (const type of duckTypes) {
        cumulativeWeight += type.weight;
        if (rand <= cumulativeWeight) {
            return type;
        }
    }
    return duckTypes[0];
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
