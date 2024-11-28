/** @typedef {[]} ArgsList Lista de argumentos de uma função*/

////////// InitOptions /////////
/**
 * @typedef {object} InitOptions
     * @property {HTMLElement} [HTMLTable] Recebe um Elemento HTML para servir de tabela de resultados.
     * @property {Object} [root] Um objeto que provem dos métodos que serão testados. Fornecer este objeto falicita a construção, execução e depuração dos testes. ⚠️Obs: `Classes ou Funções de Fábrica devem ser chamadas com seus respectivos argumentos - se houverem -` para assim ser possível expor seus métodos para a construção dos testes.
     * @property {string} [name] Uma *`String`* que represente o nome de um objeto de métodos caso este seja um objeto literal ou uma função anônima que provêm de métodos. O fornecimento de um nome é apenas para visual da depuração.
     * @property {string} [title] Um título ou descrição sobre o este teste.
*/

/**
 * @typedef {object} StatementOptions
 * @prop {string} [name] Se a função não possuir um nome *`(Function.name)`*, opcionalmente, pode ser fornecido um nome a ele para melhora depuração.
 * @prop {string} [summary] Uma descrição ou resumo sobre a função declarada para testes.
 * @prop {{}} [infos]
 */

/**
 * @typedef {object} ResultObject Um objeto de resultado de um teste implementado para uma função previamente declarada
 * @prop {ArgsList} args Um *`Array`* contendo os argumento recebidos pela função declarada para os teste atual.
 * @prop {any} [expect] O valor de retorno esperado para o teste atual.
 * @prop {any} [output] O valor de retorno ao executar a função declarada no teste atual.
 * @prop {boolean} [exam] Um *Boolean* indica se a função passou ou não no exame externo concedido quando a função declarada manipula objetos externos ou não retorna nada.
 * @prop {"Ok" | "Fail" | "Error"} status Uma *`String`* que representa o status do teste atual.
 * @prop {string} time O valor em *`ms`* do tempo de execução da função declarada no teste atual.
 * @prop {string}[error] A mensagem de erro lançada caso a função declarada caia em uma excessão ao ser executada.
 * @prop {string} [message] Uma mensagem de falha.
 * @prop {Array<string>} [stack] Uma *Array* contendo a pilha de erros caso a função declarada caia em uma excessão ao ser executada.
 * 
 */

/**
 * @typedef {Array<ResultObject>} ResultsList Um *Array* contendo os objetos de resultados dos testes aplicados para uma função declarada.
 */

/**
 * @typedef {{summary: string, icon: string, okSize: number, failSize: number, errorSize: number, tests: ResultsList, alert: string}} TestResultsObject
 *  
 */

/**
 * @typedef {__EXAM_CALLBACK_PROPS__} ExamProps
 */
const __EXAM_CALLBACK_PROPS__ = { output: undefined, args: [], isEqual(a, b) { } }

