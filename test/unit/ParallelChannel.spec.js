const ParallelChannel = require("../../source/ParallelChannel.js");

const NOOP = () => {};

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
    });

});
