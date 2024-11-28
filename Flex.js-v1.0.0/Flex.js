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
    const regex = {};
    /** Testa se uma string começa com uma sequencia (sigla) de letras maiúsculas. */
    regex.startAcronym = /^([A-Z]{2,})/;
    return regex;
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

    aux.arrfy = ()=>{}
    
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

// [ANY] ________________________________________________

/** * *`[any]`*
 * ---
 * * Retorna uma *`String`* indicando o tipo de um dado ou objeto.
 * ---
 * @param {*} target > Um dado ou objeto.
 * @returns {Type}
 */
flex.type = (target) => {
    // Retornar de imediato "HTMLElement" caso seja uma instância de...
    if (target instanceof HTMLElement) { return ELEMENT; }
    // Obter tipo pelo prototype
    target = Object.prototype.toString.call(target).slice(8, -1);
    // Retornar de imediato se for um tipo que comece com siglas a maiúsulas, como HTMLCollection, HTMLDocument e etc.
    if (_REGX.startAcronym.test(target)) { return target; }
    return target.charAt(0).toLowerCase() + target.slice(1);
}

/** * *`[any]`*
 * ---
 * * Testa se o tipo de um dado ou objeto corresponde a pelo menos um dos tipos especificados em *`(...types)`* e retorna um *`Boolean`*.
 * ---
 * @param {*} target > Um dado ou objeto a ser testado.
 * @param {...Type} types > Uma *`String`* indicando um tipo esperado.
 */
flex.is = (target, ...types) => {
    return types.length > 0? types.some(tp => flex.type(target) === tp) : undefined
}


// [COLLECTIONS] ____________________________________________

// ----- [Publicar Lib]
const _ = flex
export default _

// --- [Exportação dos Módulos Internos Para Área de Testes]
export {_AUX}


//   ●    ●    ●    ●    ●    ●    ●    ●    ●
//--- [Conjunto de typedef]
/**
 * @typedef {"number"|"function"|"bigInt"|"symbol"|"undefined"|"array"|"object"|"string"|"HTMLElement"|"HTMLCollection"|"nodeList"|"set"|"map"|"null"|"boolean"|"date"|"window"|"HTMLDocument"|"error"|"animation"|"arrayBuffer"|"blob"|"namedNodeMap"|"DOMTokenList"|"pinterEvent"|"mouseEvent"|"event"|"DOMParser"|"styleSheetList"|"CSSStyleSheet"|"cssRuleList"|"text"|"comment"} Type
 * 
 */