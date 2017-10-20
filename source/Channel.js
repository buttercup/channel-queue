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
        return 1;
    } else if (typeB === TASK_TYPE_HIGH_PRIORITY && typeA !== TASK_TYPE_HIGH_PRIORITY) {
        // B is high priority, and A isn't
        return -1;
    } else if (typeB === TASK_TYPE_TAIL && typeA !== TASK_TYPE_TAIL) {
        // B is a tail-task, and A isn't
        return 1;
    } else if (typeA === TASK_TYPE_TAIL && typeB !== TASK_TYPE_TAIL) {
        // A is a tail-task, and B isn't
        return 1;
    }
    // Sort by created time:
    if (createdA < createdB) {
        // A is older
        return 1;
    } else if (createdB < createdA) {
        // B is older
        return -1;
    }
    // Equal priority
    return 0;
}

/**
 * Channel class (queue)
 * @augments EventEmitter
 */
class Channel extends EventEmitter {

    constructor(name) {
        super();
        this._name = name;
        this._tasks = [];
        this._running = false;
        this._autostart = true;
    }

    get autostart() {
        return this._autostart;
    }

    get isRunning() {
        this._running;
    }

    get tasks() {
        return this._tasks;
    }

    set autostart(auto) {
        this._autostart = !!auto;
    }

    set isRunning(isRunning) {
        this._running = isRunning;
    }

    enqueue(item, type, stack = null) {
        const task = new Task(item, type, stack);
        this.tasks.push(task);
        this.sort();
        if (this.autostart) {
            this.start();
        }
        return task.queuedPromise;
    }

    retrieveNextItem() {
        return this.tasks.shift();
    }

    sort() {
        this.tasks.sort(compareTasks);
    }

    /**
     * Start processing the queue
     * Will automatically return early if queue has already started
     * @fires Channel#started
     */
    start() {
        if (this.isRunning) {
            return;
        }
        const runNextItem = () => {
            const item = this.retrieveNextItem();
            if (!item) {
                this.isRunning = false;
                this.emit("stopped");
            } else {
                item
                    .execute()
                    .then(() => runNextItem());
            }
        };
        this.emit("started");
        this.isRunning = true;
        runNextItem();
    }

}

module.exports = Channel;
