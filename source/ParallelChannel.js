const Channel = require("./Channel.js");

class ParallelChannel extends Channel {

    constructor(...args) {
        super(...args);
        this._parallelism = 2;
        this._runningTasks = [];
        this.canRunAcrossTaskTypes = false;
    }

    get isEmpty() {
        return super.isEmpty && this._runningTasks.length <= 0;
    }

    get parallelism() {
        return this._parallelism;
    }

    get runningTasks() {
        return this._runningTasks;
    }

    set parallelism(count) {
        const newCount = Math.max(count, 1);
        this._parallelism = newCount;
    }

    _runNextItem() {
        const stopChannel = () => {
            this.isRunning = false;
            this.emit("stopped");
        };
        let itemsToRun = this.parallelism - this.runningTasks.length;
        if (itemsToRun <= 0) {
            return;
        }
        if (this.runningTasks.length === 0 && this.tasks.length === 0) {
            stopChannel();
        }
        while (itemsToRun > 0) {
            itemsToRun -= 1;
            const item = this.retrieveNextItem();
            if (!item) {
                stopChannel();
                return;
            }
            this.runningTasks.push(item);
            item
                .execute()
                .then(() => {
                    this.runningTasks.splice(this.runningTasks.indexOf(item), 1);
                    this._runNextItem();
                });
        }
    }

}

module.exports = ParallelChannel;
