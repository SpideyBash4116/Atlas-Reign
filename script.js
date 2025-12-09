// =======================
//    Atlas Reign Alpha
// =======================

// Main country data
let country = {
    population: 2300,
    economy: 80,
    happiness: 70,
    military: 40,
    environment: 60,
    year: 1
};

// Active laws list
let activeLaws = [];

// Clamp helper
function clamp(v) {
    return Math.max(0, Math.min(100, v));
}

// Add news entry
function addNews(msg) {
    let div = document.getElementById("news");
    let p = document.createElement("p");
    p.textContent = `[Year ${country.year}] ${msg}`;
    div.appendChild(p);
    div.scrollTop = div.scrollHeight;
}

// Render stats on screen
function updateUI() {

    document.getElementById("population").textContent = country.population;

    document.getElementById("economy-bar").style.width = country.economy + "%";
    document.getElementById("economy-tip").textContent = `${country.economy}/100 (${country.economy}%)`;
    document.getElementById("happiness-bar").style.width = country.happiness + "%";
    document.getElementById("happiness-tip").textContent = `${country.happiness}/100 (${country.happiness}%)`;
    document.getElementById("military-bar").style.width = country.military + "%";
    document.getElementById("military-tip").textContent = `${country.military}/100 (${country.military}%)`;
    document.getElementById("environment-bar").style.width = country.environment + "%";
    document.getElementById("environment-tip").textContent = `${country.environment}/100 (${country.environment}%)`;
}

// Simple map generator
function drawMap() {
    let c = document.getElementById("map");
    let ctx = c.getContext("2d");

    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            ctx.fillStyle = `rgb(${200 - x*10}, ${150 + y*5}, 150)`;
            ctx.fillRect(x * 30, y * 30, 30, 30);
        }
    }
}

// Law effects
function enactLaw(type) {
    let law = null;

    if (type === "environment") {
        law = { name: "Environmental Protection Act", duration: 5, environment: +3, economy: -2 };
        addNews("Environmental Protection Act passed.");
    }
    else if (type === "economy") {
        law = { name: "Tax Incentive Program", duration: 4, economy: +4, happiness: -1 };
        addNews("Tax Incentive Program passed.");
    }
    else if (type === "military") {
        law = { name: "Mandatory Military Service", duration: 6, military: +4, happiness: -3 };
        addNews("Mandatory Military Service enacted.");
    }

    activeLaws.push(law);
    refreshLawsUI();
}

// Refresh active law list
function refreshLawsUI() {
    let ul = document.getElementById("active-laws");
    ul.innerHTML = "";
    activeLaws.forEach(l => {
        let li = document.createElement("li");
        li.textContent = `${l.name} (Years left: ${l.duration})`;
        ul.appendChild(li);
    });
}

function startFestival(type) {
    let msg = "";
    switch(type) {
        case "cultural":
            country.happiness += 10;
            country.economy -= 3;
            msg = "Cultural Festival celebrated! Happiness +10, Economy -3";
            break;
        case "music":
            country.happiness += 8;
            country.economy -= 2;
            country.environment -= 1;
            msg = "Music Festival celebrated! Happiness +8, Economy -2, Environment -1";
            break
        case "eco":
            country.happiness += 5;
            country.economy -= 2;
            country.environment += 3;
            msg = "Eco Festival celebrated! Happiness +5, Economy -2, Environment +3";
            break;
    }
}

// Turn calculation
function nextTurn() {

    // Base population growth
    country.population += Math.floor(country.population * 0.02);

    // Apply laws
    activeLaws.forEach(l => {
        if (l.economy) country.economy += l.economy;
        if (l.happiness) country.happiness += l.happiness;
        if (l.military) country.military += l.military;
        if (l.environment) country.environment += l.environment;

        l.duration -= 1;
    });

    // Remove expired laws
    activeLaws = activeLaws.filter(l => l.duration > 0);
    refreshLawsUI();

    // Clamp stats
    country.economy = clamp(country.economy);
    country.happiness = clamp(country.happiness);
    country.military = clamp(country.military);
    country.environment = clamp(country.environment);

    // News summary
    addNews("A new year begins. The nation continues to evolve.");
    addNews(msg)

    country.year++;
    updateUI();
}

// Initialize
window.onload = function() {
    drawMap();
    updateUI();
    addNews("Welcome to Atlas Reign. Your nation awaits your command.");
};

document.getElementById("nextTurn").onclick = nextTurn;
