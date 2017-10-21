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

    /**
     * The channels
     * @type {Object}
     */
    get channels() {
        return this._channels;
    }

    /**
     * Create a new channel
     * @param {String} name The channel name
     * @returns {Channel} The new channel
     * @throws {Error} Throws if the channel already exists
     */
    createChannel(name) {
        if (this.channelExists(name)) {
            throw new Error(`Cannot create channel: channel already exists: ${name}`);
        }
        this.channels[name] = new Channel(name);
        return this.channels[name];
    }

    /**
     * Get channel by name
     * Creates a new channel automatically if it doesn't yet exist
     * @param {String} name The channel name
     * @returns {Channel} The channel which was requested
     */
    channel(name) {
        if (this.channelExists(name) !== true) {
            return this.createChannel(name);
        }
        return this.channels[name];
    }

    /**
     * Check if a channel exists
     * @param {String} name The name of the channel
     * @returns {Boolean} True if it exists
     */
    channelExists(name) {
        return this.channels.hasOwnProperty(name);
    }

}

module.exports = ChannelQueue;
