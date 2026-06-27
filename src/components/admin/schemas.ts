import { z } from "zod";

export const categorySchema = z.object({
	title: z.string().trim().min(2, "Informe o nome (mínimo 2 caracteres)."),
	featured: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const optionSchema = z.object({
	name: z.string().trim().min(1, "Informe o nome da opção."),
	values: z
		.array(z.string().trim().min(1))
		.min(1, "Adicione ao menos um valor.")
		.refine(
			(vals) => new Set(vals.map((v) => v.toLowerCase())).size === vals.length,
			"Valores não podem se repetir.",
		),
});

export const variantSchema = z.object({
	optionValues: z.array(z.string()),
	price: z
		.string()
		.min(1, "Informe o preço.")
		.refine((v) => Number(v) > 0, "Deve ser maior que zero."),
	originalPrice: z
		.string()
		.optional()
		.refine(
			(v) => !v || Number(v) > 0,
			"Preço original deve ser maior que zero.",
		),
	stock: z
		.string()
		.min(1, "Informe o estoque.")
		.refine(
			(v) => Number.isInteger(Number(v)) && Number(v) >= 0,
			"Estoque inválido.",
		),
	sku: z.string().trim().min(1, "Informe o SKU."),
	image: z.any().optional(),
});

export const productSchema = z.object({
	name: z.string().trim().min(2, "Informe o nome (mínimo 2 caracteres)."),
	description: z.string().trim().optional(),
	categoryId: z.string().min(1, "Selecione uma categoria."),
	images: z.array(z.any()),
	options: z.array(optionSchema),
	variants: z
		.array(variantSchema)
		.min(1, "O produto precisa de ao menos uma variante.")
		.refine((vs) => {
			const skus = vs.map((v) => v.sku.trim().toLowerCase()).filter(Boolean);
			return new Set(skus).size === skus.length;
		}, "Os SKUs das variantes devem ser únicos."),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const emptyProductForm: ProductFormValues = {
	name: "",
	description: "",
	categoryId: "",
	images: [],
	options: [],
	variants: [
		{
			optionValues: [],
			price: "",
			originalPrice: "",
			stock: "0",
			sku: "",
			image: undefined,
		},
	],
};
