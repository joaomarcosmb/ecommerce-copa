export type ProductOption = { name: string; values: string[] };

export type VariantDraft = {
	optionValues: string[];
	price: string;
	originalPrice: string;
	stock: string;
	sku: string;
	image?: File | string;
};

export const MAX_VARIANTS = 100;

export function emptyVariant(optionValues: string[]): VariantDraft {
	return {
		optionValues,
		price: "",
		originalPrice: "",
		stock: "0",
		sku: "",
		image: undefined,
	};
}

/** Chave estável de uma combinação, para reconciliação. */
function comboKey(optionValues: string[]): string {
	return optionValues.join("|");
}

/** Produto cartesiano dos valores das opções, na ordem das opções. */
function cartesian(options: ProductOption[]): string[][] {
	return options.reduce<string[][]>(
		(acc, opt) => acc.flatMap((combo) => opt.values.map((v) => [...combo, v])),
		[[]],
	);
}

/**
 * Gera a matriz de variantes a partir das opções, preservando os dados já
 * digitados (preço/estoque/sku/imagem) das combinações que continuam existindo.
 * Sem opções (ou opções sem valores) → 1 variante "default" com optionValues [].
 */
export function buildVariantMatrix(
	options: ProductOption[],
	existing: VariantDraft[],
): VariantDraft[] {
	const usable = options.filter((o) => o.values.length > 0);
	const byKey = new Map(existing.map((v) => [comboKey(v.optionValues), v]));

	if (usable.length === 0) {
		return [byKey.get(comboKey([])) ?? emptyVariant([])];
	}

	return cartesian(usable).map((optionValues) => {
		const prev = byKey.get(comboKey(optionValues));
		return prev ? { ...prev, optionValues } : emptyVariant(optionValues);
	});
}

/** Sugere um SKU a partir do nome do produto + valores da combinação. */
export function suggestSku(
	productName: string,
	optionValues: string[],
): string {
	const slug = (s: string) =>
		s
			.normalize("NFD")
			.replace(/[̀-ͯ]/g, "")
			.toUpperCase()
			.replace(/[^A-Z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	return [productName, ...optionValues].map(slug).filter(Boolean).join("-");
}
