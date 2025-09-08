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


// ===== NEW: PART 2: Interactive Void Logic =====

const enterLink = document.getElementById('enter-link');
const mainContent = document.getElementById('main-content');
const voidContainer = document.getElementById('void-container');

// Listen for a click on the [ enter ] link
enterLink.addEventListener('click', (e) => {
    e.preventDefault(); // Stop the link from trying to navigate

    // Add classes to fade the containers in and out
    mainContent.classList.add('hidden');
    voidContainer.classList.add('visible');
});

// Listen for mouse movement over the void container
voidContainer.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;

    // Update the CSS custom properties with the mouse position
    voidContainer.style.setProperty('--mouse-x', `${clientX}px`);
    voidContainer.style.setProperty('--mouse-y', `${clientY}px`);
});
