const ChannelQueue = require("./ChannelQueue.js");
const Channel = require("./Channel.js");
const Task = require("./Task.js");

Object.assign(ChannelQueue, {
    Channel,
    Task
});

module.exports = ChannelQueue;
