const EventEmitter = require("eventemitter3");

const Task = require("./Task.js");

const {
    TASK_TYPE_HIGH_PRIORITY,
    TASK_TYPE_NORMAL,
    TASK_TYPE_TAIL
} = Task;

/**
 * Compare two tasks for sorting
 * @param {Task} taskA A task
 * @param {Task} taskB Another task
 * @returns {Number} The sorting operation regarding the provided tasks
 * @private
 * @static
 * @memberof Channel
 */
function compareTasks(taskA, taskB) {
    const { type: typeA, created: createdA } = taskA;
    const { type: typeB, created: createdB } = taskB;
    // Sort by priority:
    if (typeA === TASK_TYPE_HIGH_PRIORITY && typeB !== TASK_TYPE_HIGH_PRIORITY) {
        // A is high priority, and B isn't
        return -1;
    } else if (typeB === TASK_TYPE_HIGH_PRIORITY && typeA !== TASK_TYPE_HIGH_PRIORITY) {
        // B is high priority, and A isn't
        return 1;
    } else if (typeB === TASK_TYPE_TAIL && typeA !== TASK_TYPE_TAIL) {
        // B is a tail-task, and A isn't
        return -1;
    } else if (typeA === TASK_TYPE_TAIL && typeB !== TASK_TYPE_TAIL) {
        // A is a tail-task, and B isn't
        return 1;
    }
    // Sort by created time:
    if (createdA < createdB) {
        // A is older
        return -1;
    } else if (createdB < createdA) {
        // B is older
        return 1;
    }
    // Equal priority
    return 0;
}

/**
 * Channel class (queue)
 * @augments EventEmitter
 */
class Channel extends EventEmitter {

    /**
     * Constructor for a Channel
     * @param {String} name The name of the channel
     * @memberof Channel
     */
    constructor(name) {
        super();
        if (typeof name !== "string" || name.length <= 0) {
            throw new Error("Failed creating Channel: Invalid or empty name");
        }
        this._name = name;
        this._tasks = [];
        this._running = false;
        this._autostart = true;
    }

    /**
     * Whether the execution should start automatically or not
     * Defaults to true
     * @type {Boolean}
     * @memberof Channel
     */
    get autostart() {
        return this._autostart;
    }

    /**
     * Whether the queue is empty or not
     * @type {Boolean}
     * @readonly
     * @memberof Channel
     */
    get isEmpty() {
        return !this.isRunning && this.tasks.length === 0;
    }

    /**
     * Whether the queue is currently running or not
     * @type {Boolean}
     * @readonly
     * @memberof Channel
     */
    get isRunning() {
        return this._running;
    }

    /**
     * Array of tasks (in queue)
     * @type {Array.<Task>}
     * @readonly
     * @memberof Channel
     */
    get tasks() {
        return this._tasks;
    }

    set autostart(auto) {
        this._autostart = !!auto;
    }

    set isRunning(isRunning) {
        this._running = isRunning;
    }

    /**
     * Remove all pending tasks from the channel
     * @param {String=} priorityType Optional priority type to clear
     *  only tasks with a certain priority value
     * @memberof Channel
     */
    clear(priorityType) {
        if (!priorityType) {
            this.tasks.splice(0, Infinity);
            return;
        }
        for (let i = this.tasks.length - 1; i >= 0; i -= 1) {
            if (this.tasks[i].type === priorityType) {
                this.tasks.splice(i, 1);
            }
        }
    }

    /**
     * Enqueues a function
     * @param {Function|Promise} item The item to place into the queue
     * @param {TaskPriority=} type The task priority to use
     * @param {String=} stack The stack name
     * @returns {Promise} A promise that eventually resolves with the result from the
     *  enqueued function or promise
     * @memberof Channel
     */
    enqueue(item, type, stack = null) {
        if (stack) {
            const stackItems = this.getStackedItems(stack);
            if (stackItems.length > 0) {
                return stackItems[stackItems.length - 1].queuedPromise;
            }
        }
        const task = new Task(item, type, stack);
        this.tasks.push(task);
        this.sort();
        if (this.autostart) {
            this.start();
        }
        return task.queuedPromise;
    }

    /**
     * Get all task items for a stack name
     * @param {String} stack The stack name
     * @returns {Array.<Task>} An array of task instances
     * @memberof Channel
     */
    getStackedItems(stack) {
        return this.tasks.filter(task => task.stack && task.stack === stack);
    }

    /**
     * Get the next queued Task instance
     * This modifies the task queue by removing the task
     * @returns {Task|undefined} A task instance if there are any in queue
     * @memberof Channel
     */
    retrieveNextItem() {
        return this.tasks.shift();
    }

    /**
     * Sort the tasks
     * @memberof Channel
     */
    sort() {
        this.tasks.sort(compareTasks);
    }

    /**
     * Start processing the queue
     * Will automatically return early if queue has already started
     * @fires Channel#started
     * @fires Channel#stopped
     * @returns {Boolean} Returns true if started, false if already started
     * @memberof Channel
     */
    start() {
        if (this.isRunning) {
            return false;
        }
        this.emit("started");
        this.isRunning = true;
        setTimeout(() => this._runNextItem(), 0);
        return true;
    }

    _runNextItem() {
        const item = this.retrieveNextItem();
        if (!item) {
            this.isRunning = false;
            this.emit("stopped");
        } else {
            item
                .execute()
                .then(() => this._runNextItem());
        }
    }

}

module.exports = Channel;
