const EventEmitter = require("eventemitter3");

const TASK_TYPE_NORMAL = "normal";
const TASK_TYPE_HIGH_PRIORITY = "high-priority";
const TASK_TYPE_TAIL = "tail";

class Task extends EventEmitter {

    constructor(item, type) {
        super();
        this._target = (typeof item === "function") ? item : () => item;
        this._resolveFn = null;
        this._rejectFn = null;
        this._queuedPromise = new Promise((resolve, reject) => {
            this._resolveFn = resolve;
            this._rejectFn = reject;
        });
        const now = new Date();
        this._created = now.getTime();
    }

    get created() {
        return this._created;
    }

    get queuedPromise() {
        return this._queuedPromise;
    }

    get target() {
        return this._target;
    }

    execute(input) {

    }

}

Object.assign(Task, {
    TASK_TYPE_NORMAL,
    TASK_TYPE_HIGH_PRIORITY,
    TASK_TYPE_TAIL
});

module.exports = Task;
