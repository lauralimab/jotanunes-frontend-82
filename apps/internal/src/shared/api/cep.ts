export type CepAddress = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export async function getAddressByCep(cep: string, signal?: AbortSignal): Promise<CepAddress | null> {
  if (!/^\d{8}$/.test(cep)) throw new Error("Informe um CEP com 8 dígitos.");
  const timeout = AbortSignal.timeout(8000);
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) throw new Error("Não foi possível consultar o CEP.");
  const data = await response.json();
  if (data.erro === true || data.erro === "true") return null;
  if (typeof data.localidade !== "string" || typeof data.uf !== "string") {
    throw new Error("O serviço de CEP retornou um endereço inválido.");
  }
  return {
    street: typeof data.logradouro === "string" ? data.logradouro : "",
    neighborhood: typeof data.bairro === "string" ? data.bairro : "",
    city: data.localidade,
    state: data.uf,
  };
}
