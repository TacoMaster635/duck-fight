// DOM Elements
const fightBtn = document.getElementById('fightBtn');
const countDisplay = document.getElementById('countDisplay');
const unitLabel = document.getElementById('unitLabel');
const commentary = document.getElementById('commentary');
const duckEmoji = document.getElementById('duckEmoji');
const historyList = document.getElementById('historyList');

// Commentary pools based on duck count thresholds
const commentaries = {
    tiny: [
        "One (1) angry duck would systematically humiliate you.",
        "You tripped over your own shoelaces before the fight even started.",
        "A single duck stole your wallet and your dignity.",
        "Zero ducks. Let's be honest, a pigeon could take you."
    ],
    low: [
        "You might take a couple, but webed feet are your ultimate weakness.",
        "They formed a V-formation and dive-bombed your face.",
        "You put up a brave fight before being overwhelmed by quacks.",
        "Not great. You got out-strategized by birds with waterproof jackets."
    ],
    medium: [
        "Respectable! You held your ground against a respectable flock.",
        "You took down a solid squad before running out of stamina.",
        "A decent showing. The local pond will remember your name.",
        "You cleared out the beginner ranks, but the geese reinforcements arrived."
    ],
    high: [
        "Look at you! Absolute apex predator of the duck pond.",
        "You channeled your inner warrior and scattered a massive horde.",
        "Legendary battle skills. The ducks are migrating in fear of you.",
        "You fought valiantly against an unstoppable web-footed tidal wave!"
    ],
    godlike: [
        "GODLIKE! You could single-handedly conquer a migratory flock.",
        "The ducks bow down to their new supreme overlord.",
        "An unstoppable force of human power versus infinite feathers!",
        "You are the chosen one. No duck is safe."
    ]
};

let battleCount = 0;

// Random number generator helper (weighted slightly towards fun numbers)
function generateDuckCount() {
    const rand = Math.random();
    
    // Rare edge cases
    if (rand < 0.03) return 0;
    if (rand < 0.06) return 1;
    if (rand > 0.98) return Math.floor(Math.random() * 5000) + 1000; // Mega horde
    
    // Standard normal-ish distribution between 2 and 150
    return Math.floor(Math.random() * 148) + 2;
}

function getCommentary(count) {
    let pool;
    if (count === 0 || count === 1) {
        pool = commentaries.tiny;
    } else if (count < 10) {
        pool = commentaries.low;
    } else if (count < 50) {
        pool = commentaries.medium;
    } else if (count < 500) {
        pool = commentaries.high;
    } else {
        pool = commentaries.godlike;
    }
    return pool[Math.floor(Math.random() * pool.length)];
}

function recordHistory(count) {
    if (battleCount === 1) {
        historyList.innerHTML = ''; // Clear empty state message
    }

    const item = document.createElement('li');
    item.className = 'history-item';
    item.innerHTML = `<span>Battle #${battleCount}: ${count} ducks</span> <span>Just now</span>`;
    
    // Prepend to top of history
    historyList.prepend(item);

    // Keep history trimmed to max 5 items
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Main Button Event Handler
fightBtn.addEventListener('click', () => {
    battleCount++;
    
    // UI feedback animation
    fightBtn.disabled = true;
    duckEmoji.classList.add('quacking');
    countDisplay.textContent = "...";
    commentary.textContent = "Assessing the avian battlefield...";

    // Dramatic short delay before revealing result
    setTimeout(() => {
        const ducks = generateDuckCount();
        
        countDisplay.textContent = ducks.toLocaleString();
        unitLabel.textContent = ducks === 1 ? "Duck" : "Ducks";
        commentary.textContent = getCommentary(ducks);
        
        duckEmoji.classList.remove('quacking');
        fightBtn.disabled = false;

        recordHistory(ducks);
    }, 400);
});
