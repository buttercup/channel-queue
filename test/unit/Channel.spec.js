const EventEmitter = require("eventemitter3");
const sleep = require("sleep-promise");
const { Task, Channel, TaskPriority } = require("../../dist");

const NOOP = () => {};

describe("Channel", function () {
    it("can be instantiated", function () {
        expect(() => {
            new Channel("test");
        }).to.not.throw();
    });

    it("throws if no name provided", function () {
        expect(() => {
            new Channel();
        }).to.throw(/Invalid or empty/i);
    });

    it("throws if empty name provided", function () {
        expect(() => {
            new Channel("");
        }).to.throw(/Invalid or empty/i);
    });

    describe("clear", function () {
        beforeEach(function () {
            this.channel = new Channel("test");
            this.channel.autostart = false;
            this.channel.enqueue(() => {});
            this.channel.enqueue(() => {}, TaskPriority.High);
            this.channel.enqueue(() => {});
            this.channel.enqueue(() => {}, TaskPriority.High);
        });

        it("removes all items from the queue", function () {
            this.channel.clear();
            expect(this.channel.tasks).to.have.lengthOf(0);
        });

        it("can remove only items with a certain priority", function () {
            this.channel.clear(TaskPriority.High);
            expect(this.channel.tasks).to.have.lengthOf(2);
        });
    });

    describe("enqueue", function () {
        beforeEach(function () {
            this.channel = new Channel("test");
            this.channel.autostart = false;
        });

        it("returns a promise", function () {
            const result = this.channel.enqueue(NOOP);
            expect(result).to.be.an.instanceof(Promise);
        });

        it("runs the enqueued item", function () {
            const target = sinon.spy();
            const work = this.channel.enqueue(target);
            this.channel.start();
            return work.then(() => {
                expect(target.callCount).to.equal(1);
            });
        });

        it("does not run the item if autostart disabled", function () {
            const target = sinon.spy();
            const work = this.channel.enqueue(target);
            return sleep(200).then(() => {
                expect(target.notCalled).to.be.true;
            });
        });

        it("sorts items in expected order (priority)", function () {
            const op1 = () => {};
            const op2 = () => {};
            const op3 = () => {};
            sinon.spy(this.channel, "sort");
            this.channel.enqueue(op1, TaskPriority.Normal);
            this.channel.enqueue(op2, TaskPriority.Tail);
            this.channel.enqueue(op3, TaskPriority.High);
            expect(this.channel.sort.calledThrice).to.be.true;
            const items = this.channel.tasks;
            expect(items[0].target).to.equal(op3); // High prio
            expect(items[1].target).to.equal(op1); // Normal
            expect(items[2].target).to.equal(op2); // Tail
        });

        it("sorts items in expected order (time)", function () {
            const op1 = () => {};
            const op2 = () => {};
            const op3 = () => {};
            sinon.spy(this.channel, "sort");
            this.channel.enqueue(op2);
            this.channel.enqueue(op1);
            this.channel.enqueue(op3);
            expect(this.channel.sort.calledThrice).to.be.true;
            const items = this.channel.tasks;
            expect(items[0].target).to.equal(op2);
            expect(items[1].target).to.equal(op1);
            expect(items[2].target).to.equal(op3);
        });

        it("runs the queue if autostart enabled", function () {
            sinon.spy(this.channel, "start");
            this.channel.autostart = true;
            this.channel.enqueue(NOOP);
            expect(this.channel.start.calledOnce).to.be.true;
        });

        it("resolves with the result of the passed function", function () {
            const fn = () => 123;
            this.channel.autostart = true;
            return this.channel.enqueue(fn).then((res) => {
                expect(res).to.equal(123);
            });
        });

        it("resolves with the result of the passed promise", function () {
            const prom = Promise.resolve("hello");
            this.channel.autostart = true;
            return this.channel.enqueue(prom).then((res) => {
                expect(res).to.equal("hello");
            });
        });

        it("enqueues items with a stack to a maximum of 1 in-queue", function () {
            this.channel.enqueue(NOOP, TaskPriority.Normal, "closing");
            this.channel.enqueue(NOOP, TaskPriority.Normal, "closing");
            this.channel.enqueue(NOOP, TaskPriority.Normal, "opening");
            expect(this.channel.getStackedItems("closing")).to.have.lengthOf(1);
            expect(this.channel.getStackedItems("opening")).to.have.lengthOf(1);
        });

        it("returns the same promise for over-stacked items", function () {
            const closing1 = this.channel.enqueue(NOOP, TaskPriority.Normal, "closing");
            const closing2 = this.channel.enqueue(NOOP, TaskPriority.Normal, "closing");
            expect(closing1).to.equal(closing2);
        });
    });

    describe("getStackedItems", function () {
        beforeEach(function () {
            this.channel = new Channel("test");
            this.channel.autostart = false;
            this.channel.enqueue(NOOP, TaskPriority.Normal, "closing");
            this.channel.enqueue(NOOP, TaskPriority.Normal, "opening");
            this.channel.enqueue(NOOP, TaskPriority.Normal);
            this.closingItem = this.channel.tasks[0];
        });

        it("gets all items in a stack", function () {
            const items = this.channel.getStackedItems("closing");
            expect(items).to.have.lengthOf(1);
            expect(items[0]).to.equal(this.closingItem);
        });
    });

    describe("retrieveNextItem", function () {
        beforeEach(function () {
            this.channel = new Channel("test");
            this.channel.autostart = false;
            this.channel.enqueue(NOOP);
            this.channel.enqueue(NOOP);
        });

        it("returns tasks until queue is empty", function () {
            const task1 = this.channel.tasks[0];
            const task2 = this.channel.tasks[1];
            const t1 = this.channel.retrieveNextItem();
            const t2 = this.channel.retrieveNextItem();
            const t3 = this.channel.retrieveNextItem();
            expect(t1).to.equal(task1);
            expect(t2).to.equal(task2);
            expect(t3).to.equal(undefined);
        });
    });

    describe("sort", function () {
        beforeEach(function () {
            this.channel = new Channel("test");
            this.channel.autostart = false;
        });

        it("calls for sorting the array", function () {
            sinon.spy(this.channel.tasks, "sort");
            this.channel.sort();
            expect(this.channel.tasks.sort.calledOnce).to.be.true;
        });
    });

    describe("start", function () {
        beforeEach(function () {
            this.channel = new Channel("test");
            this.originalStart = sinon.spy(this.channel, "start");
            this.channel.autostart = false;
            this.channel.enqueue(NOOP);
            this.channel.enqueue(NOOP);
        });

        it("is not called when enqueuing on autostart=false", function () {
            expect(this.originalStart.notCalled).to.be.true;
        });

        it("returns true when starting", function () {
            const output = this.channel.start();
            expect(output).to.be.true;
        });

        it("returns false if already started", function () {
            this.channel.start();
            const secondCall = this.channel.start();
            expect(secondCall).to.be.false;
        });

        it("emits 'started' event", function () {
            sinon.spy(this.channel, "emit");
            this.channel.start();
            expect(this.channel.emit.calledOnce).to.be.true;
            expect(this.channel.emit.calledWithExactly("started")).to.be.true;
        });

        it("emits 'stopped' event when finished", function () {
            sinon.spy(this.channel, "emit");
            this.channel.start();
            return sleep(200).then(() => {
                expect(this.channel.emit.calledWithExactly("stopped")).to.be.true;
            });
        });
    });
});
