/** Symbol Global para desbloqueio dos métodos de Internos */
const SYM_Unlock = Symbol.for("[SYM*0001].private")
const icon = {
    OK: "✅",
    FAIL: "⚠️",
    ERROR: "❌",
    NOTFOUND: "❓",
};
const internal = {};
/**@typedef {"Array" | "Object" | "String" | "Number" | "Set" | "Map" | "Function" | "NodeList" | "Symbol"} Type */

/** @returns {Type} */
internal.type = (target) => {
    return Object.prototype.toString.call(target).slice(8, -1)
};

internal.is = (target, ...types) => { return types.includes(internal.type(target)) }

/**
 * * Lança um Erro personalizado.
 * 
 * @param {string} message Mensagem de erro
 * @param {string} name Nome do tipo de erro
 * @param {string} cause Causa do Erro
 */
internal.error = (message, name, cause) => {
    const err = new Error();
    err.name = name
    err.cause = cause
    const stack = {
        // Quebra a pilha na palavra "at" e obtém os dois últimos elementos
        parts: err.stack.split("at").slice(-2),
        place: null, //Local do erro
        line: null, //Link da linha do erro
        path: null //Caminho do erro
        
    };
    
    // Obter o local onde o erro foi disparado
    stack.place = stack.parts[0].match(/^[^(]+/)[0];
    // Obter linha
    stack.line = stack.parts[1]
    //Obter o caminho
    stack.path = stack.line.split("/").slice(-2).join("/").replace(/:.*/, "");
    // Limpar pilha de erro
    err.stack = ""
    //Definir mensagem de erro
    err.message = `\n ⚠️ ${message}\n\n >${stack.place} \n   > ${stack.path} \n     > ${stack.line}\n\n`;

    throw err
}

/** Lança um Erro caso um argumento for passado com tipo errado ou se argumento for abrigatório @param {{arg: any, required: boolean, param: string, types: [Type]}} set*/
internal.argError = (set = {}) => {
    set.param = set.param || 1
    set.required = set.required ?? true
    const tp = internal.type(set.arg)
    // Verificar parâmetro obrigatório
    if (set.required && set.arg === undefined) {
        internal.error(`The parameter (${set.param}) is required!`, "REQUIRED ERROR")
    //Verificar tipo de argumento
    } else if ((set.arg !== undefined) && !set.types.includes(tp)) {
        internal.error(`The parameter (${set.param}) expects to receive arguments of type ${set.types.join(" | ")}.`, "TYPE ERROR");
    }
}
/** Verifica se uma string está vazia ou se é composta somente por espaços */
internal.strVoid = (str) => {return str.trim() === ""}

/** Retorna Null caso o valor for Undefined */
internal.toNull = (value) => {
    return value === undefined? null : value
}
/** * Cria um objeto com propriedades somente leitura ou insere ou modifica propriedades de um objeto existente
 * @param {{}} o Um object 
 */
internal.setter = (o, target) => {
    const res = {}
    for (let k in o) { Object.defineProperty(target || res, k, { value: o[k] }) }
    return target? undefined : res
}

/** Obtém o nome de uma classe dada em *`options.root`* */
internal.getRootName = (root) => {
    if (root instanceof Object) {
        root = root.constructor.name
        return root !== "Object"? root : null
    }

    return null
    
}

/** Obtém o nome de uma função ou classe declarada para teste */
internal.getFuncName = (fn) => {
    if (typeof fn === "function" && fn.name) {
        
        return fn.name
    }
}

/** Verifica se um nome dado a uma declaração de teste já foi fornecida anteriormente, se sim, adicionar sufixo "*" + [número], se não foi fornecido um nome, retornar um id de ordem de adição */
internal.evaluateName = (name, declaredList) => {
    let id = 0
    const idname = (i) => "[" + i + "]"
    // Verificar se nome já foi declarado
    if (name && declaredList[name]) {

        for (let k in declaredList) {
            //Verificar se k é um nome já sufixado e retirar sufixo para a compraração
            k = internal.removeSuffix(k)
            k === name? id++ : null
        }
        return id === 0 ? name : name + "*[" + id + "]"
        
    } else if (name === undefined || name === null) { // Se nenhum nome foi dado criar id
        const keys = Object.keys(declaredList)
        keys.forEach((e) => {
            e == idname(id)? id++ : null
        })

        return idname(id)
    }
    return name
}

/** * Remove o sufixo indentificador de múltiplos *`*[0]`* de uma chave de declaração */
internal.removeSuffix = (name) => {
    return name.replace(/\*\[\d\]/, "");
}


/** Obtém uma função contida em root pelo seu nome */
internal.getMethodByName = (fnName, root) => {
    const fn = root[fnName]
    return typeof fn === "function"? fn : null
}

/** Verifica se um ou mais argumentos foi passado corretamente */
internal.readyArgs = (args, ...types) => {
    if (args instanceof Array) {
        for(let i = 0; i < args.length; i++){
            if(!types.includes(internal.type(args[i]))){return false}
        }
    }
    return true
}

/** Recebe a lista de testes de uma função declarada para receber os testes unitários*/
internal.toTestList = (list) => {
    /** Armazena as informações fornecidas para o teste unitário da função declarada */
    var test
    const addDesc = {
        /**
         * Opcionalmente pode adicionar uma descrição sobre o teste que está sendo adicionado à lista.
         * 
         * @param {string} text Uma breve descrição sobre este teste. 
         */
        description(text) { test.description = text }
    }

    // Cadeia de métodos
    /**@typedef {methods} chainMethods */
    const methods = {
        /** Recebe o valor esperado como retorno da função declarada ao ser executada com os argumentos fornecidos - se requeridos
         *  @param {any} value O valor de retorno esperado.
        */
        expect(value) {
            test.expect = value //Adicionar valor esperado de retorno à lista
            return addDesc // Fim da cadeia
        },

        /** Executa uma callback function para exame externo caso a função declarada não retorne nada, modifique ou atribua um valor a algum objeto externo ou retorne algo mas o valor é imprevisível.
         * @param {(props:ExamProps)=>void} handler 
        */
        exam(handler) {
            internal.argError({arg: handler, types: ["Function"]})
            test.exam = handler // Adicionar exame à lista
            return addDesc
        }
    
    }
    
    return {
        /**
         * Define os testes para a função declarada. Fornece uma cadeia de métodos que avaliam o teste ou fornecem mais detalhe sobre.
         * @param {...ArgsList} [args] Recebe os argumentos requeridos pela função declarada.
         * @returns {chainMethods}
        */
        args(...args) {
            test = {args: args} // Setar variável
            //test.args = args
            list.push(test) // Adicionar teste à lista
            return methods
        }
    }
}

/** Executa uma função callback e retorna o tempo de execução desta em ms */
internal.getExecTime = (handler) => {
    const start = performance.now()
    handler()
    const end = performance.now()
    return (end - start).toFixed(2)+"ms"
}

/** Compara recursivamente se dois objetos são iguais */
internal.isEqual = (a, b)=>{
    // Verifica se ambos são do mesmo tipo
    if (typeof a !== typeof b) return false;

    // Verifica se são objetos
    if (typeof a === "object" && a !== null) {
        const isEqual = internal.isEqual
        // Verifica se são arrays
        if (Array.isArray(a)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!isEqual(a[i], b[i])) return false;
            }
            return true;
        }
        // Verifica se são Sets
        else if (a instanceof Set) {
            if (a.size !== b.size) return false;
            for (let item of a) {
                if (!b.has(item)) return false;
            }
            return true;
        }
        // Verifica se são Maps
        else if (a instanceof Map) {
            if (a.size !== b.size) return false;
            for (let [key, value] of a) {
                if (!isEqual(b.get(key), value)) return false;
            }
            return true;
        }
        // Verifica se são Proxies
        else if (Object.getPrototypeOf(a) !== Object.prototype) {
            return (
                isEqual(Object.getPrototypeOf(a), Object.getPrototypeOf(b)) &&
                isEqual(Object.keys(a), Object.keys(b))
            );
        }
        // Compara objetos
        else {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            for (let key of keysA) {
                if (!isEqual(a[key], b[key])) return false;
            }
            return true;
        }
    }
    // Compara primitivos
    else {
        return a === b;
    }
}

/** Cria um novo array com os resultados de um array @param {(value: any, index: number, stop: ()=>void)=>any} handler */
internal.map = (arr, handler) => {
    var newArr = []
    var brk = false
    const stop = ()=>{brk = true}
    for (let i = 0; i < arr.length; i++){
        const output = handler(arr[i], i, stop)
        if(brk === true){break}
        if (output !== undefined) {newArr.push(output)}
    }

    return newArr
    
}

internal.find = (arr, handler) => {
    var result
    internal.map(arr, (value, i, stop) => {
        result = handler(value, i)
        if(result !== undefined){stop()}
    })
    return result
}


/** Executa os testes da função declarada e monta um objeto de resultados @returns {TestResultsObject}*/
internal.execTest = (statement) => {
    /** Objeto de resultados a ser obtido */
    const results = {
        summary: statement.summary,
        status: "Ok",
        icon: icon.OK,
        okSize: 0,
        failSize: 0,
        errorSize: 0,
        tests: []
    };

    /** Função declarada para ser executada */
    const fn = statement.target

    // Testar se fn é uma função - caso não seja significa que esta foi fornecida a referência por nome e este não existe em Testool.root
    if (fn === null) {
        results.status = "Not Found"
        results.icon = icon.NOTFOUND
        results.alert = "was not found as a method of the Root Object! This may have been removed or renamed."
    } else {
        // Lançar erro caso lista de testes estiver vazia
        statement.tests.length === 0? internal.error("At least one test must be applied for this statement.", "EMPTY TEST") : null

        // Povoar lista de resultados dos testes em results.tests
        results.tests = statement.tests.map((test, i) => {
            // Testar se mapa de testes foi fornecido corretamente, se não, lançar erro
            if (!("exam" in test) && !("expect" in test)) {
                console.log("erro")
                internal.error(`The test ${i+1} is incomplete. It is necessary to chain calls to one of these methods to resolve the test: args.expect() | args.exam().`, "INCOMPLETE TEST")
            }
        
            /** Objecto de resultado de teste individual a ser inserido na lista de teste do objeto de resultados principal @type {ResultObject}*/
            const testRes = {
                output: null,
                expect: test.expect,
                status: "Ok",
                exam: null,
                args: test.args,
            }
        
            // Tentar executar a função declarada
            try {
                // Calcular tempo de execução da função
                testRes.time = internal.getExecTime(() => {
                    fn()
                    testRes.output = fn(...test.args)  
                })
            
            } catch (err) {
            
                // Deletar propriedades não usadas nesta ocasião
                delete testRes.output
                delete testRes.exam
    
                results.errorSize++
                testRes.status = "Error"
                testRes.error = err.message
                const stack =  err.stack.split("at")
                //Adicionar caminhos que não sejam caminhos de processos internos do teste
                testRes.stack = internal.map(stack, (p, i, stop) => {
                    p.includes("@internal.js") || p.includes("Testool.js") ? stop() : null
                    
                    // Não retornar primeira camada a pilha - mensagem de erro
                    return i > 0? p.trim() : undefined
                 
                });
                return testRes
            }
        
            // Teste para comparação de retorno esperado "expect"
            if ("expect" in test) {
                delete testRes.exam;
                // Se valor retornado não for igual ao valor esperado...
                if (!internal.isEqual(testRes.output, test.expect) ) {
                    testRes.status = "Fail";
                    results.failSize++
                    testRes.message = "O valor de retorno é diferente do valor esperado!";
                } else {
                    results.okSize++;
                }
            } else if ("exam" in test) {
                delete testRes.expect
                const cbArg = {
                    output: testRes.output,
                    args: test.args,
                    isEqual: internal.isEqual
                }
                // Executar função exame e obter resposta
                const examRes = test.exam(cbArg)
                if (examRes !== undefined) {
                    testRes.exam = !!examRes
                    if (testRes.exam) {
                        results.okSize++;
                        testRes.status = "Ok"
                        
                    } else {
                        results.failSize++;
                        results.icon = icon.FAIL
                        testRes.status = "Fail"
                    }
                } else {
                    // Lançar erro caso o retorno do exame seja undefined
                    internal.error(`The ".exam()" method in test [${i+1}] is returning an "undefined" result. To validate the exam, it must return a "falsy" or "truthy" different from "undefined".`, "UNDEFINED RESULT")
                }
                // A FAZER EXAMES
            }
    
            return testRes
            
        })
    
        // Atribuir status e icon se houver algum teste falho ou com erro
        if (results.errorSize > 0) { // Alerta de erro tem preferência
            results.status = "Error"
            results.icon = icon.ERROR //+ (results.failSize > 0? icon.FAIL : "") // Adicionar icone de falha se possuir erro e falha
        } else if (results.failSize > 0) {
            results.status = "Fail"
            results.icon = icon.FAIL;
        }

    }


    return results
}

/** Cria um group para impressão do console com cabeçalho contendo informações passadas em Testool(options)
 * @param {InitOptions} This
*/
internal.logHeader = (handler, This = {}) => {
    const headStyle = "background: #ADD8E6; border-radius: 0 15px 0 0; padding: 2px 15px; border: 1px solid gray";
    const titleStyle = "font-style: italic; color: #4682B4";

    const header = `%cTest ${This.name? "for " + This.name + ":" : "Results:"}`
    console.group(header, headStyle)
    This.title ? console.log("%c➤ " + This.title, titleStyle, "\n\n") : null;
    handler()
    console.groupEnd()
}

/** Recebe um *`Objeto de Resultados de Teste`* e imprime no console
 * @param {{name: string, rootName: string}} identity
 * @param {TestResultsObject} resObj
 * @param {"last" | number} testIndex
*/
internal.logTests = (identity = {}, resObj, testIndex) => {
    //Verificar se root possui um nome
    const rootName = identity.rootName? identity.rootName + "." : ""
    const statusBar = `✔: ${resObj.okSize} | ⚠: ${resObj.failSize} |  ⃠ : ${resObj.errorSize} `;
    const groupHead = resObj.icon + " > " + rootName + identity.name + "()";
    
    // Cabeça da declaração
    if (testIndex === undefined) {
        // Mostrar grupo colapsado quando todos os testes forem solicitados
        console.groupCollapsed(groupHead)
    } else {
        // Mostrar grupo expandido quando apenas um ou o último deste for solicitado
        console.group(groupHead)
    }

    // Imprimir resumo, caso exista
    resObj.summary ? console.log("%c➤ " + resObj.summary || "", "font-style: italic;") : null
    // Imprimir barra de status
    console.log("%c" + statusBar, "border: 1px dashed gray; padding: 1px 5px")

    // Imprimir mensagem de alerta caso o status seja um Not Found
    if (resObj.status === "Not Found") {
        console.log("%c➤ " + ` "${identity.name}" ` + resObj.alert, "background: #FFA07A; padding: 1px 10px; font-weight: bold")
    } else {

        // Imprimir resultado dos testes
        const print = (id, status, test, output = false) => {
            console.log(`%c[${id}] ${icon[status.toUpperCase()]}:`, "font-weight: bold; border: 1px dashed #C0C0C0", test)
            // Imprimir saida
            output? console.log("%cOutput:", "font-weight: bold; color: orangered", test.output) : null
                
        }
    
        if (testIndex === "last") {
            const id = resObj.tests.length - 1
            const last = resObj.tests[id]
            // Imprimir apenas o último teste
            print(id+1, last.status, last, true)
            
        } else if (typeof testIndex === "number") { // Imprimir apenas teste solicitado
            /** O indice do teste na lista de teste */
            const id = testIndex - 1
            const get = resObj.tests[id]
            // Lançar erro caso o indice de teste requerido não existir
            if (get === undefined) {
              internal.error(`Test [${testIndex}] of "${rootName + identity.name}" not found!`);
            }
            print(testIndex, get.status, get, true)
        } else {
            // Imprimir todos os testes
            const testList = resObj.tests
            testList.forEach((test, id) => {
                print(id+1, test.status, test)
            })
        }
    }
    


    console.log("\n")
    console.groupEnd()
}


class TestMap {
    constructor() {
        internal.setter({functions: {}, properties: {}}, this)
    }
    
    /** Responsável por adicionar as declarações de funções/propriedades para teste aos seus respectivos lugares */
    add(target,) { }

    /** Responsável por obter uma declaração de função/propriedades para teste */
    get(target) { }
    
    get size() {
        return {
            func: Object.keys(this.functions).length,
            prop: Object.keys(this.properties).length
        }
    }
}
internal.NewTestMap = ()=>{return new TestMap()}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><
// Exportação dos módulos com segurança.
/** * Pacote de módulos internos de *`Testool`*
 * @param {unknown} unlok  */
export function __Internal__(unlock) {
    // Lançar erro se for chamado fora de contexto e sem Symbol de desbloqueio
    if (unlock !== SYM_Unlock) {
        let error = new Error("\n ⚠️ IUtils() is an internal process private object of the Testool.js lib.", { cause: "Private function call attempt.", })
        error.name = "Private Call"
        throw error
    }

    return internal
}


