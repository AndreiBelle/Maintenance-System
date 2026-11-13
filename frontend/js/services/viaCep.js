const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, ""); // (/"\D pega o que NÃO for número"/"g" pega em todo o texto)

    if (cepLimpo.length !== 8) {
        throw new Error("Informe um CEP válido com 8 números.");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
        throw new Error("Não foi possível consultar o CEP.");
    }

    const endereco = await response.json();

    if (endereco.erro) {
        throw new Error("CEP não encontrado.");
    }

    return {
        city: endereco.localidade,
        state: endereco.uf
    };
};

export { buscarCep };
