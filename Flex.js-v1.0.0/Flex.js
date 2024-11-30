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
    Aux.isNAN = (value)=> typeof value === "number" && value !== value
    Aux.arrfy = ()=>{}
    
    return Aux
})();
//#endregion


// FLEX.JS   ●    ●    ●    ●    ●    ●    ●    ●    ●
// [Módulos Públicos da Lib] ------>


// #region [ANY] -------------------------------

/** *`[any]`*
 * * Retorna uma *`string`* indicando o tipo de um dado ou objeto.
 * ---
 * @param {*} target > Um dado ou objeto.
 * @returns {Type}
 */
flex.type = (target) => {
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

//// Implementar comparação por constructor
/** *`[any]`*
 * * Testa se o tipo de um dado ou objeto corresponde a um dos tipos passados em *`(...types)`* e retorna um *`boolean`*.
 * ---
 * @param {*} target > Um dado ou objeto a ser testado.
 * @param {...Type | ObjectConstructor} types > O tipo esperado.
 */
flex.is = (target, ...types) => {
    const tp = flex.type(target)
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
 * * Testa se um valor é um *`primitivo`* e retorna um *`boolean`*. Se nenhum valor for passado, o retorno é *`undefined`*.
 * ---
 * @param {unknown} value > Um valor a ser testado. 
 */
flex.isPrimitive = function (value = UNKNOWN) {
    return value !== UNKNOWN ? typeof e !== "object" && typeof e !== "function" : undefined
}

/** *`[any]`*
 * * Testa se um valor é um tipo *`NaN`* e retorna um *`boolean`*.
 * @param {*} value > Um valor a ser testado.
 */
flex.isNaN = (value) => AUX.isNAN(value) 

/** *`[any]`*
 * * Testa se um valor é *`null`* ou *`undefined`* e retorna um *`boolean`*.
 * @param {*} value > Um valor a ser testado.
 */
flex.isNil = (value)=> AUX.isNIL(value)

/** * *`[any]`*
 * ---
 * * Retorna o *`constructor`* de um objeto se diferente de *`null`* e *`undefined`*, caso contrário o retorno é o valor *`undefined`*.
 * ---
 * @param {*} target > O objeto alvo.
 * @returns {ObjectConstructor}
 */
flex.constructor = (target) => {return AUX.isNIL(target)? undefined : Object.getPrototypeOf(target).constructor}

//#endregion -----------------------------------------------

// #region [COLLECTION] ---------------------------
//#endregion---------------------------------------

// [STRING] ________________________________________________
// [COLLECTIONS] ____________________________________________
// [COLLECTIONS] ____________________________________________
// [COLLECTIONS] ____________________________________________


// ----- [Publicar Lib]
const _ = flex
export default _

// --- [Exportação dos Módulos Internos Para Área de Testes]
export { AUX }


//   ●    ●    ●    ●    ●    ●    ●    ●    ●
//--- [Conjunto de typedef]
/**
 * @typedef {"number"|"function"|"bigInt"|"symbol"|"undefined"|"array"|"object"|"string"|"HTMLElement"|"HTMLCollection"|"nodeList"|"set"|"map"|"null"|"boolean"|"date"|"window"|"HTMLDocument"|"error"|"animation"|"arrayBuffer"|"blob"|"namedNodeMap"|"DOMTokenList"|"pinterEvent"|"mouseEvent"|"event"|"DOMParser"|"styleSheetList"|"CSSStyleSheet"|"cssRuleList"|"text"|"comment"|"NaN"} Type
 * 
 */