import { z } from "zod";

export const categorySchema = z.object({
	title: z.string().trim().min(2, "Informe o nome (mínimo 2 caracteres)."),
	featured: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const optionSchema = z.object({
	label: z.string().trim().min(1, "Informe o nome da opção."),
	key: z.string().trim().min(1),
	values: z
		.array(z.string().trim().min(1))
		.min(1, "Adicione ao menos um valor.")
		.refine(
			(vals) => new Set(vals.map((v) => v.toLowerCase())).size === vals.length,
			"Valores não podem se repetir.",
		),
});

export const variantSchema = z.object({
	attributeValues: z.record(z.string(), z.string()),
	title: z.string().trim().min(1, "Informe o título."),
	description: z
		.string()
		.trim()
		.min(2, "Descrição deve ter entre 2 e 2000 caracteres.")
		.max(2000, "Descrição deve ter entre 2 e 2000 caracteres."),
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
	photos: z.array(z.instanceof(File)),
});

export const productSchema = z.object({
	name: z.string().trim().min(2, "Informe o nome (mínimo 2 caracteres)."),
	categoryId: z.string().min(1, "Selecione uma categoria."),
	options: z.array(optionSchema),
	variants: z
		.array(variantSchema)
		.min(1, "O produto precisa de ao menos uma variante."),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const emptyProductForm: ProductFormValues = {
	name: "",
	categoryId: "",
	options: [],
	variants: [
		{
			attributeValues: {},
			title: "",
			description: "",
			price: "",
			originalPrice: "",
			stock: "0",
			photos: [],
		},
	],
};
