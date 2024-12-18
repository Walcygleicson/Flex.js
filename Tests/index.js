import _ from "../Flex.js-v1.0.0/Flex.js";
import { AUX } from "../Flex.js-v1.0.0/Flex.js";
const body = document.body
const btn = document.getElementById("btn")
const form = document.createElement("form")
const proxy = new Proxy({bu: "buu"}, {})
const sym = Symbol("sym-2")
const arr = [1,2,3]
const obj = { name: "walcy", age: 27 }
const set = new Set([1, 3,1, "a"])
const map = new Map([["color", "red"], ["form", "exagon"]])
const list = {}
const weakMap = new WeakMap([[obj, 2]]);
Object.defineProperty(list, "length", { value: 0 })
console.log(new Blob([2,1]))