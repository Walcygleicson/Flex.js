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

Test.set("constructor", (args) => {
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
    //Criando um array-like
    const fList = { 0: "test" }
    Object.defineProperty(fList, "length", { value: 0 })

    /////----------------
    args(null).expect(false)
    args([]).expect(false)
    args({ length: 0 }).expect(false)
    args(fList).expect(true)
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


Test.logAll()