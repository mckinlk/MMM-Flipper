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

        // Current person assigned (clickable to flip)
        const currentPerson = document.createElement("div");
        currentPerson.className = "flipper-current-person";
        currentPerson.innerHTML = personName;
        currentPerson.style.cursor = "pointer";
        
        // Apply custom color
        currentPerson.style.color = personColor;
        currentPerson.style.borderColor = personColor + "55"; // 55 = ~33% opacity
        currentPerson.style.backgroundColor = personColor + "1A"; // 1A = ~10% opacity
        currentPerson.style.textShadow = `0 0 10px ${personColor}80`; // 80 = ~50% opacity
        
        currentPerson.onclick = function() {
            onFlipCallback(task.name);
        };
        card.appendChild(currentPerson);

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

    // Update only a specific task card
    updateTaskCard: function(taskName, task, taskState, config, containerElement, onFlipCallback) {
        // Find the existing card
        const existingCard = containerElement.querySelector(`[data-task-name="${taskName}"]`);
        if (!existingCard) return;

        // Create new card
        const newCard = FlipperCore.createTaskCard(task, taskState, config, onFlipCallback);
        
        // Replace the old card with the new one
        existingCard.replaceWith(newCard);
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
