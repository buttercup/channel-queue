import { timeLimit } from "./tools";
import { Callable, TaskPriority } from "./types";

/**
 * Internal Task class, for handling executions
 */
export class Task {
    private _created: number;
    private _error: Error | null = null;
    private _queuedPromise: Promise<any>;
    private _rejectFn: Function | null = null;
    private _resolveFn: Function | null = null;
    private _stack: string | null = null;
    private _target: Callable<any>;
    private _timeLimit: number;
    private _type: TaskPriority;

    /**
     * Constructor for a Task
     * @param {Function|Promise} item The item to enqueue
     * @param {TaskPriority=} type The priority to set
     * @param {String=} stack The stack name
     */
    constructor(
        item: Callable<any>,
        type: TaskPriority = TaskPriority.Normal,
        stack?: string | null
    ) {
        if (item instanceof Promise !== true && typeof item !== "function") {
            throw new Error("Invalid task item: Expected a Promise or Function");
        }
        this._target = typeof item === "function" ? item : () => item;
        this._stack = stack ?? null;
        this._type = type;
        this._timeLimit = -1;
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
     * Execution error, if one occurred
     * @type {Error | null}
     */
    get error(): Error | null {
        return this._error;
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
     * Current time limit
     * @type {Number}
     */
    get timeLimit() {
        return this._timeLimit;
    }

    /**
     * The task priority type
     * @type {TaskPriority}
     */
    get type() {
        return this._type;
    }

    set timeLimit(newLimit: number) {
        this._timeLimit = newLimit;
    }

    /**
     * Execute the task
     * @returns {Promise}
     */
    async execute(throws: boolean = true): Promise<void> {
        const fn = this.target;
        let output: any;
        try {
            output = fn();
        } catch (err) {
            this._error = err;
            if (throws) {
                this._rejectFn?.(err);
            } else {
                this._resolveFn?.();
            }
            return Promise.resolve();
        }
        let chainOutput: Promise<any> =
            output instanceof Promise ? output : Promise.resolve(output);
        if (this.timeLimit >= 0) {
            chainOutput = timeLimit(chainOutput, this.timeLimit);
        }
        await chainOutput
            .then(result => {
                this._resolveFn?.(result);
            })
            .catch(err => {
                this._error = err;
                if (throws) {
                    this._rejectFn?.(err);
                } else {
                    this._resolveFn?.();
                }
            });
    }
}
