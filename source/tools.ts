import { Layerr } from "layerr";
import { ErrorCode } from "./types";

export function timeLimit<T>(promise: Promise<T>, time: number): Promise<T | void> {
    let timeout: ReturnType<typeof setTimeout>;
    return Promise.race([
        promise,
        new Promise<void>((_, reject) => {
            timeout = setTimeout(() => {
                reject(
                    new Layerr(
                        {
                            info: {
                                code: ErrorCode.TaskTimeout
                            }
                        },
                        `Timed-out waiting for task: ${time} ms`
                    )
                );
            }, time);
        })
    ]).then(result => {
        clearTimeout(timeout);
        return result;
    });
}
