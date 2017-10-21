## Classes

<dl>
<dt><a href="#Channel">Channel</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>Channel class (queue)</p>
</dd>
<dt><a href="#ChannelQueue">ChannelQueue</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>ChannelQueue class, for managing channels</p>
</dd>
<dt><a href="#Task">Task</a></dt>
<dd><p>Internal Task class, for handling executions</p>
</dd>
</dl>

<a name="Channel"></a>

## Channel ⇐ <code>EventEmitter</code>
Channel class (queue)

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  
<a name="Channel+start"></a>

### channel.start() ⇒ <code>Boolean</code>
Start processing the queue
Will automatically return early if queue has already started

**Kind**: instance method of [<code>Channel</code>](#Channel)  
**Returns**: <code>Boolean</code> - Returns true if started, false if already started  
**Emits**: <code>Channel#event:started</code>  
<a name="ChannelQueue"></a>

## ChannelQueue ⇐ <code>EventEmitter</code>
ChannelQueue class, for managing channels

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  
<a name="Task"></a>

## Task
Internal Task class, for handling executions

**Kind**: global class  
