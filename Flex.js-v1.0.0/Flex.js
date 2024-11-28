"use strict"
const flex = {}

// ---- [Infos de Criação da Lib]
flex.ABOUT = Object.freeze({
    name: "Flex",
    version: "1.0.0",
    created: "2024-Brasil",
    author: "Walcygleicson M. Oliveira",
    github: null,
    documents: null
})

// ----- [Conjunto de tipos de dados e objetos]
const NUMBER = "number",
    STRING = "string",
    ARRAY = "array",
    OBJECT = "object",
    FUNCTION = "function",
    SYMBOL = "symbol",
    REGEXP = "regExp",
    ELEMENT = "HTMLElement",
    HTMLCOLLECT = "HTMLCollection",
    NODELIST = "nodeList",
    SET = "set",
    MAP = "map"

// ---------------------------
/** Pacote Interno de Symbols */
const _SYM = (function () {
    const symbol = {}
    /** Token do método de interrupção de loops */
    symbol.break = Symbol("[iteration.break]")

    return symbol
})()

// ---------------------------
/** Pacote Interno de RegExp */
const _REGX = (function () {
    const regex = {}
    return regex
})()

// -------------------------
/** Pacote Interno de Métodos Células dos Módulos Principais. */
const _CELL = (function () {
    const cell = {}
    return cell
})()

// ---------------------------
/** Pacote Interno de Métodos Auxiliares */
const _AUX = (function () {
    const aux = {}
    
    /** Define propriedades congeladas diretamente no *`Object`* alvo de forma rasa ou profunda. */
    // aux.setFreezeProps = (target, obj = {}, deep = true) => {
    //     var value = null
    //     for (let key in obj) {
    //         value = obj[key]
    //         //Processar profundidade
    //         deep && typeof value === "object"? aux.setFreezeProps(value, value, true) : null

    //         Object.defineProperty(target, key, {
    //             value: Object.freeze(value),
    //             writable: false,
    //             enumerable: false,
    //             configurable: false,
    //         })
    //     }
    // }

    return aux
})();

//   ●    ●    ●    ●    ●    ●    ●    ●    ●
// [Flex.js]
// [Módulos Públicos da Lib] ------>


// ----- [Publicar Lib]
const _ = Object.freeze(flex)
export default _
