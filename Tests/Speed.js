
export default function Speed(fn, ...args) {
    speedLog(fn, ...args)

    return {
        times(num = 0) {
            num = num > 0? num -1 : num
            for(let i = 0; i < num; i++){
                speedLog(fn, ...args)
            }
        }
    }
}

const speedLog = (fn, ...args) => {
    const logName = (fn.name || "Speed")
    let res
    console.time(logName)
    res = fn(...args)
    console.timeEnd(logName)
    console.log("Output: ", res, "\n-")
}