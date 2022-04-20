export interface Callable<R> {
    (...args: any[]): R;
}

export enum ErrorCode {
    TaskTimeout = "TASKTIMEOUT"
}

/**
 * Task Priority
 * @typedef {TaskPriority.Normal|TaskPriority.High|TaskPriority.Tail} TaskPriority
 */
export enum TaskPriority {
    /**
     * Normal task priority
     */
    Normal = "normal",
    /**
     * High task priority
     */
    High = "high-priority",
    /**
     * Task tail-priority
     */
    Tail = "tail"
}
