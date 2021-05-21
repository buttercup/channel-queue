import { Channel } from "./Channel";
import { Task } from "./Task";

/**
 * ParallelChannel class (queue)
 * @augments Channel
 */
export class ParallelChannel extends Channel {
    private _parallelism: number;
    private _runningTasks: Task[];
    canRunAcrossTaskTypes: boolean;

    constructor(name: string) {
        super(name);
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
            return;
        }
        while (itemsToRun > 0) {
            // First check to see if any other tasks are running, and whether or not
            // we're allowed to run tasks of different priorities at the same time
            if (!this.canRunAcrossTaskTypes && this.runningTasks.length > 0 && this.tasks.length > 0) {
                const runningType = this.runningTasks[0].type;
                const nextType = this.tasks[0].type;
                if (runningType !== nextType) {
                    // Next item is not of the same type, so we'll skip this round
                    return;
                }
            }
            itemsToRun -= 1;
            const item = this.retrieveNextItem();
            if (!item) {
                stopChannel();
                return;
            }
            this.runningTasks.push(item);
            item.execute().then(() => {
                this.runningTasks.splice(this.runningTasks.indexOf(item), 1);
                this._runNextItem();
            });
        }
    }
}
