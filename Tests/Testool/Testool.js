import { __Internal__ } from "./@internal/@internal.js"
import("./@internal/@typedef.js") // Importa os @typedef
"strict mode"
/** Lista de Symbols internos */
const SYM = {
    declared: Symbol("[declared]"),
    private: Symbol.for("[SYM*0001].private")
}

/** Mensagens de erros personalizados */
const MSG = {
    type(k, expect){
        return `The value of the "options.${k}" property must be a ${expect}.`;
    },
    voidStr(k) {
        return `The value of the "options.${k}" property cannot be an empty String or composed only of spaces.`;
    },

    invalidProp(k, valid) {
        const br = "\n  * "
        return `The property "options.${k}" is not a valid option.\n The expected properties are:\n${br + valid.join(br)}`;
    }
}

const OK = "✅";
const FAIL = "⚠️";
const ERROR = "❌";
/** Módulos internos */
const I = __Internal__(SYM.private);


export default class Testool {
    /**
     * * Declare e execute testes completos para funções ou métodos
     *
     * @param {InitOptions} options Objeto de configurações opcionais.
     */
    constructor(options = {}) {
        //Verificar se tipo do argumento passado está correto
        I.argError({
            arg: options,
            required: true,
            param: "options",
            types: ["Object"],
        });

        /** Lista de propriedades válidas para options */
        const validOpts = ["root", "name", "title", "HTMLTable"];
        /** Lista de propriedades validas e passadas como argumento */
        const optList = [...new Set([...validOpts, ...Object.keys(options)])];
        // Definir propriedades da classe obtendo valores passados em options
        optList.forEach((key) => {
            var prop = options[key];

            // Testes de tipo e passagem de valores
            if (key === "HTMLTable") {
                //Verificar tipo -- Lançar erro
                !(prop instanceof HTMLElement) && prop !== undefined
                    ? I.error(
                          MSG.type("HTMLTable", "HTMLElement"),
                          "TYPE ERROR"
                      )
                    : !prop
                    ? (prop = document)
                    : null;
            } else if (key === "name" || key === "title") {
                // Verificar tipo
                if (typeof prop !== "string" && prop !== undefined) {
                    I.error(MSG.type(key, "String"), "TYPE ERROR");
                } else if (prop !== undefined && I.strVoid(prop)) {
                    // Lançar erro para valor string vazio ou inválido
                    I.error(MSG.voidStr(key), "INVALID VALUE");
                }

                key === "name"
                    ? (prop = prop || I.getRootName(this.root))
                    : null; // Se um nome não for passado, tentar obter o nome da função passada em this.root ou null
            } else if (key === "root") {
                // Verificar se o valor passado é um object
                if (I.type(prop) !== "Object" && prop !== undefined) {
                    I.error(MSG.type(key, "Object"), "TYPE ERROR");
                }
            } else {
                // Lançar erro de propriedade inválida
                I.error(
                    MSG.invalidProp(key, [
                        "root",
                        "name",
                        "description",
                        "HTMLTable",
                    ]),
                    "INVALID PROPERTY"
                );
            }

            // Definir propriedades de this
            Object.defineProperty(this, key, { value: I.toNull(prop) });
        });

        // Define uma lista privada de funções declaradas para teste.
        Object.defineProperty(this, SYM.declared, { value: I.NewTestMap });
    }

    /**
     * * Declare uma *`função/método`* para ser adicionado à lista de execução de testes.
     * ---
     * @param {function | string} func Uma função ou método alvo a ser testado. Se for um método de um objeto, e este objeto foi fornecido previamente em *`options.object`* ,pode opcionalmente receber uma string que represente o nome do método. O método referente ao nome fornecido será buscado e adicionado à lista.
     * @param {(args: setArgs, options: StatementOptions)=>void} testHandler Executa uma *`callback function`* para a função declarada onde é possivel definir testes individuais para diferentes situações. Recebe um parâmetro *`(args)`*, uma função que recebe os argumentos da função de teste e fornece uma cadeia de métodos para o restante da declaração.
     */
    set(func, testHandler) {
        I.argError({ arg: func, param: "func", types: ["String", "Function"] });
        I.argError({
            arg: testHandler,
            param: "testHandler",
            types: ["Function"],
        });
        /** O nome da função alvo.*/
        var name = I.getFuncName(func); // Tentar obter nome da função caso esta possuir

        // Verifica se fn foi fornecida como uma string e buscar método em this.root
        if (typeof func === "string") {
            // Referência por nome só pode ser dado caso this.root tenha sido fornecido.
            !this.root
                ? I.error(
                      'A methods object needs to be provided beforehand in "Testool(options.root)" so that a reference by name can be accepted!',
                      "REFERENCE NOT ACCEPTED"
                  )
                : null;

            // Guardar nome
            name = func;
            // Obter método pelo nome // Obtém null caso um método não for encontrado. O método pode ter sido removido ou nome alterado
            func = I.getMethodByName(func, this.root);
        }

        /// Montar declaração e adicionar à lista de declarados
        const declared = this[SYM.declared].functions;
        // Adicionar sufixo ao nome caso este já existe na lista de declaração ou criar id caso um nome nao foi dado
        name = I.evaluateName(name, declared);

        /** Object de declaração montado */
        var statement = {
            target: func,
            tests: [],
        };
        // Adicionar declaração à lista principal
        declared[name] = statement;

        /** @typedef {defUnitTest} setArgs */ //Passando a lista de teste para a função interna fazer a inserção dos testes declarados na callback function.
        const defUnitTest = I.toTestList(statement.tests).args;

        /** Objeto de opções de informações para a função declarada, como um name, description e outras informações */
        const optProxy = new Proxy(
            {},
            {
                set(_, prop, value) {
                    /** Apenas define um erro personalizado para as propriedades fixas de options que devem receber uma String */
                    const isString = (prop) => {
                        typeof value !== "string"
                            ? I.error(
                                  `The value of the "options.${prop}" property must be a String.`,
                                  "TYPE ERROR"
                              )
                            : null;

                        value.trim() === ""
                            ? I.error(
                                  `The value of the "options.${prop}" property cannot be an empty String or composed only of spaces.`,
                                  "INVALID VALUE"
                              )
                            : null;
                    };
                    switch (prop) {
                        case "name":
                            isString("name");
                            /**Salva a declaração atual */
                            const saveStatemant = declared[name];

                            delete declared[name]; // Deletar declaração com chave antiga

                            //Atribuir novo nome à variável name
                            name = I.evaluateName(value, declared);
                            // Adicionar declaração salva com novo nome
                            declared[name] = saveStatemant;
                            break;

                        case "summary":
                            isString("summary");
                            //Criar propriedade de descrição no objeto de declaração da função
                            Object.defineProperty(declared[name], "summary", {
                                value: value,
                            });
                            break;

                        case "infos":
                            //Criar propriedade de informações adicionais no objeto de declaração da função
                            Object.defineProperty(statement, "infos", {
                                value: value,
                            });
                    }
                    return true;
                },
            }
        );

        // Executar testHandler para implementação dos testes individuais. Responsável por definir os argumentos, valor de retorno experado e outras avaliaçãoes para os testes.
        testHandler(defUnitTest, optProxy);

        // // Adicionar declaração à lista principal
        // declared[name] = statement;

        // const opt = {
        //     /** Adiciona uma descrição geral sobre a função/método que está sendo declarada para teste.
        //     *  @param {string} text Um texto de descrição.
        //     */
        //     description(text) {
        //         Object.defineProperty(declared[name], "description", { value: text })
        //         return {name: opt.name}
        //     },

        //     /**
        //      * Adiciona um novo nome para a declaração de teste da função/método atual.
        //      *
        //      * @param {string} newName Um nome para a declaração.
        //      */
        //     name(newName) {
        //         const saveStatemant = declared[name]
        //         delete declared[name]

        //         newName = I.evaluateName(newName, declared)
        //         declared[newName] = saveStatemant
        //     }
        // }

        return {
            /**
             * Adiciona informações gerais sobre a declaração atual.
             *
             * @param {StatementOptions} optObject Um objeto de configurações opcionais. Recebe as seguintes propriedades fixas:
             *       - `description`: Uma descrição geral sobre a função/método que está sendo declarada.
             *       - `name`: Um novo nome para a declaração atual. Esta sobreescreve o nome da função ou a referência dada por nome.
             * * Além destes, pode receber outras propriedades de gosto pessoal.
             */
            options(optObject = {}) {
                for (let key in optObject) {
                    const prop = optObject[key];
                    switch (key) {
                        //Adicionar propriedade de descrição da declaração atual
                        case "description":
                            Object.defineProperty(
                                declared[name],
                                "description",
                                { value: prop }
                            );
                            break;
                        case "name":
                            //const newName = optObject.name
                            /**Salva a declaração atual */
                            const saveStatemant = declared[name];
                            delete declared[name]; // Deletar declaração com chave antiga

                            //Atribuir novo nome à variável name
                            name = I.evaluateName(prop, declared);
                            // Adicionar declaração salva com novo nome
                            declared[name] = saveStatemant;
                            break;
                        default:
                            //Criar infos caso este não exista
                            if (!declared[name].infos) {
                                Object.defineProperty(declared[name], "infos", {
                                    value: {},
                                });
                            }

                            // Adicionar propriedade de gosto pessoal em .infos
                            Object.defineProperty(declared[name].infos, key, {
                                value: prop,
                            });
                    }
                }
            },
        };
    }

    /** Executa os testes e registra no console uma tabela completa contendo todos os resultados. */
    logAll() {
        I.logHeader(() => {
            const declared = this[SYM.declared].functions
            // Itera sobre as declarações
            Object.keys(declared).forEach((key) => {
                
                /** Obtém a declaração*/
                const statement = declared[key]
                const results = I.execTest(statement)
            
                // Imprimir resultados
                I.logTests({rootName: this.name, name: key}, results)
               

            })
        }, this)
    }

    /** Executa os testes da última função declarada na lista de *`[declared]`* e registra no console os resultados.
     * @param {boolean} lastTest Um *`Boolean`* define que o último teste da lista de testes da função declarada será executado e registrado no console.
     */
    logLast(lastTest = false) {
        // Se true, setar para key "last", se false, setar para true para que valor seja passado como parâmetro de internal.logTest, para que grupo seja expandido, caso um index não for passado
        lastTest = lastTest === true? "last" : (lastTest ?? true)
        const declared = this[SYM.declared].functions
        const key = Object.keys(declared).pop()
        const last = declared[key]
        I.logHeader(() => {
            const results = I.execTest(last)
            I.logTests({rootName: this.name, name: key}, results, lastTest)
        }, this)
    }

    /** Executa os testes de uma dada função declarada na lista de *`[declared]`* e registra os resultados no console.
     *
     * @param {function | string} func Uma função previamente declarada para teste ou uma string que represente o nome da função ou nome dado à declaração.
     * @param {boolean} lastTest Um *`Boolean`* define que o último teste da lista de testes da função declarada será executado e registrado no console.
     */
    logOnly(func, lastTest = false) {
        //Validar se parâmetros foram passados corretamente
        I.argError({ arg: func, types: ["String", "Function"] })
        I.argError({ arg: lastTest, param: 2, required: false, types: ["Boolean"] })

        const declared = this[SYM.declared].functions
        const keys = Object.keys(declared)
        /** O nome da declaração encontrada */
        var name
        /** Testa se a referência passada é de uma função previamente declarada e obtém a declaração desta */
        const statement = I.find(keys, (key,) => {
            const get = declared[key]
            if ((typeof func === "string" && func === key) || (typeof func === "function" && func === get.target)) {
                name = key
                return get
            }
        })

        
        // Lançar erro caso referência passada não constar na lista de funções declaradas
        const fnName = I.getFuncName(func) || func
        statement === undefined ? I.error(`No declaration record found for ${typeof fnName == "string" ? `"${fnName}"` : "this function"}!`, "NOT DECLARED") : null
        
        // Executar testes e imprimir resultados
        I.logHeader(() => {
            const results = I.execTest(statement)
            I.logTests({name: name, rootName: this.name}, results, lastTest? "last" : true)
            
        }, this)
    }
}
