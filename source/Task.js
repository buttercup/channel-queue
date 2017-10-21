/**
 * Normal task priority
 * @type {String}
 * @name TASK_TYPE_NORMAL
 */
const TASK_TYPE_NORMAL = "normal";
/**
 * High task priority
 * @type {String}
 * @name TASK_TYPE_HIGH_PRIORITY
 */
const TASK_TYPE_HIGH_PRIORITY = "high-priority";
/**
 * Task tail-priority
 * @type {String}
 * @name TASK_TYPE_TAIL
 */
const TASK_TYPE_TAIL = "tail";

/**
 * Task priority
 * @typedef {TASK_TYPE_NORMAL|TASK_TYPE_HIGH_PRIORITY|TASK_TYPE_TAIL} TaskPriority
 */

/**
 * Internal Task class, for handling executions
 */
class Task {

    /**
     * Constructor for a Task
     * @param {Function|Promise} item The item to enqueue
     * @param {TaskPriority=} type The priority to set
     * @param {String=} stack The stack name
     */
    constructor(item, type = TASK_TYPE_NORMAL, stack = null) {
        if (item instanceof Promise !== true && typeof item !== "function") {
            throw new Error("Invalid task item: Expected a Promise or Function");
        }
        this._target = (typeof item === "function") ? item : () => item;
        this._stack = stack;
        this._type = type;
        this._resolveFn = null;
        this._rejectFn = null;
        this._queuedPromise = new Promise((resolve, reject) => {
            this._resolveFn = resolve;
            this._rejectFn = reject;
        });
        const now = new Date();
        this._created = now.getTime();
    }

    /**
     * Creation timestamp
     * @type {Number}
     * @readonly
     */
    get created() {
        return this._created;
    }

    /**
     * Promise which resolves when work has completed
     * @type {Promise}
     */
    get queuedPromise() {
        return this._queuedPromise;
    }

    /**
     * The stack name
     * @type {String}
     */
    get stack() {
        return this._stack;
    }

    /**
     * The target function
     * @type {Function}
     */
    get target() {
        return this._target;
    }

    /**
     * The task priority type
     * @type {TaskPriority}
     */
    get type() {
        return this._type;
    }

    /**
     * Execute the task
     * @returns {Promise}
     */
    execute() {
        const fn = this.target;
        let output;
        try {
            output = fn();
        } catch(err) {
            this._rejectFn(err);
            return Promise.resolve();
        }
        const chainOutput = (output instanceof Promise) ? output : Promise.resolve(output);
        return chainOutput
            .then(result => {
                this._resolveFn(result);
            })
            .catch(err => {
                this._rejectFn(err);
            });
    }

}

Object.assign(Task, {
    TASK_TYPE_NORMAL,
    TASK_TYPE_HIGH_PRIORITY,
    TASK_TYPE_TAIL
});

module.exports = Task;
