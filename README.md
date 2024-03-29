# channel-queue
A queue management library with channels.

![Tests status](https://github.com/buttercup/channel-queue/actions/workflows/test.yml/badge.svg) [![npm version](https://badge.fury.io/js/%40buttercup%2Fchannel-queue.svg)](https://www.npmjs.com/package/@buttercup/channel-queue)

## About

This library provides a queue system, organised by channels (or "topics"), that allows for finer-grain control over asynchronous method execution. It allows for queuing tasks by channels (string-based names) - tasks executing sequentially when the previous task is done. It also allows for 3 priority levels : **normal**, **high** and **tail**.

Check out the [API documentation](API.md).

## Installation

Simply run:

```shell
npm install @buttercup/channel-queue --save
```

## Usage
The simplest usage is to just queue some tasks:

```typescript
import { ChannelQueue } from "@buttercup/channel-queue";

const queue = new ChannelQueue();
const work = queue.channel("myChannel").enqueue(() => 123);
// 'work' will resolve with 123

const someChannel = queue.channel("someChannel");
someChannel.enqueue(job1);
someChannel.enqueue(job2);
someChannel.enqueue(job3);
```

You can push tasks above others by setting them as high-priority:

```typescript
import { ChannelQueue, TaskPriority } from "@buttercup/channel-queue";

const queue = new ChannelQueue();
const workChannel = queue.channel("work");
// some other tasks added to the queue...
workChannel.enqueue(importantJobMethod, TaskPriority.High).then(result => {
    // 'result' is the resolved result from the 'importantJobMethod' function
});
```

Tasks can also be run as "low" priority or at the **tail** end of the queue:

```typescript
import { ChannelQueue, TaskPriority } from "@buttercup/channel-queue";

const queue = new ChannelQueue();
const workChannel = queue.channel("work");
// some other tasks added to the queue...
workChannel.enqueue(runNearEnd, TaskPriority.Tail);
```

### Error Handling

Regardless whether an enqueued task fails or not, the channel will continue processing after it's done.

By default, if the task enqueued in `enqueue` throws an error, it will throw at the `enqueue` call:

```typescript
// The following throws:
await channel.enqueue(() => Promise.reject(new Error("Fails!")));
```

You can disable enqueued functions throwing errors by setting `tasksThrow` to `false`:

```typescript
channel.tasksThrow = false;
// The following will not throw:
await channel.enqueue(() => Promise.reject(new Error("Fails!")));
```

Disabling this is really only useful if you use `waitForEmpty` with the `throwForFailures` set to `true`. This allows you to delay error handling until the channel is waited upon:

```typescript
channel.tasksThrow = false;
channel.enqueue(() => /* ... */)
channel.enqueue(() => Promise.reject(new Error("Fails!")));

// Later:
await channel.waitForEmpty({ throwForFailures: true });
```

### Stacking
Items can be "stacked", meaning that if specified, items can be limited to only 1 pending item in queue. All items of the same stack _name_ would simply queue on the same item and not create more tasks. The stack can be specified when enqueuing:

```typescript
import { ChannelQueue } from "@buttercup/channel-queue";

const queue = new ChannelQueue();
const workChannel = queue.channel("work");

const promise1 = workChannel.enqueue(saveWorkFn, undefined, /* Stack ID */ "save");
// work start
const promise2 = workChannel.enqueue(saveWorkFn, undefined, "save");
const promise3 = workChannel.enqueue(saveWorkFn, undefined, "save");
// promise2 and promise3 will be equal, as promise2 was still in the queue when promise3
```

### Parallel Execution
Tasks can be run in parallel using the `ParallelChannel` class. You can create a parallel channel, in place of a regular channel, by calling `ChannelQueue#createParallelChannel`:

```typescript
import { ChannelQueue } from "@buttercup/channel-queue";

const queue = new ChannelQueue();
const workChannel = queue.createParallelChannel("work");
workChannel.enqueue(someTask);

// The same channel can be fetched later using the familiar channel() method:
queue.channel("work"); // The parallel channel
```

Parallel channels, like their name implies, can run tasks in parallel. Instead of running them head-to-tail like regular channels, parallel channels can execute many tasks side-by-side. You can also limit them to a certain number of _threads_ (default is 2) by calling `queue.createParallelChannel("name", 5)` (where `5` is the maximum number of simultaneous tasks).

Parallel channels by default do not run tasks of different priorities simultaneously. This means that if the current running tasks are high-priority, no normal priority tasks will be started. This feature can be disabled by running `parallelChannel.canRunAcrossTaskTypes = true`.

### Waiting and Clearing

You can wait for a channel to empty (having all tasks completed) by using `waitForEmpty`:

```typescript
channel.enqueue(someTask);
channel.enqueue(someTask);

// Later:
await channel.waitForEmpty();
```

You can clear all enqueued items in a `Channel` by calling `clear()`:

```typescript
queue.channel("myChannel").clear();
```

## Development & Supported Node Versions
This library is intended to be used with NodeJS version **6** and later.

To contribute, clone this project and run `npm install` before beginning development.

To test, simply run `npm test`.
