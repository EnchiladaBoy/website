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
