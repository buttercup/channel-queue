const Channel = require("./Channel.js");

/**
 * ParallelChannel class (queue)
 * @augments Channel
 */
class ParallelChannel extends Channel {

    constructor(...args) {
        super(...args);
        this._parallelism = 2;
        this._runningTasks = [];
        this.canRunAcrossTaskTypes = false;
    }

    /**
     * Whether the queue is empty or not
     * @type {Boolean}
     * @readonly
     */
    get isEmpty() {
        return super.isEmpty && this._runningTasks.length <= 0;
    }

    /**
     * The amount of allowed parallel executed tasks
     * @type {Number}
     * @readonly
     */
    get parallelism() {
        return this._parallelism;
    }

    /**
     * Get the currently running tasks
     * @type {Array<Task>}
     * @readonly
     */
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
