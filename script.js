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

const spotlightRadius = 200;

function repositionWord(word) {
    const newX = Math.random() * 80 + 10;
    const newY = Math.random() * 80 + 10;
    word.style.left = `${newX}%`;
    word.style.top = `${newY}%`;
}

function checkWordVisibility(spotlightX, spotlightY) {
    voidTexts.forEach(word => {
        const wordRect = word.getBoundingClientRect();
        const wordCenterX = wordRect.left + wordRect.width / 2;
        const wordCenterY = wordRect.top + wordRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(wordCenterX - spotlightX, 2) + Math.pow(wordCenterY - spotlightY, 2)
        );

        const isVisible = distance < spotlightRadius;
        const wasVisible = word.dataset.visible === 'true';

        if (isVisible) {
            word.dataset.visible = 'true';
        } else if (wasVisible) {
            word.dataset.visible = 'false';
            repositionWord(word);
        }
    });
}

function updateSpotlight(x, y) {
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
