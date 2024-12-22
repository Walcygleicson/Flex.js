"use strict"
const Flex = {}
// ---- [Infos de Criação da Lib]
Flex.ABOUT = Object.create(null)
Flex.ABOUT.name = "Flex"
Flex.ABOUT.version = "1.0.0"
Flex.ABOUT.created = "2024-Brasil"
Flex.ABOUT.author = "Walcygleicson M. Oliveira"
Flex.ABOUT.documents = null
Flex.ABOUT.github = "https://github.com/Walcygleicson/Flex.js"
Flex.ABOUT.licence = "MIT"
Object.freeze(Flex.ABOUT)

// #region DATAS internal ----------------------
// ----- [Conjunto de tipos de dados e objetos]
const NUMBER = "Number",
    STRING = "String",
    ARRAY = "Array",
    OBJECT = "Object",
    FUNCTION = "Function",
    SYMBOL = "Symbol",
    REGEXP = "RegExp",
    ELEMENT = "HTMLElement",
    HTMLCOLLECTION = "HTMLCollection",
    NODELIST = "NodeList",
    SET = "Set",
    MAP = "Map",
    NAN = "NaN",
    WEAKMAP = "WeakMap",
    WEAKSET = "WeakSet",
    WEAKREF = "WeakRef",
    /** Testa a existência do global *`window`* e retorna *`true`* caso exista, indicando que o ambiente atual é um navegador. */
    ISWINDOW = typeof window === "object" && window instanceof Window

//#endregion

// #region CHECK internal --------------------------
/** Pacote interno de *`Hash Tables`* para checagem de valores. */
const CHECK = (function () {
    const _check = {}
    /** Mapa de tipos considerados Listas */
    _check.list = {
        [ARRAY]: true,
        [NODELIST]: true,
        [HTMLCOLLECTION]: true,
        [SET]: true,
        arguments: true,
        DOMTokenList: true,
        namedNodeMap: true,
        weakSet: true,
        dataView: true,
        blob: true,
        fileList: true,
        formData: true,
    };

    /** Mapa de construtores de TypedArrays */
    _check.typedArray = {
        "[object Float32Array]": true,
        "[object Float64Array]": true,
        "[object Int8Array]": true,
        "[object Int16Array]": true,
        "[object Int32Array]": true,
        "[object Uint8Array]": true,
        "[object Uint8ClampedArray]": true,
        "[object Uint16Array]": true,
        "[object Uint32Array]": true,
    };

    return _check
})()
// #endregion --------------------------------------

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
   
    const _aux = {}
   
    /** Atalho para *`Object.prototype.toString.call`* */
    _aux.toStringCall = (o) => Object.prototype.toString.call(o)
    /** Testa se um valor número é uma medida válida de comprimento de objeto */
    _aux.isLen = (len) => Number.isInteger(len) && len >= 0 && len < Number.MAX_SAFE_INTEGER
    
    /** Usado para buscar por uma propriedade de um objeto que indique seu comprimento. */
    _aux.findLen = (o, ...lenKeys) => {
        let prop
        for (let i = 0; i < lenKeys.length; i++){
            prop = o[lenKeys[i]]
            if(AUX.isLen(prop)){return prop}
            
        }
    }
    
    /** Usado para testar se um objeto é uma lista indexada. */
    _aux.isList = (list) => {
        return CHECK.list[Flex.type(list)] || (
            Flex.typeof(list) === OBJECT &&
            "length" in list && // Testa a existência da propriedade length
            AUX.isLen(list.length) &&
            Object.keys(list).every((key, i) => !isNaN(parseInt(key)) && i == key) // Testa se todas as chaves são número inteiros
        );
    }
    /** Usado para obter lista de chaves de propriedades enumeráveis de coleções chaveadas*/
    _aux.getKeys = (o, i) => {
        if (o instanceof Map) {
            return i === undefined ? [...o.keys()] : o.keys()[i]
        } else if (Flex.isDict(o)) {
            return i === undefined? Object.keys(o) : Object.keys(o)[i]
        }
    }
    /** Obtém valores das propriedades de um objeto ou valores de um objeto Set */
    _aux.getValues = (o, i) => {
        if (o instanceof Map || o instanceof Set) {
            return i === undefined ? [...o.values()] : o.values()[i]
        } else if (Flex.isDict(o)) {
          return i === undefined? Object.values(o) : Object.values(o)[i]
        }
    }

    /** @returns {PropertyDescriptor} */
    _aux.propDescriptor = (o, prop) => {
        if (AUX.typeof(o) === OBJECT) {
            return Object.getOwnPropertyDescriptor(o, prop) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(o), prop)
        }
    }

    /** Usado para obter uma das propriedades se existente em um objeto */
    _aux.someProp = (o, ...keys) => {
        if (Flex.typeof(o) === OBJECT) {
            let is = {
                MAPWEAK: Flex.is(o, "map", "weakMap"),
                WEAKREF: Flex.type(o) === "weakRef"
            }
            
            let prop
            for (let i = 0; i < keys.length; i++){

                if (is.MAPWEAK) {
                    prop = o.get(keys[i])
                } else if (is.WEAKREF) {
                    prop = o.deref()[keys[i]]
                } else {
                    prop = o[keys[i]]
                }

                if (prop !== undefined) {
                    is = null
                    return prop
                }
            } 
        }
    }

    _aux.isSETorMAP = (o) => o instanceof Set || o instanceof Map
    
    
    return _aux
})();
//#endregion
// FLEX.JS Módulos Públicos   ●    ●    ●    ●    ●    ●    ●    ●    ●
// #region [ANY] ----------------------

/** *`[any]`*
 * * Retorna uma *`string`* indicando o tipo preciso de um dado ou objeto.
 * ---
 * @param {*} target > Um dado ou objeto.
 * @returns {Type}
 */
Flex.type = (target) => {
    if (ISWINDOW && target instanceof HTMLElement) { return ELEMENT }
    else if (Number.isNaN(target)) { return NAN }
    else {return AUX.toStringCall(target).slice(8, -1)}
}

/** *`[any]`*
 * * É semelhante ao *`typeof`* operador, porém corrige o *`bug histórico`* em que *`typeof null => "object"`*.
 * ---
 * @param {*} target Uma valor ou objeto a ser analisado.
 * @returns {typeof}
 */
Flex.typeof = (target) => target === null ? "null" : typeof target

/** *`[any]`*
 * * Testa se o tipo de um dado ou objeto corresponde a um dos tipos passados em *`(...types)`* e retorna um *`boolean`*.
 * ---
 * @param {*} target > Um dado ou objeto a ser testado.
 * @param {...Type | ObjectConstructor} types > O tipo esperado.
 */
Flex.is = (target, ...types) => {
    let tp = Flex.type(target)
    if (types.length > 0) {
        // Para null, undefined e NaN
        // >> Testar se o tipo ou se o valor está em ..types. Já que não é possível testar por construtor.
        if (Flex.isNaN(target) || Flex.isNil(target)) {
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
Flex.isPrimitive = (value) => Flex.typeof(value) !== "object" && typeof value !== "function"


/** *`[any]`*
 * * Testa se um valor é um tipo *`NaN`* e retorna um *`boolean`*.
 * @param {unknown} value > Um valor a ser testado.
 */
Flex.isNaN = (value) => typeof value === "number" && value !== value;

/** *`[any]`*
 * * Testa se um valor é *`null`* ou *`undefined`* e retorna um *`boolean`*.
 * @param {null | undefined} value > Um valor a ser testado.
 */
Flex.isNil = (value)=> value == null

/** * *`[any]`*
 * ---
 * * Retorna o *`constructor`* de um objeto se diferente de *`null`* e *`undefined`*, caso contrário o retorno é o valor *`undefined`*.
 * ---
 * @param {*} target > O objeto alvo.
 * @returns {ObjectConstructor}
 */
Flex.constructorOf = (target) => { return Flex.isNil(target) ? undefined : Object.getPrototypeOf(target).constructor }

/** *`[any]`*
 * * Testa se um objeto é um tipo *`"array-like"`* - objeto semelhante a um *`array`* - e retorna um *`boolean`*.
 * ---
 * @param {object} target > Um objeto a ser analisado.
 */
Flex.isArrayLike = (target) => !Array.isArray(target) && AUX.isList(target)

/** *`[any]`*
 * * Testa se objeto é um *`TypedArray`*, coleção de dados numéricos de tipo e tamanho fixo, como, por exemplo: *Uint8Array, Int32Array, Float32Array* e etc...
 * @param {*} target 
 * @returns {boolean}
 */
Flex.isTypedArray = (target) => {
    if (target !== undefined) {
        return Flex.typeof(target) === OBJECT && !!CHECK.typedArray[AUX.toStringCall(target)]
    }

}

//#endregion ---------------------------------

// #region [DICTIONARY]----------------

/** *`[dictionary]`*
 * * Testa se um objeto é um *`"dictionary"`* - qualquer coleção que armazena pares de chave e valor - e retorna um *`boolean`*.
 * 
 * @param {object} target > Uma objeto a ser testado.
 */
Flex.isDict = (target) => {
    return !AUX.isList(target) && Flex.typeof(target) == "object" && Flex.type(target) !== "HTMLElement"
}

/** *`[dictionary]`*
 * * Cria um *`object`* vazio sem um *`prototype`*.
 * ---
 * @returns {typeof object}}
 */
Flex.nullDict = () => Object.create(null)

/** *`[dictionary]`*
 * * Retorna um *`array`* contendo as chaves de propriedades enumeráveis de um objeto ou uma chave obtida ao especificar o índice.
 * ---
 * @param {Dictionary} dict > Um *`dictionary`* objeto.
 * @param {number} keyIndex > O índice da chave requerida.
 * @returns {Array<string> | string}
 */
Flex.keys = (dict, keyIndex) => AUX.getKeys(dict, keyIndex)

/** *`[dictionary]`*
 * * Retorna um *`array`* contendo os valores das propriedades enumeráveis de um objeto ou um único valor obtido ao especificar o índice. Da mesma forma também obtém os valores de um objeto *`Set`*, embora não seja um considerado *`"dictionary"`*.
 * ---
 * @param {Dictionary} dict > Um *`dictionary`* objeto.
 * @param {number} keyIndex > O índice da chave requerida.
 * @returns {Array<unknown> | unknown}
 */
Flex.values = (dict, keyIndex) => AUX.getValues(dict, keyIndex)

//#endregion---------------------------

// #region [LIST] ---------------------
/** *`[list]`*
 * * Testa se um objeto é um *`"list"`* - coleção ordenada de valores indexados - e retorna um *`boolean`*.
 * ---
 * @param {object} target > Um objeto a ser testado.
 */
Flex.isList = (target) => AUX.isList(target)
//#endregion----------------------------------

// #region [STRING]--------------------

/** *`[string]`*
 *  * Converte uma *`string`* no formato *json* válido para o valor ou objeto correspondente e o retorna. Se o argumento passado não for válido, retorna apenas *`undefined`*.
 * * Uma função *`handler`* opcional pode ser fornecida para executar uma transformação no objeto resultante antes que ele seja retornado.
 * ---
 * @param {string} str > Uma *`string`* no formato *`json`*. 
 * @param {(this:any, key: string, value: any)=>any} handler > Executa uma função que prescreve como cada valor originalmente produzido pela análise sintática é transformado antes de ser retornado. Valores não-chamáveis ​​são ignorados. A função é chamada com os mesmos argumentos da função *reviver* do método nativo *`JSON.parse()`*.
 */
Flex.JSONParse = (str, handler) => {
    try {return JSON.parse(str, handler)} catch (e) {
        return undefined
    }
}
// #endregion -----------------------------

// #region [OBJECT]--------------------

/** *`[object]`*
 * * Remove diretamente o *`prototype`* de um objeto.
 * ---
 * @param {object} obj > Um objeto alvo.
 */
Flex.unproto = (obj) => {
    !Flex.isNil(obj) ? Object.setPrototypeOf(obj, null) : null 
}

/** *`[object]`*
 * * Verifica se uma ou mais propriedades existem em um objeto e retorna o primeiro valor encontrado da busca. Se nenhuma propriedade for encontrada o retorno é *`undefined`*.
 * ---
 * @param {object} obj > Um objeto de propriedades. 
 * @param  {...any} keys > Uma ou mais chaves de propriedades para a busca.
 */
Flex.getProp = (obj, ...keys) => AUX.someProp(obj, ...keys)
//#endregion --------------------------

// #region [COLLECTION] ---------------
Flex.len = (collection) => {
    // Objetos genéricos - obtér qunatidade de chaves
    if (Flex.type(collection) === OBJECT) {
        return Object.keys(collection).length
    } else if (Flex.typeof(collection) === OBJECT || typeof collection === STRING) {
        // forçar retorno undefined para weaks object, pois sempre retornam 0
        if(Flex.is(collection, WEAKMAP, WEAKSET, WEAKREF)){return undefined}
        // Obter propriedades que indicam o comprimento de um objeto, se nenhum for encontrado, tentar obter comprimento das chaves como última opção
        return AUX.findLen(collection, "length", "size", "byteLenght") ?? Object.keys(collection).length
    }
}

//#endregion --------------------------



// #regin [ERROR]-----------------------
//#endregion ---------------------------



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