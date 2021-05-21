export interface Callable<R> {
    (...args: any[]): R;
}

export enum TaskPriority {
    /**
     * Normal task priority
     */
    Normal = "normal",
    /**
     * High task priority
     */
    HighPriority = "high-priority",
    /**
     * Task tail-priority
     */
    Tail = "tail",
}
