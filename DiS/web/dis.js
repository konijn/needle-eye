const dis = (() => {
    const newGame = { newGame: true };
    const string = localStorage.getItem("DiS");
    if (string) {
        try {
            const data = JSON.parse(string);
            return data.reset ? newGame : data;
        } catch (error) {
            console.error("Error parsing data from localStorage:", error);
            return newGame;
        }
    }
    return newGame;
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

})(dis, 1000/2 ); //Twice per second


((dis, interval) => {
    const update = () => {

        if(dis.newGame && dis.lastChoice){
            dis.newGame = false;
            dis.firstChoice = dis.lastChoice;
            ui.addMessage('You ' + dis.firstChoice + (dis.firstChoice.endsWith('e') ? 'd' : 'ed'));
        }

        if(dis.newGame && !ui.hasModal()) {
            ui.createModal('zqxwn prvlm jsdgl zxrpv.', ['Accept', 'Ignore']);
        }

        // Game logic here, using DiS!
        //console.log( dis);
    };

    // Start the game loop
    dis.timers = dis.timers || {};
    dis.timers.gameLoop = setInterval(update, interval);

})( dis, 1000/4); // 4 times per second


//Here go the 1 liners
ui = {
    createElement: (tag, attributes) => Object.assign(document.createElement(tag), attributes),
    hasModal: () => !!document.querySelector('.modal'),
};

/* Here goes the more serious stuff */

ui.createModal = function createModal(message, buttons) {

    //Create overlay and modal elements
    const overlay = ui.createElement('div', { className: 'modal-overlay' });
    const modal = ui.createElement('div', { className: 'modal' });
    modal.appendChild(ui.createElement('p', { textContent: message }));

    // Add buttons to the modal
    buttons.forEach((buttonText, index) => {
        const button = ui.createElement('button', { textContent: buttonText });
        if (index === 0) {
            button.className = 'selected';
        }
        button.onclick = () => {
            log(0, button.innerText);
            dis.lastChoice = button.innerText;
            document.body.removeChild(overlay); // Remove modal on click
        };
        modal.appendChild(button);
    });
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

ui.addMessage = (function(maxMessages, fadeOutTime) {
    // Create message panel
    const messagePanel = document.createElement('div');
    messagePanel.className = 'message-panel';
    document.body.appendChild(messagePanel);

    // Function to add a message to the panel
    function addMessage(text) {
        const message = document.createElement('div');
        message.textContent = text;
        message.className = 'message';
        messagePanel.appendChild(message);

        // Fade out message after fade out time
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => {
                if (message.parentNode === messagePanel) {
                    messagePanel.removeChild(message);
                }
            }, 1000);
        }, fadeOutTime);

        // Remove oldest message if more than maxMessages
        if (messagePanel.childElementCount > maxMessages) {
            messagePanel.removeChild(messagePanel.firstChild);
        }
    }

    // Expose addMessage function globally
    return addMessage;
})(5, 5000); //No more than 5 messages, fade out after 5 seconds

/* Wizard commands */
function reset() { 
  dis.reset = true;
  log(8, 'Reload game to reset');
}