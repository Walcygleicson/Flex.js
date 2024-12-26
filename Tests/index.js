
import _ from "../Flex.js-v1.0.0/Flex.js";

import { AUX } from "../Flex.js-v1.0.0/Flex.js";
import benchmark from "./Benchmark.js";
const speed = (fn, ...args)=>{
    console.time("Speed: ")
    fn(...args)
    console.timeEnd("Speed: ")
}
const body = document.body
const btn = document.getElementById("btn")
const form = document.createElement("form")
const proxy = new Proxy({bu: "buu"}, {})
const sym = Symbol("sym-2")
const arr = [1,2,3]
const ob = { name: "walcy", age: 27 }
const set = new Set([1, 3,1, "a"])
const map = new Map([["color", "red"], ["form", "exagon"]])
const bigint = 394856500n
const fakeArr = {0: "foo", 1: "bar", "2.0": "bu"}
const weakMap = new WeakMap([[ob, 2]]);
const weakRef = new WeakRef({
    name: "Walcy",
    age: 28
})
const bigfloat = 11111111111491018.0123456789012345
Object.defineProperty(fakeArr, "length", { value: 2 })
