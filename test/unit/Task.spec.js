const Task = require("../../source/Task.js");

const {
    TASK_TYPE_HIGH_PRIORITY,
    TASK_TYPE_NORMAL,
    TASK_TYPE_TAIL
} = Task;

const NOOP = () => {};

describe("Task", function() {
    
    it("can be instantiated", function() {
        expect(() => {
            new Task(() => {});
        }).to.not.throw();
    });

    it("throws if argument is not a function or promise", function() {
        expect(() => {
            new Task("hey");
        }).to.throw(/Invalid task item/i);
    });

    describe("get:created", function() {
        it("is set to the current timestamp", function() {
            const date = new Date();
            const ts = date.getTime();
            const task = new Task(NOOP);
            expect(task.created).to.be.a("number");
            expect(task.created).to.be.within(ts - 2000, ts + 2000);
        });
    });

    describe("get:queuedPromise", function() {
        it("returns a promise", function() {
            const task = new Task(NOOP);
            expect(task.queuedPromise).to.be.an.instanceof(Promise);
        });

        it("returns a promise even after execution", function() {
            const task = new Task(NOOP);
            return task.execute().then(() => {
                expect(task.queuedPromise).to.be.an.instanceof(Promise);
            });
        });
    });

    describe("get:target", function() {
        it("is set to the constructed argument if it is a function", function() {
            const task = new Task(NOOP);
            expect(task.target).to.equal(NOOP);
        });

        it("is set to a new function if the constructed argument is a Promise", function() {
            const task = new Task(Promise.resolve());
            expect(task.target).to.be.a("function");
        });
    });

    describe("type", function() {
        it("defaults to 'normal'", function() {
            const task = new Task(NOOP);
            expect(task.type).to.equal(TASK_TYPE_NORMAL);
        });

        it("returns the constructed type", function() {
            const task = new Task(NOOP, TASK_TYPE_HIGH_PRIORITY);
            expect(task.type).to.equal(TASK_TYPE_HIGH_PRIORITY);
        });
    });

});
