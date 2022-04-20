const { Task, TaskPriority } = require("../../dist");

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

    describe("get:type", function() {
        it("defaults to 'normal'", function() {
            const task = new Task(NOOP);
            expect(task.type).to.equal(TaskPriority.Normal);
        });

        it("returns the constructed type", function() {
            const task = new Task(NOOP, TaskPriority.High);
            expect(task.type).to.equal(TaskPriority.High);
        });
    });

    describe("execute", function() {
        beforeEach(function() {
            this.task = new Task(NOOP);
        });

        it("returns a promise", function() {
            const output = this.task.execute();
            expect(output).to.be.an.instanceof(Promise);
            return expect(output).to.be.eventually.fulfilled;
        });

        it("returns a promise even if target throws", function() {
            this.task = new Task(() => {
                throw new Error("Failure");
            });
            const output = this.task.execute();
            return expect(output).to.be.eventually.fulfilled;
        });

        it("queued promise throws if target does", function() {
            this.task = new Task(() => {
                throw new Error("Failure");
            });
            this.task.execute();
            return expect(this.task.queuedPromise).to.be.eventually.rejected;
        });

        it("returns a resolving promise for queuing", function() {
            this.task.execute();
            expect(this.task.queuedPromise).to.be.an.instanceof(Promise);
            return expect(this.task.queuedPromise).to.be.eventually.fulfilled;
        });

        it("supports timing-out tasks", async function() {
            let timer;
            this.task = new Task(
                () =>
                    new Promise(resolve => {
                        timer = setTimeout(resolve, 2000);
                    })
            );
            this.task.timeLimit = 250;
            this.task.execute();
            await expect(this.task.queuedPromise).to.be.eventually.rejected;
            clearTimeout(timer);
        });
    });
});
