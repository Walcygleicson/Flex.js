import Testool from "../Testool/Testool.js"
import _ from "../../Flex.js-v1.0.0/Flex.js"

// Iniciar teste para Flex.js - Módulos principais
const Test = new Testool({
    name: "Flex",
    title: "Teste dos módulos públicos da lib Flex.js",
    root: _
})
///// -------------------
const div = document.createElement("div")
div.setAttribute("class", "test-div")
    
const ndList = div.childNodes,
    HTMLCollct = div.children,
    comment = document.createComment("comentário HTML"),
    domTokemList = div.classList,
    argments = (function(){return arguments})()
//--- [Declarações dos métodos]
const fakeArr = { 0: "foo" }
Object.defineProperty(fakeArr, "length", { value: 1 })
const sym = Symbol("test")
const o = { name: "foo", age: 23 };
Object.defineProperty(o, "id", { value: 1 });
const set = new Set(["foo", "foo", 1, true, Symbol])
const map = new Map([
    ["foo", "bar"],
    ["say", "hello"],
    [1, true],
    [sym, true],
])
const prox = new Proxy({}, {})

//////////////////////////////////////////////
Test.set("type", (args) => {
    args(NaN).expect("NaN")
    args(1).expect("number")
    args("Hello").expect("string")
    args([]).expect("array")
    args({}).expect("object")
    args(function () { }).expect("function")
    args(null).expect("null")
    args(window).expect("window")
    args(div).expect("HTMLElement")
    args(ndList).expect("nodeList")
    args(HTMLCollct).expect("HTMLCollection")
    args(document).expect("HTMLDocument")
    args(comment).expect("comment")
    
})

Test.set("is", (args) => {
    args(NaN, Number).expect(false)
    args(NaN, "number").expect(false)
    args(NaN, Number, NaN).expect(true) // Teste NaN por valor.
    args(NaN, Number, "NaN").expect(true) // Teste NaN por tipo.
    args(NaN, 0).expect(false)
    args(div, String, "HTMLElement").expect(true)
    args(div, Number, HTMLElement).expect(true)
    args(div, Number, Element).expect(true)
    args(div, Number, HTMLDivElement).expect(true)
    args(div, Number, HTMLBodyElement).expect(false);
    args(div, Number, Object).expect(false)
    args([], Array).expect(true)
    args([], Object).expect(false)
    args(new Object([]), Object).expect(false)
    args().expect(undefined) //Se todos os parâmetros omitidos.
    args(1, "string", "number", "array").expect(true)
    args(1, "string", "array").expect(false);
    args(1).expect(undefined) // Se o último param omitido.
    args(1, String).expect(false)
})

Test.set("constructorOf", (args) => {
    args(0).expect(Number)
    args(null).expect()
    args(NaN).expect(Number)
    args("").expect(String)
    args([]).expect(Array)
    args({}).expect(Object)
    args(Symbol()).expect(Symbol)
    args(function () { }).expect(Function)
    args(new Proxy({}, {})).expect(Object)
    args(div).expect(HTMLDivElement)
    args(ndList).expect(NodeList)
    
})

Test.set("isPrimitive", (args) => {
    args().expect(true)
    args(1).expect(true)
    args(null).expect(true)
    args(23243n).expect(true)
    args(0x02).expect(true)
    args([]).expect(false)
    args(Symbol()).expect(true)
    args(function () { }).expect(false)
    args({}).expect(false)
    args(div).expect(false)
})

Test.set("isArrayLike", (args) => {

    /////----------------
    args(null).expect(false)
    args([]).expect(false)
    args({ length: 0 }).expect(false)
    args(fakeArr).expect(true)
    args().expect(false)
    args(div).expect(false)
    args(ndList).expect(true)
    args(HTMLCollct).expect(true)
    args(domTokemList).expect(true)
    args(window).expect(false)
    args(argments).expect(true)
    args(document.styleSheets).expect(true)
    args(div.attributes).expect(true)
})

Test.set("typeof", (args) => {
    args(null).expect("null")
    args({}).expect("object")
    args(function () { }).expect("function")
    args([]).expect("object")
})

Test.set("isNaN", (args) => {
    args(1).expect(false)
    args(0).expect(false)
    args(0.1).expect(false)
    args("foo").expect(false)
    args("1").expect(false)
    args(NaN).expect(true)
    args(null).expect(false)
    args(undefined + null).expect(true)
    args(2 - "abc").expect(true)
})

Test.set("isNil", (args) => {
    args(null).expect(true)
    args(undefined).expect(true)
    args(0).expect(false)
    args(0.0).expect(false)
    args(false).expect(false)
    args(NaN).expect(false)
    args("").expect(false)
    args(void true).expect(true)
})

Test.set("isDict", (args) => {
    args(null).expect(false)
    args({}).expect(true)
    args([]).expect(false)
    args(function () { }).expect(false)
    args("foo").expect(false)
    args(argments).expect(false)
    args(fakeArr).expect(false) // FakeArr é considerado um List, por mais que Flex.type => "object", sua estrutura é de um array-like
    args(prox).expect(true)
    args(Test).expect(true)
})

Test.set("keys", (args) => {
    args(o).expect(["name", "age"])
    args(set).expect(undefined)
    args(map).expect(["foo", "say", 1, sym])
    args(fakeArr).expect(undefined)
    args(prox).expect([])
    args(null).expect(undefined)
    args(o, 1).expect("age")
    args(o, 10).expect(undefined)
})

Test.logLast(true)