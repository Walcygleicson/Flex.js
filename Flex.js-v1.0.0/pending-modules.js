function isHexadecimal(valor) {
    function paraHexadecimal(numero) {
        if (typeof numero !== "number" || isNaN(numero)) {
            return "Erro: Valor inválido";
        }
        return "0x" + numero.toString(16);
    }

    valor = paraHexadecimal(valor);
    console.log(valor);
    return /^0x[0-9a-fA-F]+$/.test(valor);
}
