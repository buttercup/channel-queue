const EventEmitter = require("eventemitter3");

const Task = require("./Task.js");

class Channel extends EventEmitter {

    constructor(name) {
        super();
        this._name = name;
        this._tasks = [];
    }

    get tasks() {
        return this._tasks;
    }

    enqueue(item, type) {
        const task = new Task(item, type);
        this.tasks.push(task);
        this.sort();
        return task.queuedPromise;
    }

    sort() {

    }

}

module.exports = Channel;
