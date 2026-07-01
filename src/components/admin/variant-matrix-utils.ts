import { slugify } from "./slugify";

export type ProductOption = { label: string; key: string; values: string[] };

export type VariantDraft = {
	id?: string;
	attributeValues: Record<string, string>;
	title: string;
	description: string;
	price: string;
	originalPrice: string;
	stock: string;
	photos: File[];
};

export const MAX_VARIANTS = 100;
export const MAX_VARIANT_PHOTOS = 4;

export function emptyVariant(
	attributeValues: Record<string, string>,
): VariantDraft {
	return {
		attributeValues,
		title: "",
		description: "",
		price: "",
		originalPrice: "",
		stock: "0",
		photos: [],
	};
}

/** Chave estável de uma combinação, para reconciliação. */
function comboKey(
	options: ProductOption[],
	attributeValues: Record<string, string>,
): string {
	return options.map((o) => attributeValues[o.key] ?? "").join("|");
}

/** Produto cartesiano dos valores das opções, na ordem das opções. */
function cartesian(options: ProductOption[]): Record<string, string>[] {
	return options.reduce<Record<string, string>[]>(
		(acc, opt) =>
			acc.flatMap((combo) =>
				opt.values.map((v) => ({ ...combo, [opt.key]: v })),
			),
		[{}],
	);
}

/**
 * Gera a matriz de variantes a partir das opções, preservando os dados já
 * digitados (título/preço/estoque/foto) das combinações que continuam existindo.
 * Sem opções (ou opções sem valores) → 1 variante "default" com attributeValues {}.
 */
export function buildVariantMatrix(
	options: ProductOption[],
	existing: VariantDraft[],
): VariantDraft[] {
	const usable = options.filter((o) => o.values.length > 0);
	const byKey = new Map(
		existing.map((v) => [comboKey(usable, v.attributeValues), v]),
	);

	if (usable.length === 0) {
		return [byKey.get(comboKey([], {})) ?? emptyVariant({})];
	}

	return cartesian(usable).map((attributeValues) => {
		const prev = byKey.get(comboKey(usable, attributeValues));
		return prev ? { ...prev, attributeValues } : emptyVariant(attributeValues);
	});
}

/** Sugere um título a partir do nome do produto + valores da combinação. */
export function suggestTitle(
	productName: string,
	options: ProductOption[],
	attributeValues: Record<string, string>,
): string {
	const values = options
		.map((o) => attributeValues[o.key])
		.filter((v): v is string => Boolean(v));
	return [productName, ...values].filter(Boolean).join(" · ");
}

/** Deriva uma chave de opção estável (slug) a partir do rótulo, evitando colisões. */
export function deriveOptionKey(label: string, others: string[]): string {
	const base = slugify(label) || "opcao";
	if (!others.includes(base)) return base;
	let i = 2;
	while (others.includes(`${base}-${i}`)) i++;
	return `${base}-${i}`;
}
