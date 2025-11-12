/* Magic Mirror
 * Node Helper: MMM-Flipper
 *
 * By Your Name
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
    // Subclass start method
    start: function() {
        console.log("Starting node helper for: " + this.name);
        this.dataFile = path.join(__dirname, "task_states.json");
    },

    // Handle notifications from module
    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_TASK_STATES") {
            this.loadTaskStates();
        } else if (notification === "SAVE_TASK_STATES") {
            this.saveTaskStates(payload);
        }
    },

    // Load task states from file
    loadTaskStates: function() {
        var self = this;
        
        fs.readFile(this.dataFile, "utf8", function(err, data) {
            if (err) {
                if (err.code === "ENOENT") {
                    // File doesn't exist yet, send empty object
                    console.log("No saved task states found, starting fresh.");
                    self.sendSocketNotification("TASK_STATES_DATA", {});
                } else {
                    console.error("Error reading task states:", err);
                    self.sendSocketNotification("TASK_STATES_DATA", {});
                }
                return;
            }

            try {
                var taskStates = JSON.parse(data);
                console.log("Loaded task states from file.");
                self.sendSocketNotification("TASK_STATES_DATA", taskStates);
            } catch (parseErr) {
                console.error("Error parsing task states:", parseErr);
                self.sendSocketNotification("TASK_STATES_DATA", {});
            }
        });
    },

    // Save task states to file
    saveTaskStates: function(taskStates) {
        var self = this;
        var data = JSON.stringify(taskStates, null, 2);

        fs.writeFile(this.dataFile, data, "utf8", function(err) {
            if (err) {
                console.error("Error saving task states:", err);
            } else {
                console.log("Task states saved successfully.");
            }
        });
    }
});
