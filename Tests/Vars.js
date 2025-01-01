export const VAR = {}

VAR.bigStr = "Hello, my name is Walcygleicson Mesquita de Oliveira!"
VAR.bigWrongFakeArr = (function () {
    var fakeArr = {}
    Object.defineProperty(fakeArr, "length", {value: 51})
    for(let i = 0; i < 50; i++){
        fakeArr[i] = "hello " + i
    }
    fakeArr["foo"] = "bar"
    return fakeArr


})()
VAR.bigFakeArr = (function () {
    var fakeArr = {};
    Object.defineProperty(fakeArr, "length", { value: 50 });
    for (let i = 0; i < 50; i++) {
        fakeArr[i] = "hello " + i;
    }
    return fakeArr;
})()

VAR.HTMLElement = (function () {
    var element = document.createElement('div')
    element.classList.add("parentDiv", "elementTest", "foo")
    element.id = "div-id"
    element.innerHTML = "Hello, my name is Walcygleicson Mesquita de Oliveira"
    for(let i = 0; i < 6; i++){
        element.innerHTML += `<div class="child-${i} divNode" id="id-${i}"> DIV ${i} </div>`
    }
    return element
})()

VAR.HTMLCollection = VAR.HTMLElement.children

VAR.nodeList = VAR.HTMLElement.childNodes
VAR.attrsList = VAR.HTMLElement.attributes
VAR.classList = VAR.HTMLElement.classList
VAR.sym = Symbol("test-sym")

/** ["foo", 1.5, "bar", true, Symbol("test-sym")] */
VAR.Set = new Set(["foo", 1.5, "bar", true, VAR.sym])

VAR.Map = new Map([
    ["foo", "bar"],
    ["number", 1.5],
    [VAR.sym, VAR.sym],
    [3.14, "PI"],
    ["PI", 3.14]
])

VAR.arr = [2, true, "foo", "banana", VAR.HTMLElement, "monkey"]
VAR.obj = {
    undefined: undefined,
    foo: "bar",
    number: 1.5,
    name: "Walcy",
    age: 28,
    year: 2024,
}
VAR.arguments = (function (arg1, arg2) {
    return arguments
})("foo", "bar")

VAR.buffer = new ArrayBuffer(8)
VAR.view = new DataView(VAR.buffer)
VAR.num8Array = [1, 5, 8, 10, 3, 6, 11, 88]
VAR.uint8 = new Uint8Array(VAR.num8Array)
VAR.int8 = new Int8Array(VAR.num8Array)
VAR.weakRef = new WeakRef({ name: "wkRef", state: 1.5, lang: "JS" })
VAR.weakMap = new WeakMap([
    [VAR.obj, "obj"],
    [VAR.HTMLElement, "HTMLElement"],
    [VAR.arr, "arr"],
    [VAR.sym, "sym"]
])
VAR.weakSet = new WeakSet([VAR.obj, VAR.buffer, VAR.HTMLCollection, VAR.Map])
VAR.proxy = new Proxy({
    name: "walcy",
    age: 28,
    color: "white",
    eyes: "black"
}, {})
