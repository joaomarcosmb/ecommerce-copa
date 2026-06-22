import { z } from "zod";

import type { Product } from "@/components/ecommerce-showcase/data";

export const PRODUCT_CATEGORY_VALUES = ["albuns", "figurinhas"] as const;

/**
 * Product form schema. Numeric inputs are kept as strings (HTML inputs emit
 * strings) and converted to numbers when building the Product — this keeps the
 * react-hook-form input and output types identical.
 */
export const productSchema = z
	.object({
		title: z.string().trim().min(1, "Informe o título."),
		price: z
			.string()
			.min(1, "Informe o preço.")
			.refine((v) => Number(v) > 0, "Preço deve ser maior que zero."),
		originalPrice: z
			.string()
			.refine((v) => v === "" || Number(v) > 0, "Preço original inválido."),
		category: z.enum(PRODUCT_CATEGORY_VALUES),
		badge: z.string(),
		image: z.string().min(1, "Informe a URL da imagem."),
		images: z.array(
			z.object({ url: z.url("URL inválida.").or(z.literal("")) }),
		),
		variants: z.array(
			z.object({
				label: z.string().trim().min(1, "Informe o rótulo."),
				productId: z
					.string()
					.min(1, "Informe o ID.")
					.refine((v) => Number.isInteger(Number(v)), "ID inválido."),
			}),
		),
	})
	.refine(
		(d) => d.originalPrice === "" || Number(d.originalPrice) > Number(d.price),
		{
			message: "Preço original deve ser maior que o preço.",
			path: ["originalPrice"],
		},
	);

export type ProductFormValues = z.infer<typeof productSchema>;

export const emptyProductForm: ProductFormValues = {
	title: "",
	price: "",
	originalPrice: "",
	category: "albuns",
	badge: "",
	image: "",
	images: [],
	variants: [],
};

/** Maps an existing Product to editable form values. */
export function productToForm(product: Product): ProductFormValues {
	return {
		title: product.title,
		price: String(product.price),
		originalPrice:
			product.originalPrice != null ? String(product.originalPrice) : "",
		category: product.category,
		badge: product.badge ?? "",
		image: product.image,
		images: (product.images ?? []).map((url) => ({ url })),
		variants: (product.variants ?? []).map((v) => ({
			label: v.label,
			productId: String(v.productId),
		})),
	};
}

/**
 * Converts form values into the persisted Product shape, omitting the
 * system-managed fields (id, rating, reviewCount). Empty optional fields are
 * dropped so they don't linger on the saved product.
 */
export function formToProduct(
	values: ProductFormValues,
): Omit<Product, "id" | "rating" | "reviewCount"> {
	const images = values.images.map((i) => i.url.trim()).filter(Boolean);
	const variants = values.variants.map((v) => ({
		label: v.label.trim(),
		productId: Number(v.productId),
	}));
	const badge = values.badge.trim();

	return {
		title: values.title.trim(),
		price: Number(values.price),
		category: values.category,
		image: values.image.trim(),
		...(values.originalPrice
			? { originalPrice: Number(values.originalPrice) }
			: {}),
		...(badge ? { badge } : {}),
		...(images.length ? { images } : {}),
		...(variants.length ? { variants } : {}),
	};
}

export const categorySchema = z.object({
	label: z.string().trim().min(1, "Informe o nome."),
	slug: z
		.string()
		.min(1, "Informe o slug.")
		.regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
