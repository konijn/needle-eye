const dis = (() => {
    const data = localStorage.getItem("DiS");
    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error("Error parsing data from localStorage:", error);
            return { newGame: true };
        }
    }
    return { newGame: true };
})();

((dis, interval) => {
    const saveToLocalStorage = () => {
        try {
            localStorage.setItem("DiS", JSON.stringify(dis));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    };

    // Save at the specified interval, keep track of timer
    dis.timers = dis.timers || {};
    dis.timers.autoSave = setInterval(saveToLocalStorage, interval);

})(dis, 500); //500 milliseconds is half a second


((dis, interval) => {
    const update = () => {

        if(dis.newGame && dis.lastChoice){
            dis.newGame = false;
            dis.firstChoice = dis.lastChoice;
        }

        if(dis.newGame && !ui.hasModal()) {
            ui.createModal('zqxwn prvlm jsdgl zxrpv.', ['Accept', 'Ignore']);
        }

        // Game logic here, using DiS
        console.log( dis);
    };

    // Start the game loop
    dis.timers = dis.timers || {};
    dis.timers.gameLoop = setInterval(update, interval);

})( dis, 1000/4); // 4 times per second


ui = {
    createElement: (tag, attributes) => Object.assign(document.createElement(tag), attributes),
    hasModal: () => !!document.querySelector('.modal'),
    createModal: function createModal(message, buttons) {

        // Create overlay div
        const overlay = ui.createElement('div', { className: 'modal-overlay' });

        // Create modal content div
        const modal = ui.createElement('div', { className: 'modal' });

        // Add message to modal
        modal.appendChild(ui.createElement('p', { textContent: message }));

        // Add buttons to modal
        buttons.forEach((buttonText, index) => {
            const button = ui.createElement('button', { textContent: buttonText });
            if (index === 0) {
                button.className = 'selected';
            }
            button.onclick = () => {
                log(0,button.innerText);
                dis.lastChoice = button.innerText;
                document.body.removeChild(overlay); // Remove modal on click
            };
            modal.appendChild(button);
        });

        // Append modal to overlay
        overlay.appendChild(modal);

        // Append overlay to body
        document.body.appendChild(overlay);
   }
};
