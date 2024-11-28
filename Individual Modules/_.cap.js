/** * *`[string]`*
 * ---
 * * Transforma o primeiro caractere de uma *`String`* (ignora espaços iniciais) em maiúsculo e o restante em minúsculo e retorna uma nova *`String`* modificada.
 * ---
 * @param {string} str > Uma *`String`* a ser capitalizada.
 */
export default function cap (str) {
    if (typeof str == "string") {
        return str.replace(/\w\S*/, (w) => {
            return w.charAt(0).toUpperCase() + w.substring(1);
        });
    }
};
