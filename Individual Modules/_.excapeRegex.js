/** * *`[string]`*
 * ---
 * * Retorna uma nova *`String`* com os metacaracteres que compõem uma *`RegExp`* escapados.
 *  > * Obs: *Isto não inclui caracteres como: "s", "w", "d" "<", "=", "!", "&", entre outros, que fora de certo escopo são considerados literais. Para escapá-los, inclua-os em uma string no segundo parâmetro.*
 * @param {string} str > Uma *`String`* a ser modificada.
 * @param {string} includes > Uma *`String`*, incluindo os demais caracteres a serem escapados. Se nada for passado o padrão é uma string vazia.
 */
export default function escapeRegex (str, includes = "") {
    if (typeof str == "string") {
        return str.replace(
            new RegExp(`[.*+$?^/{}()\\\\|[\\]${includes}]`, "g"),
            "\\$&"
        );
    }
};
