const EventEmitter = require("eventemitter3");

const Channel = require("./Channel.js");

class ChannelQueue extends EventEmitter {

    constructor() {
        super();
        this._channels = {};
    }

    get channels() {
        return this._channels;
    }

    createChannel(name) {
        if (this.channelExists(name)) {
            throw new Error(`Cannot create channel: channel already exists: ${name}`);
        }
        this.channels[name] = new Channel(name);
        return this.channel(name);
    }

    channel(name) {
        if (this.channelExists(name) !== true) {
            throw new Error(`Cannot fetch channel: channel doesn't exist: ${name}`);
        }
        return this.channels[name];
    }

    channelExists(name) {
        return this.channels.hasOwnProperty(name);
    }

}

module.exports = ChannelQueue;
