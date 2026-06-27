export type ViaCepResult = {
	street: string;
	neighborhood: string;
	city: string;
	state: string;
};

export async function fetchAddressByCep(
	cep: string,
): Promise<ViaCepResult | null> {
	const digits = cep.replace(/\D/g, "");
	if (digits.length !== 8) return null;
	try {
		const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
		if (!res.ok) return null;
		const data = (await res.json()) as Record<string, string>;
		if (data.erro) return null;
		return {
			street: data.logradouro ?? "",
			neighborhood: data.bairro ?? "",
			city: data.localidade ?? "",
			state: data.uf ?? "",
		};
	} catch {
		return null;
	}
}
