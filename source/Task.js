const TASK_TYPE_NORMAL = "normal";
const TASK_TYPE_HIGH_PRIORITY = "high-priority";
const TASK_TYPE_TAIL = "tail";

class Task {

    constructor(item, type, stack = null) {
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

    get created() {
        return this._created;
    }

    get queuedPromise() {
        return this._queuedPromise;
    }

    get stack() {
        return this._stack;
    }

    get target() {
        return this._target;
    }

    get type() {
        return this._type;
    }

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
