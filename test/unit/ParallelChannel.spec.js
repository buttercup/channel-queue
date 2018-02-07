const ParallelChannel = require("../../source/ParallelChannel.js");

const NOOP = () => {};

function createStoppedPromise() {
    let trigger;
    const promise = new Promise(resolve => {
        trigger = resolve;
    });
    promise.trigger = trigger;
    return promise;
}

describe("ParallelChannel", function() {

    it("can be instantiated", function() {
        expect(() => {
            new ParallelChannel("test");
        }).to.not.throw();
    });

    it("throws if no name provided", function() {
        expect(() => {
            new ParallelChannel();
        }).to.throw(/Invalid or empty/i);
    });

    describe("get:isEmpty", function() {
        it("detects empty channels", function() {
            const channel = new ParallelChannel("test");
            expect(channel.isEmpty).to.be.true;
        });

        it("detects non-empty channels", function() {
            const channel = new ParallelChannel("test");
            channel.autostart = false;
            channel.enqueue(NOOP);
            channel.enqueue(NOOP);
            expect(channel.isEmpty).to.be.false;
        });
    });

    describe("enqueue", function() {
        beforeEach(function() {
            this.channel = new ParallelChannel("test", 2);
        });

        it("returns a promise", function() {
            const result = this.channel.enqueue(NOOP);
            expect(result).to.be.an.instanceof(Promise);
            return result;
        });

        it("enqueues and completes tasks", function() {
            const out1 = this.channel.enqueue(() => 1);
            const out2 = this.channel.enqueue(() => Promise.resolve(2));
            return Promise.all([
                expect(out1).to.eventually.equal(1),
                expect(out2).to.eventually.equal(2)
            ]);
        });

        it("can run tasks in parallel", function() {
            let runOne = false,
                runTwo = false;
            const stoppedOne = createStoppedPromise();
            const stoppedTwo = createStoppedPromise();
            const exitOne = createStoppedPromise();
            const exitTwo = createStoppedPromise();
            this.channel.autostart = false;
            this.channel.enqueue(() => {
                runOne = true;
                exitOne.trigger();
                return stoppedOne;
            });
            this.channel.enqueue(() => {
                runTwo = true;
                exitTwo.trigger();
                return stoppedTwo;
            });
            expect(runOne).to.be.false;
            expect(runTwo).to.be.false;
            // start: both should trigger
            this.channel.start();
            return Promise
                .all([exitOne, exitTwo])
                .then(() => {
                    expect(runOne).to.be.true;
                    expect(runTwo).to.be.true;
                });
        });
    });

});
