import Testool from "../Testool/Testool.js"
import _ from "../../Flex.js-v1.0.0/Flex.js"
import { VAR } from "../Vars.js"
const Class = (function () {
    class Class {
        constructor() {
            this.value = 1
            this.foo = "foo"
            this.length = 2
        }

        get num() { return 80 }
        mtd(){}
    }

    return new Class()
})()
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
    argments = (function () { return arguments })(1,2),
    attrs = div.attributes
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
const nullObj = Object.create(null)
const arr = ["foo", "bar", 1.5, true]
const wkMap = new WeakMap([[o, 2]])
const wkRef = new WeakRef({ foo: "foo", num: 2.4 })
const wkSet = new WeakSet([o, map])

const buffer = new ArrayBuffer(1, 2.5, 7, 8)
const view = new DataView(buffer)
const uint8 = new Uint8Array(buffer)
const bigint = 3284875500n
const bigInt64Array = new BigInt64Array(12)

//////////////////////////////////////////////
// #region [TESTS] -------------------------------

Test.set("type", (args) => {
    args(NaN).expect("NaN")
    args(1).expect("Number")
    args("Hello").expect("String")
    args([]).expect("Array")
    args({}).expect("Object")
    args(function () { }).expect("Function")
    args(null).expect("Null")
    args(window).expect("Window")
    args(div).expect("HTMLElement")
    args(ndList).expect("NodeList")
    args(HTMLCollct).expect("HTMLCollection")
    args(document).expect("HTMLDocument")
    args(comment).expect("Comment")
    
})

Test.set("is", (args) => {
    args(NaN, Number).expect(false)
    args(NaN, "Number").expect(false)
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
    args(1, "String", "Number", "Array").expect(true)
    args(1, "String", "Array").expect(false);
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
    args(set).expect(true)
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
    args(set).expect(false)
    args(div).expect(true)
    args(HTMLCollct).expect(false)
    args(buffer).expect(true)
})

Test.set("keys", (args) => {
    args(o).expect(["name", "age"])
    args(set).expect(undefined)
    args(map).expect(["foo", "say", 1, sym])
    args(fakeArr).expect(["0"])
    args(prox).expect([])
    args(null).expect(undefined)
    args(o, 1).expect("age")
    args(o, 10).expect(undefined)
    args(div).expect([])
    args(buffer).expect([])
    args(wkMap).expect([])
    args(wkRef).expect(["foo", "num"])
})

Test.set("values", (args) => {
    args(o).expect(["foo", 23])
    args(set).expect(["foo", 1, true, Symbol])
    args(map).expect(["bar", "hello", true, true])
    args([1, 2, 3, "foo"]).expect(undefined)
    args(fakeArr).expect(["foo"])
    args(buffer).expect([])
    args(view).expect(undefined)
    args(wkRef).expect(["foo", 2.4])
    args(wkRef, 1).expect(2.4)
    args(wkMap).expect(undefined)
})

Test.set("isList", (args) => {
    args(null).expect(false)
    args([]).expect(true)
    args(function () { }).expect(false)
    args(fakeArr).expect(true)
    args(o).expect(false)
    args(argments).expect(true)
    args(div).expect(false)
    args(ndList).expect(true)
    args(domTokemList).expect(true)
    args(div.attributes).expect(true)
    args(set).expect(true)
    args(view).expect(true)
    args(uint8).expect(true)
    args(buffer).expect(false) // Buffer de array não é uma lista
})

Test.set("JSONParse", (args) => {
    args('{"foo": "bar"}').expect({ foo: "bar" })
    args('[1, "hello"]').expect([1, "hello"])
    args("hello").expect(undefined)
    args(undefined).expect(undefined)
    args("1").expect(1)
    args('"1"').expect("1")
})

Test.set("nullDict", (args) => {
    args().expect(nullObj)
    args().exam(({ output }) => {
        // Testar se foi criado sem prototype
        if (Object.getPrototypeOf(output) === null) {
            return true
        }
    })
})

Test.set("unproto", (args) => {
    const obj = {}
    const arr = []

    args(null).expect(undefined)
    args(undefined).expect(undefined)
    args(obj).exam(() => {
        if (Object.getPrototypeOf(obj) === null) {
            return true
        }
    })
    args(arr).exam(() => {
        if (Object.getPrototypeOf(arr) === null) {
            return true;
        }
    });
})

Test.set("len", (args) => {
    /** FakeArr com length errado */
    const fArr = { 0: "foo", 1: "buu" }
    Object.defineProperty(fArr, "length", {value: 5})
    args("hello").expect(5)
    args(o).expect(2)
    args(arr).expect(4)
    args(fakeArr).expect(1)
    args(ndList).expect(0)
    args(HTMLCollct).expect(0)
    args(argments).expect(2)
    args(set).expect(4)
    args(map).expect(4)
    args(attrs).expect(1)
    args(undefined).expect(undefined)
    args(12.5).expect(undefined)
    args(wkMap).expect(undefined)
    args(wkRef).expect()
    args(Test).expect(0)
    args(div).expect(0)
    args(Class).expect(3)
    args(fArr).expect(2)

})

Test.set("getProp", (args) => {
    args(o, "foo", "age").expect(23)
    args(o, "foo", "bar").expect(undefined)
    args("hello").expect(undefined)
    args(map, "x", "foo").expect("bar")
    args(wkMap, o).expect(2)
    args(wkRef, "foo").expect("foo")
    args(set, "foo").expect(undefined)
    args(wkSet, o).expect(undefined)
})

Test.set("isTypedArray", (args) => {
    args(uint8).expect(true)
    args(view).expect(false)
    args(null).expect(false)
    args(arr).expect(false)
    args(undefined).expect(undefined)
    args(bigInt64Array).expect(true)
    args(buffer).expect(false)
})

Test.set("isInt", (args) => {
    args(1).expect(true)
    args(-1).expect(true)
    args("1").expect(true)
    args("-1").expect(true)
    args("oi").expect(undefined)
    args(null).expect(undefined)
    args("1.0").expect(true)
    args(NaN).expect(undefined)
    args(2345n).expect(true)
})

Test.set("capitalize", (args) => {
    args("hello").expect("Hello")
    args("   hello").expect("   Hello")
    args("** hello").expect("** Hello")
    args("hello world").expect("Hello world")
    args(" 1 hello").expect(" 1 hello")
    args(" heLLo").expect(" HeLLo")
})

Test.set("isUpper", (args) => {
    args("HELLO").expect(true)
    args("hello").expect(false)
    args("1HELLO").expect(true)
    args("1HELLo").expect(false)
    args("").expect(undefined)
    args(" ").expect(undefined)
    args("123").expect(undefined)
    args("123e").expect(false)
    args("123E").expect(true)
    args(1).expect(undefined)
    args("...Ç").expect(true)
    args("^").expect(undefined)
})

Test.set("isLower", (args) => {
    args("hello").expect(true)
    args("HELLO").expect(false)
    args("1hello").expect(true)
    args("1hellO").expect(false)
    args("").expect(undefined)
    args(" ").expect(undefined)
    args("123").expect(undefined)
    args("123e").expect(true)
    args("123E").expect(false)
    args(1).expect(undefined)
    args("...ç").expect(true)
})

Test.set("last", (args) => {
    args("oi").expect("i")
    const lasChild = VAR.HTMLCollection[VAR.HTMLCollection.length - 1]
    args(VAR.HTMLCollection).expect(lasChild)
    args(VAR.nodeList).expect(lasChild)
    args(VAR.Map).expect(3.14)
    args(VAR.Set).expect(VAR.sym)
    args(VAR.arr).expect("monkey")
    args(VAR.obj).expect(2024)
    args(VAR.arguments).expect("bar")
    args(VAR.buffer).expect(undefined)
    args(VAR.view).expect(undefined)
    args(VAR.uint8).expect(88)
    args(VAR.int8).expect(88)
    args(1).expect(undefined)
    args(VAR.weakRef).expect("JS")
    args(VAR.weakMap).expect()
    args(VAR.proxy).expect("black")
    args([]).expect(undefined)
})

Test.set("findKey", (args) => {
    args(VAR.obj, "hello", "age", 'buu').expect("age")
    args(VAR.Map, "buu", "luu", "foo").expect("foo")
    args(VAR.weakMap, [], VAR.sym).expect(VAR.sym)
    args(VAR.weakRef, "foo", "lang").expect("lang")
    args(VAR.arr, 12, 1).expect(1)
    args(VAR.obj, "xu", "luu", "undefined").expect("undefined")
    args(VAR.Set, "9", "3").expect("3")
    args(VAR.arguments, "7", "1").expect("1")
    args(VAR.uint8, 9, 3).expect(3)
    args(VAR.weakSet, -1, 2).expect(undefined)
})
// #endregion

///////////////////////////
Test.logAll()
//Test.logOnly("getProp")
//Test.logLast(true)