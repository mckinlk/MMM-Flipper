/* MMM-Flipper Core Logic
 * This file contains the core logic extracted from MMM-Flipper.js
 * It can be used by both the MagicMirror module and the test.html
 */

const FlipperCore = {
    // Initialize task states with default values
    initializeTaskStates: function(tasks, existingStates = {}) {
        const taskStates = {};
        
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (existingStates[task.name]) {
                taskStates[task.name] = existingStates[task.name];
            } else {
                taskStates[task.name] = {
                    currentIndex: 0,
                    lastPerson: null,
                    lastFlipTime: null,
                    people: task.people
                };
            }
        }
        
        return taskStates;
    },

    // Update flip display with new value
    updateFlipDisplay: function(container, newPersonName, newPersonColor, task) {
        const tickInstance = container._tickInstance;
        
        // Update color variable
        container.style.setProperty("--flipper-color", newPersonColor);
        
        if (tickInstance && typeof Tick !== 'undefined') {
            try {
                // Pad the name based on task's longest name
                const paddedName = FlipperCore.padName(newPersonName, task);
                // Update the value - this will trigger the flip animation
                tickInstance.value = paddedName;
            } catch (e) {
                console.error("Error updating Tick value:", e);
                // If update fails, recreate the display
                const tickElement = container.querySelector('.tick');
                if (tickElement) {
                    tickElement.textContent = newPersonName;
                }
            }
        } else {
            // Fallback: update text content directly
            const tickElement = container.querySelector('.tick');
            if (tickElement) {
                tickElement.textContent = newPersonName;
            }
        }
    },

    // Create a card for a single task
    createTaskCard: function(task, taskState, config, onFlipCallback) {
        const card = document.createElement("div");
        card.className = "flipper-task-card";
        card.setAttribute("data-task-name", task.name);

        // Task title
        const title = document.createElement("div");
        title.className = "flipper-task-title";
        title.innerHTML = task.name;
        card.appendChild(title);

        // Get current person and their color
        const currentIndex = taskState.currentIndex;
        const personName = taskState.people[currentIndex];
        const personColor = task.colors && task.colors[currentIndex] 
            ? task.colors[currentIndex] 
            : config.defaultColor || "#4CAF50";

        // Create flip display container
        const flipContainer = document.createElement("div");
        flipContainer.className = "flipper-flip-container";
        flipContainer.setAttribute("data-task-flip", task.name);
        flipContainer.style.cursor = "pointer";
        flipContainer.style.setProperty("--flipper-color", personColor);
        
        // Create the tick element with proper structure
        const tickElement = document.createElement("div");
        tickElement.className = "tick";
        tickElement.setAttribute("data-did-init", "handleFlipperInit");
        
        // Create the inner structure for character splitting
        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("data-repeat", "true");
        innerDiv.setAttribute("data-layout", "horizontal fit");
        innerDiv.setAttribute("data-transform", "upper -> split -> delay(random, 50, 100)");
        
        // Create span for each character
        const charSpan = document.createElement("span");
        charSpan.setAttribute("data-view", "flip");
        charSpan.setAttribute("data-transform", "ascii -> arrive -> round -> char(a-zA-Z )");
        charSpan.className = "tick-flip";
        
        innerDiv.appendChild(charSpan);
        tickElement.appendChild(innerDiv);
        flipContainer.appendChild(tickElement);
        
        // Initialize Tick display
        if (typeof Tick !== 'undefined') {
            try {
                setTimeout(function() {
                    const tick = Tick.DOM.create(tickElement);
                    // Pad name based on task's longest name
                    const paddedName = FlipperCore.padName(personName, task);
                    tick.value = paddedName;
                    flipContainer._tickInstance = tick;
                }, 10);
            } catch (e) {
                console.error("Error creating Tick instance:", e);
                // Fallback to simple text
                tickElement.textContent = personName;
            }
        } else {
            // Fallback if Tick not loaded
            tickElement.textContent = personName;
        }
        
        // Add click handler
        flipContainer.onclick = function() {
            onFlipCallback(task.name);
        };
        
        card.appendChild(flipContainer);

        // Last flip info
        if (config.showLastFlip && taskState.lastFlipTime) {
            const lastFlipInfo = document.createElement("div");
            lastFlipInfo.className = "flipper-last-flip";
            
            const lastFlipText = "Last: " + taskState.lastPerson + " on " + 
                FlipperCore.formatDate(taskState.lastFlipTime);
            lastFlipInfo.innerHTML = lastFlipText;
            card.appendChild(lastFlipInfo);
        }

        return card;
    },
    
    // Pad name for consistent display based on task's longest name
    padName: function(name, task) {
        // Find the longest name in this task's people list
        let maxLength = name.length;
        if (task && task.people) {
            for (let i = 0; i < task.people.length; i++) {
                if (task.people[i].length > maxLength) {
                    maxLength = task.people[i].length;
                }
            }
        }
        
        // Pad the name to match the longest name in the task
        if (name.length < maxLength) {
            const padding = Math.floor((maxLength - name.length) / 2);
            return ' '.repeat(padding) + name + ' '.repeat(maxLength - name.length - padding);
        }
        return name;
    },

    // Update only a specific task card
    updateTaskCard: function(taskName, task, taskState, config, containerElement, onFlipCallback) {
        // Find the existing card
        const existingCard = containerElement.querySelector(`[data-task-name="${taskName}"]`);
        if (!existingCard) return;

        // Find the flip container within the card
        const flipContainer = existingCard.querySelector(`[data-task-flip="${taskName}"]`);
        
        if (flipContainer) {
            // Get new person and color
            const currentIndex = taskState.currentIndex;
            const personName = taskState.people[currentIndex];
            const personColor = task.colors && task.colors[currentIndex] 
                ? task.colors[currentIndex] 
                : config.defaultColor || "#4CAF50";

            // Update the flip display with task parameter for proper padding
            FlipperCore.updateFlipDisplay(flipContainer, personName, personColor, task);
        } else {
            // If no flip container found, recreate the whole card
            const newCard = FlipperCore.createTaskCard(task, taskState, config, onFlipCallback);
            existingCard.replaceWith(newCard);
        }

        // Update last flip info if it exists
        if (config.showLastFlip && taskState.lastFlipTime) {
            let lastFlipInfo = existingCard.querySelector('.flipper-last-flip');
            if (lastFlipInfo) {
                const lastFlipText = "Last: " + taskState.lastPerson + " on " + 
                    FlipperCore.formatDate(taskState.lastFlipTime);
                lastFlipInfo.innerHTML = lastFlipText;
            } else {
                // Add last flip info if it doesn't exist
                lastFlipInfo = document.createElement("div");
                lastFlipInfo.className = "flipper-last-flip";
                const lastFlipText = "Last: " + taskState.lastPerson + " on " + 
                    FlipperCore.formatDate(taskState.lastFlipTime);
                lastFlipInfo.innerHTML = lastFlipText;
                existingCard.appendChild(lastFlipInfo);
            }
        }
    },

    // Flip to the next person for a task
    flipTask: function(taskName, taskStates) {
        const taskState = taskStates[taskName];
        if (!taskState) return;

        // Save current person as last person
        taskState.lastPerson = taskState.people[taskState.currentIndex];
        taskState.lastFlipTime = new Date();

        // Move to next person (cycle through the list)
        taskState.currentIndex = (taskState.currentIndex + 1) % taskState.people.length;

        return taskState;
    },

    // Format date for display
    formatDate: function(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const month = months[date.getMonth()];
        const day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        minutes = minutes < 10 ? "0" + minutes : minutes;
        
        return month + " " + day + ", " + hours + ":" + minutes + " " + ampm;
    }
};

// Export for Node.js (if available)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlipperCore;
}
