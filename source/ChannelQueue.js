const EventEmitter = require("eventemitter3");

const Channel = require("./Channel.js");

/**
 * ChannelQueue class, for managing channels
 * @augments EventEmitter
 */
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
        return this.channels[name];
    }

    channel(name) {
        if (this.channelExists(name) !== true) {
            return this.createChannel(name);
        }
        return this.channels[name];
    }

    channelExists(name) {
        return this.channels.hasOwnProperty(name);
    }

}

module.exports = ChannelQueue;
