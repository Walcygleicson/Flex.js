import _ from "../Flex.js-v1.0.0/Flex.js";

const body = document.body
const btn = document.getElementById("btn")
const proxy = new Proxy({bu: "buu"}, {})

function getNaN(value) {
    return typeof value === "number" && value !== value
}

const nam = "e" * 2

console.log(_.is([], HTMLDivElement, Element, Object))