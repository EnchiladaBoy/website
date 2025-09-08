:root {
    --bg-color: #0a0a0a;
    --text-color: #e0e0e0;
    --glow-color: rgba(0, 255, 136, 0.7);
    /* NEW: Variables to hold mouse coordinates */
    --mouse-x: 50%;
    --mouse-y: 50%;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'VT323', monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    overflow: hidden;
    letter-spacing: 0.1em;
}

.container {
    text-align: center;
    z-index: 2;
    transition: opacity 0.5s ease-out; /* Add transition for fading out */
}

/* NEW: Class to fade out the initial content */
.container.hidden {
    opacity: 0;
    pointer-events: none;
}

h1 {
    font-family: 'Special Elite', cursive;
    font-size: 5rem;
    margin: 0;
    font-weight: 400;
    text-transform: uppercase;
    transition: text-shadow 0.3s ease;
}

h1:hover {
    text-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color);
}

p {
    margin-top: 2rem;
    font-size: 1.5rem;
}

p span {
    display: block;
    margin: 0.5rem 0;
}

a {
    color: var(--text-color);
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 0.3s ease, text-shadow 0.3s ease;
}

a:hover {
    color: var(--glow-color);
    text-shadow: 0 0 8px var(--glow-color);
}

.hidden-link {
    margin-top: 4rem;
    opacity: 0.7;
}

/* Static noise/glitch effect */
.noise {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: 0.05;
    animation: noise 0.2s infinite linear;
}

/* ===== NEW STYLES FOR THE VOID ===== */

#void-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0;
    pointer-events: none; /* Can't interact with it while hidden */
    transition: opacity 0.5s ease-in;
    z-index: 10;

    /* The Spotlight Effect! */
    mask-image: radial-gradient(
        circle 200px at var(--mouse-x) var(--mouse-y),
        black 0%,
        transparent 100%
    );
    -webkit-mask-image: radial-gradient(
        circle 200px at var(--mouse-x) var(--mouse-y),
        black 0%,
        transparent 100%
    );
}

#void-container.visible {
    opacity: 1;
    pointer-events: all; /* Make it interactive once visible */
}

.void-text {
    position: absolute;
    color: #333; /* Dark gray, almost invisible */
    font-size: 2rem;
    font-family: 'Special Elite', cursive;
    filter: blur(1px); /* A little distorted */
}

/* Position the hidden text around the screen */
#v1 { top: 20%; left: 15%; }
#v2 { top: 30%; left: 60%; }
#v3 { top: 70%; left: 10%; }
#v4 { top: 50%; left: 45%; }
#v5 { top: 85%; left: 70%; }
#v6 { top: 10%; left: 40%; }


@keyframes noise {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(3%, 35%); }
    90% { transform: translate(-10%, 10%); }
}
