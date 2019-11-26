## Classes

<dl>
<dt><a href="#Channel">Channel</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>Channel class (queue)</p>
</dd>
<dt><a href="#ChannelQueue">ChannelQueue</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>ChannelQueue class, for managing channels</p>
</dd>
<dt><a href="#ParallelChannel">ParallelChannel</a> ⇐ <code><a href="#Channel">Channel</a></code></dt>
<dd><p>ParallelChannel class (queue)</p>
</dd>
<dt><a href="#Task">Task</a></dt>
<dd><p>Internal Task class, for handling executions</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#TASK_TYPE_NORMAL">TASK_TYPE_NORMAL</a> : <code>String</code></dt>
<dd><p>Normal task priority</p>
</dd>
<dt><a href="#TASK_TYPE_HIGH_PRIORITY">TASK_TYPE_HIGH_PRIORITY</a> : <code>String</code></dt>
<dd><p>High task priority</p>
</dd>
<dt><a href="#TASK_TYPE_TAIL">TASK_TYPE_TAIL</a> : <code>String</code></dt>
<dd><p>Task tail-priority</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TaskPriority">TaskPriority</a> : <code><a href="#TASK_TYPE_NORMAL">TASK_TYPE_NORMAL</a></code> | <code><a href="#TASK_TYPE_HIGH_PRIORITY">TASK_TYPE_HIGH_PRIORITY</a></code> | <code><a href="#TASK_TYPE_TAIL">TASK_TYPE_TAIL</a></code></dt>
<dd><p>Task priority</p>
</dd>
</dl>

<a name="Channel"></a>

## Channel ⇐ <code>EventEmitter</code>
Channel class (queue)

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [Channel](#Channel) ⇐ <code>EventEmitter</code>
    * [new Channel(name)](#new_Channel_new)
    * [.autostart](#Channel+autostart) : <code>Boolean</code>
    * [.isEmpty](#Channel+isEmpty) : <code>Boolean</code>
    * [.isRunning](#Channel+isRunning) : <code>Boolean</code>
    * [.tasks](#Channel+tasks) : [<code>Array.&lt;Task&gt;</code>](#Task)
    * [.clear([priorityType])](#Channel+clear)
    * [.enqueue(item, [type], [stack])](#Channel+enqueue) ⇒ <code>Promise</code>
    * [.getStackedItems(stack)](#Channel+getStackedItems) ⇒ [<code>Array.&lt;Task&gt;</code>](#Task)
    * [.retrieveNextItem()](#Channel+retrieveNextItem) ⇒ [<code>Task</code>](#Task) \| <code>undefined</code>
    * [.sort()](#Channel+sort)
    * [.start()](#Channel+start) ⇒ <code>Boolean</code>

<a name="new_Channel_new"></a>

### new Channel(name)
Constructor for a Channel


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the channel |

<a name="Channel+autostart"></a>

### channel.autostart : <code>Boolean</code>
Whether the execution should start automatically or not
Defaults to true

**Kind**: instance property of [<code>Channel</code>](#Channel)  
<a name="Channel+isEmpty"></a>

### channel.isEmpty : <code>Boolean</code>
Whether the queue is empty or not

**Kind**: instance property of [<code>Channel</code>](#Channel)  
**Read only**: true  
<a name="Channel+isRunning"></a>

### channel.isRunning : <code>Boolean</code>
Whether the queue is currently running or not

**Kind**: instance property of [<code>Channel</code>](#Channel)  
**Read only**: true  
<a name="Channel+tasks"></a>

### channel.tasks : [<code>Array.&lt;Task&gt;</code>](#Task)
Array of tasks (in queue)

**Kind**: instance property of [<code>Channel</code>](#Channel)  
**Read only**: true  
<a name="Channel+clear"></a>

### channel.clear([priorityType])
Remove all pending tasks from the channel

**Kind**: instance method of [<code>Channel</code>](#Channel)  

| Param | Type | Description |
| --- | --- | --- |
| [priorityType] | <code>String</code> | Optional priority type to clear  only tasks with a certain priority value |

<a name="Channel+enqueue"></a>

### channel.enqueue(item, [type], [stack]) ⇒ <code>Promise</code>
Enqueues a function

**Kind**: instance method of [<code>Channel</code>](#Channel)  
**Returns**: <code>Promise</code> - A promise that eventually resolves with the result from the
 enqueued function or promise  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>function</code> \| <code>Promise</code> |  | The item to place into the queue |
| [type] | [<code>TaskPriority</code>](#TaskPriority) |  | The task priority to use |
| [stack] | <code>String</code> | <code></code> | The stack name |

<a name="Channel+getStackedItems"></a>

### channel.getStackedItems(stack) ⇒ [<code>Array.&lt;Task&gt;</code>](#Task)
Get all task items for a stack name

**Kind**: instance method of [<code>Channel</code>](#Channel)  
**Returns**: [<code>Array.&lt;Task&gt;</code>](#Task) - An array of task instances  

| Param | Type | Description |
| --- | --- | --- |
| stack | <code>String</code> | The stack name |

<a name="Channel+retrieveNextItem"></a>

### channel.retrieveNextItem() ⇒ [<code>Task</code>](#Task) \| <code>undefined</code>
Get the next queued Task instance
This modifies the task queue by removing the task

**Kind**: instance method of [<code>Channel</code>](#Channel)  
**Returns**: [<code>Task</code>](#Task) \| <code>undefined</code> - A task instance if there are any in queue  
<a name="Channel+sort"></a>

### channel.sort()
Sort the tasks

**Kind**: instance method of [<code>Channel</code>](#Channel)  
<a name="Channel+start"></a>

### channel.start() ⇒ <code>Boolean</code>
Start processing the queue
Will automatically return early if queue has already started

**Kind**: instance method of [<code>Channel</code>](#Channel)  
**Returns**: <code>Boolean</code> - Returns true if started, false if already started  
**Emits**: <code>Channel#event:started</code>, <code>Channel#event:stopped</code>  
<a name="ChannelQueue"></a>

## ChannelQueue ⇐ <code>EventEmitter</code>
ChannelQueue class, for managing channels

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [ChannelQueue](#ChannelQueue) ⇐ <code>EventEmitter</code>
    * [.channels](#ChannelQueue+channels) : <code>Object</code>
    * [.createChannel(name)](#ChannelQueue+createChannel) ⇒ [<code>Channel</code>](#Channel)
    * [.createParallelChannel(name, [parallelism])](#ChannelQueue+createParallelChannel) ⇒ [<code>ParallelChannel</code>](#ParallelChannel)
    * [.channel(name)](#ChannelQueue+channel) ⇒ [<code>Channel</code>](#Channel)
    * [.channelExists(name)](#ChannelQueue+channelExists) ⇒ <code>Boolean</code>

<a name="ChannelQueue+channels"></a>

### channelQueue.channels : <code>Object</code>
The channels

**Kind**: instance property of [<code>ChannelQueue</code>](#ChannelQueue)  
<a name="ChannelQueue+createChannel"></a>

### channelQueue.createChannel(name) ⇒ [<code>Channel</code>](#Channel)
Create a new channel

**Kind**: instance method of [<code>ChannelQueue</code>](#ChannelQueue)  
**Returns**: [<code>Channel</code>](#Channel) - The new channel  
**Throws**:

- <code>Error</code> Throws if the channel already exists


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The channel name |

<a name="ChannelQueue+createParallelChannel"></a>

### channelQueue.createParallelChannel(name, [parallelism]) ⇒ [<code>ParallelChannel</code>](#ParallelChannel)
Create a new parallel channel
Creates a special channel that supports running several tasks in parallel.

**Kind**: instance method of [<code>ChannelQueue</code>](#ChannelQueue)  
**Returns**: [<code>ParallelChannel</code>](#ParallelChannel) - The new channel  
**Throws**:

- <code>Error</code> Throws if the channel already exists


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the channel |
| [parallelism] | <code>Number</code> | Optional number of maximum parallel tasks |

<a name="ChannelQueue+channel"></a>

### channelQueue.channel(name) ⇒ [<code>Channel</code>](#Channel)
Get channel by name
Creates a new channel automatically if it doesn't yet exist

**Kind**: instance method of [<code>ChannelQueue</code>](#ChannelQueue)  
**Returns**: [<code>Channel</code>](#Channel) - The channel which was requested  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The channel name |

<a name="ChannelQueue+channelExists"></a>

### channelQueue.channelExists(name) ⇒ <code>Boolean</code>
Check if a channel exists

**Kind**: instance method of [<code>ChannelQueue</code>](#ChannelQueue)  
**Returns**: <code>Boolean</code> - True if it exists  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the channel |

<a name="ParallelChannel"></a>

## ParallelChannel ⇐ [<code>Channel</code>](#Channel)
ParallelChannel class (queue)

**Kind**: global class  
**Extends**: [<code>Channel</code>](#Channel)  

* [ParallelChannel](#ParallelChannel) ⇐ [<code>Channel</code>](#Channel)
    * [.isEmpty](#ParallelChannel+isEmpty) : <code>Boolean</code>
    * [.parallelism](#ParallelChannel+parallelism) : <code>Number</code>
    * [.runningTasks](#ParallelChannel+runningTasks) : [<code>Array.&lt;Task&gt;</code>](#Task)
    * [.autostart](#Channel+autostart) : <code>Boolean</code>
    * [.isRunning](#Channel+isRunning) : <code>Boolean</code>
    * [.tasks](#Channel+tasks) : [<code>Array.&lt;Task&gt;</code>](#Task)
    * [.clear([priorityType])](#Channel+clear)
    * [.enqueue(item, [type], [stack])](#Channel+enqueue) ⇒ <code>Promise</code>
    * [.getStackedItems(stack)](#Channel+getStackedItems) ⇒ [<code>Array.&lt;Task&gt;</code>](#Task)
    * [.retrieveNextItem()](#Channel+retrieveNextItem) ⇒ [<code>Task</code>](#Task) \| <code>undefined</code>
    * [.sort()](#Channel+sort)
    * [.start()](#Channel+start) ⇒ <code>Boolean</code>

<a name="ParallelChannel+isEmpty"></a>

### parallelChannel.isEmpty : <code>Boolean</code>
Whether the queue is empty or not

**Kind**: instance property of [<code>ParallelChannel</code>](#ParallelChannel)  
**Overrides**: [<code>isEmpty</code>](#Channel+isEmpty)  
**Read only**: true  
<a name="ParallelChannel+parallelism"></a>

### parallelChannel.parallelism : <code>Number</code>
The amount of allowed parallel executed tasks

**Kind**: instance property of [<code>ParallelChannel</code>](#ParallelChannel)  
**Read only**: true  
<a name="ParallelChannel+runningTasks"></a>

### parallelChannel.runningTasks : [<code>Array.&lt;Task&gt;</code>](#Task)
Get the currently running tasks

**Kind**: instance property of [<code>ParallelChannel</code>](#ParallelChannel)  
**Read only**: true  
<a name="Channel+autostart"></a>

### parallelChannel.autostart : <code>Boolean</code>
Whether the execution should start automatically or not
Defaults to true

**Kind**: instance property of [<code>ParallelChannel</code>](#ParallelChannel)  
<a name="Channel+isRunning"></a>

### parallelChannel.isRunning : <code>Boolean</code>
Whether the queue is currently running or not

**Kind**: instance property of [<code>ParallelChannel</code>](#ParallelChannel)  
**Read only**: true  
<a name="Channel+tasks"></a>

### parallelChannel.tasks : [<code>Array.&lt;Task&gt;</code>](#Task)
Array of tasks (in queue)

**Kind**: instance property of [<code>ParallelChannel</code>](#ParallelChannel)  
**Read only**: true  
<a name="Channel+clear"></a>

### parallelChannel.clear([priorityType])
Remove all pending tasks from the channel

**Kind**: instance method of [<code>ParallelChannel</code>](#ParallelChannel)  

| Param | Type | Description |
| --- | --- | --- |
| [priorityType] | <code>String</code> | Optional priority type to clear  only tasks with a certain priority value |

<a name="Channel+enqueue"></a>

### parallelChannel.enqueue(item, [type], [stack]) ⇒ <code>Promise</code>
Enqueues a function

**Kind**: instance method of [<code>ParallelChannel</code>](#ParallelChannel)  
**Returns**: <code>Promise</code> - A promise that eventually resolves with the result from the
 enqueued function or promise  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>function</code> \| <code>Promise</code> |  | The item to place into the queue |
| [type] | [<code>TaskPriority</code>](#TaskPriority) |  | The task priority to use |
| [stack] | <code>String</code> | <code></code> | The stack name |

<a name="Channel+getStackedItems"></a>

### parallelChannel.getStackedItems(stack) ⇒ [<code>Array.&lt;Task&gt;</code>](#Task)
Get all task items for a stack name

**Kind**: instance method of [<code>ParallelChannel</code>](#ParallelChannel)  
**Returns**: [<code>Array.&lt;Task&gt;</code>](#Task) - An array of task instances  

| Param | Type | Description |
| --- | --- | --- |
| stack | <code>String</code> | The stack name |

<a name="Channel+retrieveNextItem"></a>

### parallelChannel.retrieveNextItem() ⇒ [<code>Task</code>](#Task) \| <code>undefined</code>
Get the next queued Task instance
This modifies the task queue by removing the task

**Kind**: instance method of [<code>ParallelChannel</code>](#ParallelChannel)  
**Returns**: [<code>Task</code>](#Task) \| <code>undefined</code> - A task instance if there are any in queue  
<a name="Channel+sort"></a>

### parallelChannel.sort()
Sort the tasks

**Kind**: instance method of [<code>ParallelChannel</code>](#ParallelChannel)  
<a name="Channel+start"></a>

### parallelChannel.start() ⇒ <code>Boolean</code>
Start processing the queue
Will automatically return early if queue has already started

**Kind**: instance method of [<code>ParallelChannel</code>](#ParallelChannel)  
**Returns**: <code>Boolean</code> - Returns true if started, false if already started  
**Emits**: <code>Channel#event:started</code>, <code>Channel#event:stopped</code>  
<a name="Task"></a>

## Task
Internal Task class, for handling executions

**Kind**: global class  

* [Task](#Task)
    * [new Task(item, [type], [stack])](#new_Task_new)
    * [.created](#Task+created) : <code>Number</code>
    * [.queuedPromise](#Task+queuedPromise) : <code>Promise</code>
    * [.stack](#Task+stack) : <code>String</code>
    * [.target](#Task+target) : <code>function</code>
    * [.type](#Task+type) : [<code>TaskPriority</code>](#TaskPriority)
    * [.execute()](#Task+execute) ⇒ <code>Promise</code>

<a name="new_Task_new"></a>

### new Task(item, [type], [stack])
Constructor for a Task


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>function</code> \| <code>Promise</code> |  | The item to enqueue |
| [type] | [<code>TaskPriority</code>](#TaskPriority) |  | The priority to set |
| [stack] | <code>String</code> | <code></code> | The stack name |

<a name="Task+created"></a>

### task.created : <code>Number</code>
Creation timestamp

**Kind**: instance property of [<code>Task</code>](#Task)  
**Read only**: true  
<a name="Task+queuedPromise"></a>

### task.queuedPromise : <code>Promise</code>
Promise which resolves when work has completed

**Kind**: instance property of [<code>Task</code>](#Task)  
<a name="Task+stack"></a>

### task.stack : <code>String</code>
The stack name

**Kind**: instance property of [<code>Task</code>](#Task)  
<a name="Task+target"></a>

### task.target : <code>function</code>
The target function

**Kind**: instance property of [<code>Task</code>](#Task)  
<a name="Task+type"></a>

### task.type : [<code>TaskPriority</code>](#TaskPriority)
The task priority type

**Kind**: instance property of [<code>Task</code>](#Task)  
<a name="Task+execute"></a>

### task.execute() ⇒ <code>Promise</code>
Execute the task

**Kind**: instance method of [<code>Task</code>](#Task)  
<a name="TASK_TYPE_NORMAL"></a>

## TASK_TYPE_NORMAL : <code>String</code>
Normal task priority

**Kind**: global variable  
<a name="TASK_TYPE_HIGH_PRIORITY"></a>

## TASK_TYPE_HIGH_PRIORITY : <code>String</code>
High task priority

**Kind**: global variable  
<a name="TASK_TYPE_TAIL"></a>

## TASK_TYPE_TAIL : <code>String</code>
Task tail-priority

**Kind**: global variable  
<a name="TaskPriority"></a>

## TaskPriority : [<code>TASK_TYPE_NORMAL</code>](#TASK_TYPE_NORMAL) \| [<code>TASK_TYPE_HIGH_PRIORITY</code>](#TASK_TYPE_HIGH_PRIORITY) \| [<code>TASK_TYPE_TAIL</code>](#TASK_TYPE_TAIL)
Task priority

**Kind**: global typedef  
