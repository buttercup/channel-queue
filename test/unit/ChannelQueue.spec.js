const EventEmitter = require("eventemitter3");
const { Channel, ChannelQueue } = require("../../dist");

describe("ChannelQueue", function () {
    it("can be instantiated", function () {
        expect(() => {
            new ChannelQueue();
        }).to.not.throw();
    });

    it("is an event emitter", function () {
        expect(new ChannelQueue()).to.be.an.instanceof(EventEmitter);
    });

    describe("createChannel", function () {
        beforeEach(function () {
            this.queue = new ChannelQueue();
        });

        it("creates channels", function () {
            const channel = this.queue.createChannel("test");
            expect(channel).to.be.an.instanceof(Channel);
        });
    });

    describe("channel", function () {
        beforeEach(function () {
            this.queue = new ChannelQueue();
            this.buttercupChannel = this.queue.createChannel("buttercup");
        });

        it("returns the correct channel", function () {
            const channel = this.queue.channel("buttercup");
            expect(channel).to.equal(this.buttercupChannel);
        });

        it("returns a new channel if it doesn't exist", function () {
            let output;
            expect(() => {
                output = this.queue.channel("nothere");
            }).to.not.throw();
            expect(output).to.be.an.instanceof(Channel);
        });
    });

    describe("channelExists", function () {
        beforeEach(function () {
            this.queue = new ChannelQueue();
            this.buttercupChannel = this.queue.createChannel("buttercup");
        });

        it("detects existing channels", function () {
            expect(this.queue.channelExists("buttercup")).to.be.true;
        });

        it("detects non-existing channels", function () {
            expect(this.queue.channelExists("heya")).to.be.false;
        });
    });
});
