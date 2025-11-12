/* Magic Mirror
 * Module: MMM-Flipper
 *
 * By Your Name
 * MIT Licensed.
 */

Module.register("MMM-Flipper", {
    // Default module config
    defaults: {
        tasks: [
            {
                name: "Dishes",
                people: ["Alice", "Bob", "Charlie"],
                colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"]  // Optional: custom colors for each person
            },
            {
                name: "Litter Box",
                people: ["Alice", "Bob"],
                colors: ["#FF6B6B", "#4ECDC4"]
            },
            {
                name: "Garbage",
                people: ["Charlie", "Bob", "Alice"],
                colors: ["#45B7D1", "#4ECDC4", "#FF6B6B"]
            }
        ],
        defaultColor: "#4CAF50",  // Default color if no color specified
        animationSpeed: 1000,
        showLastFlip: true
    },

    // Store task states
    taskStates: {},

    // Required version of MagicMirror
    requiresVersion: "2.1.0",

    start: function() {
        Log.info("Starting module: " + this.name);
        
        // Load core logic
        this.loadFlipperCore();
        // Note: initialization of taskStates and requesting saved states
        // happens after the FlipperCore script has been loaded in
        // loadFlipperCore() to avoid calling methods on an undefined object.
    },

    // Load the core flipper logic
    loadFlipperCore: function() {
        Log.info("MMM-Flipper: Loading flipper-core.js");
        var script = document.createElement("script");
        script.src = this.file("flipper-core.js");
        document.head.appendChild(script);
        
        // Wait for script to load
        var self = this;
        var checkCore = setInterval(function() {
            if (typeof FlipperCore !== 'undefined') {
                Log.info("MMM-Flipper: FlipperCore loaded successfully");
                self.FlipperCore = FlipperCore;
                clearInterval(checkCore);

                // Initialize task states now that FlipperCore is available
                try {
                    self.taskStates = self.FlipperCore.initializeTaskStates(self.config.tasks, {});
                    Log.info("MMM-Flipper: Task states initialized successfully");
                } catch (e) {
                    Log.error("Error initializing task states:", e);
                    self.taskStates = {};
                }

                // Request saved states from node_helper (will merge when received)
                self.sendSocketNotification("GET_TASK_STATES", {});
                
                // Update the DOM now that FlipperCore is loaded and states are initialized
                self.updateDom(self.config.animationSpeed);
            }
        }, 100);
    },

    // Override dom generator
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "flipper-container";
        wrapper.id = "flipper-container-" + this.identifier;

        if (this.config.tasks.length === 0) {
            wrapper.innerHTML = "No tasks configured.";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        // Wait for FlipperCore to load
        if (!this.FlipperCore) {
            wrapper.innerHTML = "Loading...";
            return wrapper;
        }

        // Create a card for each task using core logic
        for (var i = 0; i < this.config.tasks.length; i++) {
            var task = this.config.tasks[i];
            var taskState = this.taskStates[task.name];
            
            if (!taskState) continue;

            var taskCard = this.FlipperCore.createTaskCard(
                task, 
                taskState, 
                this.config, 
                this.flipTask.bind(this)
            );
            wrapper.appendChild(taskCard);
        }

        return wrapper;
    },

    // Flip to the next person for a task
    flipTask: function(taskName) {
        if (!this.FlipperCore) return;
        
        this.FlipperCore.flipTask(taskName, this.taskStates);

        // Save state to file
        this.sendSocketNotification("SAVE_TASK_STATES", this.taskStates);

        // Update only the specific task card
        var container = document.getElementById("flipper-container-" + this.identifier);
        if (container) {
            var task = this.config.tasks.find(function(t) { return t.name === taskName; });
            if (task) {
                this.FlipperCore.updateTaskCard(
                    taskName,
                    task,
                    this.taskStates[taskName],
                    this.config,
                    container,
                    this.flipTask.bind(this)
                );
            }
        }
    },

    // Handle notifications from node_helper
    socketNotificationReceived: function(notification, payload) {
        if (notification === "TASK_STATES_DATA") {
            if (payload && Object.keys(payload).length > 0 && this.FlipperCore) {
                // Merge saved states with current configuration
                this.taskStates = this.FlipperCore.initializeTaskStates(this.config.tasks, payload);
                this.updateDom(this.config.animationSpeed);
            }
        }
    },

    // Load custom CSS and scripts
    getStyles: function() {
        return ["MMM-Flipper.css"];
    },

    getScripts: function() {
        // Note: flipper-core.js is loaded manually in loadFlipperCore()
        // to ensure proper timing and avoid duplicate declarations
        return [];
    }
});
