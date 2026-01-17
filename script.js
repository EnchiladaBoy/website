// ===== PART 1: Radial Glitch Effect =====
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+";
const glitchRadius = 150; // Distance in pixels to trigger the effect

// 1. Prepare the text: wrap every character in a span so we can target them individually
document.querySelectorAll('[data-value]').forEach(element => {
    const text = element.dataset.value;
    element.innerHTML = text.split("").map((char, i) => {
        // We use a data-char attribute to remember the original letter
        return `<span class="glitch-char" data-char="${char}">${char}</span>`;
    }).join("");
});

// 2. Track mouse movement to trigger the effect
const container = document.querySelector('.container');

container.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    document.querySelectorAll('.glitch-char').forEach(span => {
        const rect = span.getBoundingClientRect();
        // Calculate center of the character
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        // Calculate distance between mouse and character
        const dist = Math.hypot(mouseX - charX, mouseY - charY);

        // If the character is close to the mouse and not already glitching
        if (dist < glitchRadius && !span.dataset.glitching) {
            triggerGlitch(span);
        }
    });
});

function triggerGlitch(span) {
    span.dataset.glitching = "true";
    const originalChar = span.dataset.char;
    let iterations = 0;
    
    // Determine speed based on if it's a space or text (spaces are faster)
    const maxIterations = 10; 

    const interval = setInterval(() => {
        // Random character
        span.innerText = letters[Math.floor(Math.random() * letters.length)];

        // Resolve back to original
        if (iterations >= maxIterations) {
            span.innerText = originalChar;
            span.dataset.glitching = ""; // Allow it to be triggered again
            clearInterval(interval);
        }
        
        iterations += 1;
    }, 30);
}


// ===== PART 2: Interactive Void Logic (Unchanged) =====
const enterLink = document.getElementById('enter-link');
const mainContent = document.getElementById('main-content');
const voidContainer = document.getElementById('void-container');
const voidTexts = document.querySelectorAll('.void-text');

const spotlightRadius = 175;
const teleportBuffer = 50;

let currentSpotlight = { x: 0, y: 0 };

function isPositionOccupied(newRect, currentWord) {
    for (const word of voidTexts) {
        if (word === currentWord) continue;
        const existingRect = word.getBoundingClientRect();
        const overlap = !(newRect.right < existingRect.left || 
                          newRect.left > existingRect.right || 
                          newRect.bottom < existingRect.top || 
                          newRect.top > existingRect.bottom);
        if (overlap) {
            return true;
        }
    }
    return false;
}

function repositionWord(word) {
    let newX, newY, newRect, isOccupied, isInSpotlight;
    let safetyCounter = 0;

    do {
        newX = Math.random() * 70 + 15;
        newY = Math.random() * 70 + 15;

        const tempWord = word.cloneNode(true);
        tempWord.style.left = `${newX}%`;
        tempWord.style.top = `${newY}%`;
        voidContainer.appendChild(tempWord);
        newRect = tempWord.getBoundingClientRect();
        voidContainer.removeChild(tempWord);
        
        isOccupied = isPositionOccupied(newRect, word);
        
        const newCenterX = newRect.left + newRect.width / 2;
        const newCenterY = newRect.top + newRect.height / 2;
        const distanceToSpotlight = Math.sqrt(Math.pow(newCenterX - currentSpotlight.x, 2) + Math.pow(newCenterY - currentSpotlight.y, 2));
        isInSpotlight = distanceToSpotlight < (spotlightRadius + teleportBuffer);
        
        safetyCounter++;

    } while ((isOccupied || isInSpotlight) && safetyCounter < 100);

    word.style.left = `${newX}%`;
    word.style.top = `${newY}%`;
}

function checkWordVisibility(spotlightX, spotlightY) {
    voidTexts.forEach(word => {
        const wordRect = word.getBoundingClientRect();
        const closestX = Math.max(wordRect.left, Math.min(spotlightX, wordRect.right));
        const closestY = Math.max(wordRect.top, Math.min(spotlightY, wordRect.bottom));
        const distance = Math.sqrt(
            Math.pow(closestX - spotlightX, 2) + Math.pow(closestY - spotlightY, 2)
        );

        const isVisible = distance < spotlightRadius;
        const wasVisible = word.dataset.visible === 'true';

        if (isVisible) {
            word.dataset.visible = 'true';
        } else if (wasVisible && distance > (spotlightRadius + teleportBuffer)) {
            word.dataset.visible = 'false';
            repositionWord(word);
        }
    });
}

function updateSpotlight(x, y) {
    currentSpotlight = { x, y };
    voidContainer.style.setProperty('--mouse-x', `${x}px`);
    voidContainer.style.setProperty('--mouse-y', `${y}px`);
    checkWordVisibility(x, y);
}

enterLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.classList.add('hidden');
    voidContainer.classList.add('visible');
});

voidContainer.addEventListener('mousemove', (e) => {
    updateSpotlight(e.clientX, e.clientY);
});

// NEW: Added touchstart listener for better mobile reliability
voidContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
});

voidContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
});
