# channel-queue
A queue management library with channels.

[![Build Status](https://travis-ci.org/buttercup/channel-queue.svg?branch=master)](https://travis-ci.org/buttercup/channel-queue)

## About

This library provides a queue system, organised by channels (or "topics"), that allows for finer-grain control over asynchronous method execution. It allows for queuing tasks by channels (string-based names) - tasks executing sequentially when the previous task is done. It also allows for 3 priority levels : **normal**, **high** and **tail**.

## Installation

Simply run:

```shell
npm install @buttercup/channel-queue --save
```

## Usage
The simplest usage is to just queue some tasks:

```javascript
const ChannelQueue = require("@buttercup/channel-queue");

const queue = new ChannelQueue();
const work = queue.channel("myChannel").enqueue(() => 123);
// 'work' will resolve with 123

const someChannel = queue.channel("someChannel");
someChannel.enqueue(job1);
someChannel.enqueue(job2);
someChannel.enqueue(job3);
```

You can push tasks above others by setting them as high-priority:

```javascript
const ChannelQueue = require("@buttercup/channel-queue");
const { TASK_TYPE_HIGH_PRIORITY } = ChannelQueue.Task;

const queue = new ChannelQueue();
const workChannel = queue.channel("work");
// some other tasks added to the queue...
workChannel.enqueue(importantJobMethod, TASK_TYPE_HIGH_PRIORITY).then(result => {
    // 'result' is the resolved result from the 'importantJobMethod' function
});
```

Tasks can also be run as "low" priority or at the **tail** end of the queue:

```javascript
const ChannelQueue = require("@buttercup/channel-queue");
const { TASK_TYPE_TAIL } = ChannelQueue.Task;

const queue = new ChannelQueue();
const workChannel = queue.channel("work");
// some other tasks added to the queue...
workChannel.enqueue(runNearEnd, TASK_TYPE_TAIL);
```

## Development & Supported Node Versions
This library is intended to be used with NodeJS version **6** and later.

To contribute, clone this project and run `npm install` before beginning development.

To test, simply run `npm test`.
