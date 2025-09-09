// ===== PART 1: Initial text scramble effect =====
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+";
document.querySelectorAll('[data-value]').forEach(element => {
    element.onmouseover = event => {
        let iterations = 0;
        const interval = setInterval(() => {
            event.target.innerText = event.target.innerText.split("")
                .map((letter, index) => {
                    if(index < iterations) {
                        return event.target.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            if(iterations >= event.target.dataset.value.length) {
                clearInterval(interval);
            }
            iterations += 1 / 3;
        }, 30);
    }
});


// ===== PART 2: Interactive Void Logic =====
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

// ===== MODIFIED FUNCTION =====
function checkWordVisibility(spotlightX, spotlightY) {
    voidTexts.forEach(word => {
        const wordRect = word.getBoundingClientRect();

        // Find the closest point on the word's bounding box to the spotlight's center
        const closestX = Math.max(wordRect.left, Math.min(spotlightX, wordRect.right));
        const closestY = Math.max(wordRect.top, Math.min(spotlightY, wordRect.bottom));

        // Calculate the distance from the spotlight center to this closest point
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

voidContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
});
