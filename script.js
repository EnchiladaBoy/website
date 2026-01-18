// ===== PART 1: Continuous Radial Glitch =====
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+";
const glitchRadius = 150; // Radius in pixels
const glitchSpeed = 8;    // Higher number = Slower glitch (updates every N frames)

let mouseX = -1000; // Start off-screen
let mouseY = -1000;

// 1. Prepare the text
document.querySelectorAll('[data-value]').forEach(element => {
    const text = element.dataset.value;
    element.innerHTML = text.split("").map((char) => {
        // We add a 'data-frame' to track timing for each letter individually
        return `<span class="glitch-char" data-char="${char}" data-frame="0">${char}</span>`;
    }).join("");
});

// 2. Track mouse globally (works for both sections)
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 3. The Animation Loop
function animateGlitch() {
    requestAnimationFrame(animateGlitch);

    document.querySelectorAll('.glitch-char').forEach(span => {
        const rect = span.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        // Check distance to mouse
        const dist = Math.hypot(mouseX - charX, mouseY - charY);

        if (dist < glitchRadius) {
            // === INSIDE RADIUS: GLITCH IT ===
            
            // We use a counter so it doesn't change every single frame (too fast)
            let frame = parseInt(span.dataset.frame);
            frame++;

            if (frame >= glitchSpeed) {
                // Time to swap the character
                span.innerText = letters[Math.floor(Math.random() * letters.length)];
                frame = 0; // Reset counter
            }
            
            span.dataset.frame = frame;

        } else {
            // === OUTSIDE RADIUS: RESET IT ===
            
            // If it's not the original letter, snap it back
            if (span.innerText !== span.dataset.char) {
                span.innerText = span.dataset.char;
                span.dataset.frame = 0;
            }
        }
    });
}

// Start the loop
animateGlitch();


// ===== PART 2: Interactive Void Logic (Preserved) =====
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

voidContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
});

voidContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
});
