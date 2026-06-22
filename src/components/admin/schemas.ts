import { z } from "zod";

export const categorySchema = z.object({
	title: z.string().trim().min(2, "Informe o nome (mínimo 2 caracteres)."),
	featured: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const productSchema = z.object({
	categoryId: z.string().min(1, "Selecione uma categoria."),
	schemaSelectors: z.array(
		z.object({
			key: z.string().trim().min(1, "Informe a chave."),
			label: z.string().trim().min(1, "Informe o rótulo."),
		}),
	),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const emptyProductForm: ProductFormValues = {
	categoryId: "",
	schemaSelectors: [],
};

export const skuSchema = z.object({
	title: z.string().trim().min(1, "Informe o título."),
	description: z.string().trim().min(1, "Informe a descrição."),
	price: z
		.string()
		.min(1, "Informe o preço.")
		.refine((v) => Number(v) > 0, "Deve ser maior que zero."),
	originalPrice: z.string().optional(),
	stock: z
		.string()
		.min(1, "Informe o estoque.")
		.refine(
			(v) => Number.isInteger(Number(v)) && Number(v) >= 0,
			"Estoque inválido.",
		),
	attributes: z.array(
		z.object({
			key: z.string().trim().min(1, "Informe a chave."),
			value: z.string().trim().min(1, "Informe o valor."),
		}),
	),
});

export type SkuFormValues = z.infer<typeof skuSchema>;

export const emptySkuForm: SkuFormValues = {
	title: "",
	description: "",
	price: "",
	originalPrice: "",
	stock: "0",
	attributes: [],
};
