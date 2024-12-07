"use strict"
const Flex = {}

// ---- [Infos de Criação da Lib]
Flex.ABOUT = Object.freeze({
    name: "Flex",
    version: "1.0.0",
    created: "2024-Brasil",
    author: "Walcygleicson M. Oliveira",
    documents: null,
    github: "https://github.com/Walcygleicson/Flex.js",
    licence: "MIT",
})

// #region DATAS internal ----------------------
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
    MAP = "map",
    NAN = "NaN",
    /** Testa a existência do global *`window`* e retorna *`true`* caso exista, indicando que o ambiente atual é um navegador. */
    ISWINDOW = typeof window === "object" && window instanceof Window,
    /** Serve para indicar a ausência de passagem de valores, substituindo o valor padrão *`undefined`* onde o mesmo é esperado.*/
    UNKNOWN = Symbol("[unknown.value]")
    //#endregion

// #region SYM internal  ---------------------------
/** Pacote Interno de Symbols */
const _SYM = (function () {
    const symbol = {}
    /** Token do método de interrupção de loops */
    symbol.break = Symbol("[iteration.break]")

    return symbol
})()
//#endregion

// #region REGX internal ---------------------------
/** Pacote Interno de RegExp */
const _REGX = (function () {
    const regex = {};
    /** Testa se uma string começa com uma sequencia (sigla) de letras maiúsculas. */
    regex.startAcronym = /^([A-Z]{2,})/;
    return regex;
})()
// #endregion

// #region CELL internal -------------------------
/** Pacote Interno de Métodos Células dos Módulos Principais. */
const _CELL = (function () {
    // Os métodos deste objeto tem permissão para depender dos métodos de AUX, Flex e dos prórpios métodos.
    const cell = {}
    return cell
})()
// #endregion

// #region AUX internal ---------------------------
/** Pacote Interno de Métodos Auxiliares */
const AUX = (function () {
    // Os métodos deste objeto só tem permissão para depender dos prórpios métodos.
    const Aux = {}
   
    Aux.isNIL = (value) => value == null
    Aux.isNAN = (value) => typeof value === "number" && value !== value
    Aux.typeof = (o) => o === null ? "null" : typeof o
    /** Usado para testar se um objeto é uma lista indexada. */
    Aux.isIndexedList = (list) => {
        return Array.isArray(list) || (
            AUX.typeof(list) === "object" &&
            "length" in list && // Testa a existência da propriedade length
            list.length >= 0 && // Testa se length númerico e positivo
            Object.keys(list).every((key) => !isNaN(parseInt(key))) // Testa se todas as chaves são número inteiros
        );
    }
    /** Usado para obter lista de chaves de propriedades enumeráveis de coleções chaveadas*/
    Aux.getKeys = (o, i) => {
        if (o instanceof Map) {
            return i === undefined? [... o.keys()]: o.keys()[i]
        } else if (AUX.typeof(o) === "object" && !Aux.isIndexedList(o) && !(o instanceof Set)) {
            return i === undefined? Object.keys(o) : Object.keys(o)[i]
        }
    }
    
    return Aux
})();
//#endregion


// FLEX.JS Módulos Públicos   ●    ●    ●    ●    ●    ●    ●    ●    ●

// #region[ANY] -------------------------------

/** *`[any]`*
 * * Retorna uma *`string`* indicando o tipo preciso de um dado ou objeto.
 * ---
 * @param {*} target > Um dado ou objeto.
 * @returns {Type}
 */
Flex.type = (target) => {
    // Retornar de imediato "HTMLElement" caso seja uma instância de...
    if (ISWINDOW && target instanceof HTMLElement) { return ELEMENT; }
    //Verificação de tipos NaN
    else if(AUX.isNAN(target)){return NAN}
    // Obter tipo pelo prototype
    target = Object.prototype.toString.call(target).slice(8, -1);
    // Retornar de imediato se for um tipo que comece com siglas a maiúsulas, como HTMLCollection, HTMLDocument e etc.
    if (_REGX.startAcronym.test(target)) { return target; }
    return target.charAt(0).toLowerCase() + target.slice(1);
}

/** *`[any]`*
 * * É semelhante ao *`typeof`* operador, porém corrige o *`bug histórico`* em que *`typeof null => "object"`*.
 * ---
 * @param {*} target Uma valor ou objeto a ser analisado.
 * @returns {typeof}
 */
Flex.typeof = (target)=>AUX.typeof(target)

/** *`[any]`*
 * * Testa se o tipo de um dado ou objeto corresponde a um dos tipos passados em *`(...types)`* e retorna um *`boolean`*.
 * ---
 * @param {*} target > Um dado ou objeto a ser testado.
 * @param {...Type | ObjectConstructor} types > O tipo esperado.
 */
Flex.is = (target, ...types) => {
    const tp = Flex.type(target)
    if (types.length > 0) {
        // Para null, undefined e NaN
        // >> Testar se o tipo ou se o valor está em ..types. Já que não é possível testar por construtor.
        if (AUX.isNAN(target) || AUX.isNIL(target)) {
            return types.includes(target) || types.includes(tp)
        }

        // Para outros tipos
        return types.some((value) => {
            // Para HTMLElement, especificamente.
            // >> Primeiro comparar construtor e herança. Se false, passar para a próxima comparação.
            if (tp === "HTMLElement" && typeof value === "function" && value !== Object) {
                return target instanceof value
            }

            //Comparar tipo e construtor.
            return tp == value || Object.getPrototypeOf(target).constructor === value
            
        })
        
    }
}


/** *`[any]`*
 * * Testa se um valor é um *`primitivo`* e retorna um *`boolean`*.
 * ---
 * @param {any} value > Um valor a ser testado. 
 */
Flex.isPrimitive = (value) => AUX.typeof(value) !== "object" && typeof value !== "function"


/** *`[any]`*
 * * Testa se um valor é um tipo *`NaN`* e retorna um *`boolean`*.
 * @param {*} value > Um valor a ser testado.
 */
Flex.isNaN = (value) => AUX.isNAN(value) 

/** *`[any]`*
 * * Testa se um valor é *`null`* ou *`undefined`* e retorna um *`boolean`*.
 * @param {*} value > Um valor a ser testado.
 */
Flex.isNil = (value)=> AUX.isNIL(value)

/** * *`[any]`*
 * ---
 * * Retorna o *`constructor`* de um objeto se diferente de *`null`* e *`undefined`*, caso contrário o retorno é o valor *`undefined`*.
 * ---
 * @param {*} target > O objeto alvo.
 * @returns {ObjectConstructor}
 */
Flex.constructorOf = (target) => { return AUX.isNIL(target) ? undefined : Object.getPrototypeOf(target).constructor }

/** *`[any]`*
 * * Testa se um objeto é um tipo *`"array-like"`* - objeto semelhante a um *`array`* - e retorna um *`boolean`*.
 * ---
 * @param {object} target > Um objeto a ser analisado.
 */
Flex.isArrayLike = (target) => {
    return !Array.isArray(target) && AUX.isIndexedList(target)
}

//#endregion -----------------------------------------------

// #region [COLLECTION] ---------------------------
//#endregion---------------------------------------

// #region [DICTIONARY]--------------------------

/** *`[dictionary]`*
 * * Testa se um objeto é um *`"dictionary"`* - qualquer coleção que armazena pares de chave e valor - e retorna um *`boolean`*.
 * 
 * @param {*} target > Uma objeto a ser testado.
 */
Flex.isDict = (target) => !AUX.isIndexedList(target) && AUX.typeof(target) == "object"

/** *`[dictionary]`*
 * * Retorna um *`array`* contendo as chaves de propriedades enumeráveis de um objeto ou uma chave obtida ao especificar o índice.
 * ---
 * @param {Dictionary} dict > Um *`dictionary`* objeto.
 * @param {number} keyIndex > O índice da chave requerida.
 * @returns {Array<string> | string}
 */
Flex.keys = (dict, keyIndex) => AUX.getKeys(dict, keyIndex)
//#endregion---------------------------

// #region [LIST] ---------------------------------
/** *`[list]`*
 * * Testa se um objeto é um *`"list"`* - coleção ordenada de valores indexados - e retorna um *`boolean`*.
 * ---
 * @param {*} target > Um objeto a ser testado.
 */
Flex.isList = (target) => AUX.isIndexedList(target)
//#endregion----------------------------------

// #region [STRING] ________________________________________________

/** *`[string]`*
 *  * Converte uma *`string`* no formato *json* válido para o valor ou objeto correspondente e o retorna. Se o argumento passado não for válido, retorna apenas *`undefined`*.
 * * Uma função *`handler`* opcional pode ser fornecida para executar uma transformação no objeto resultante antes que ele seja retornado.
 * ---
 * @param {string} str > Uma *`string`* no formato *`json`*. 
 * @param {(this:any, key: string, value: any)=>any} handler > Executa uma função que prescreve como cada valor originalmente produzido pela análise sintática é transformado antes de ser retornado. Valores não-chamáveis ​​são ignorados. A função é chamada com os mesmos argumentos da função *reviver* do método nativo *`JSON.parse()`*.
 */
Flex.JSONparse = (str, handler) => {
    try {return JSON.parse(str, handler)} catch (e) {
        return undefined
    }
}
// #endregion

// #regin [ERROR]-------------------------------------
//#endregion ----------------------------------------


// ----- [Publicar Lib]
/** @namespace Flex*/
const _ = Flex
export default _

// --- [Exportação dos Módulos Internos Para Área de Testes]
export {AUX}


// #region @typedef   ●    ●    ●    ●    ●    ●    ●    ●    ●
//--- [Conjunto de typedef]
/**
 * @typedef {"number"|"function"|"bigInt"|"symbol"|"undefined"|"array"|"object"|"string"|"HTMLElement"|"HTMLCollection"|"nodeList"|"set"|"map"|"null"|"boolean"|"date"|"window"|"HTMLDocument"|"error"|"animation"|"arrayBuffer"|"blob"|"namedNodeMap"|"DOMTokenList"|"pinterEvent"|"mouseEvent"|"event"|"DOMParser"|"styleSheetList"|"CSSStyleSheet"|"cssRuleList"|"text"|"comment"|"NaN"} Type
 * 
 * @typedef {{}} Dictionary Uma coleção de pares de chave e valor.
 * 
 * @typedef {[] | ArrayLike} List Uma coleção de valores ordenados por índices.
 * 
 */
//#endregion