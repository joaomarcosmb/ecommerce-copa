import { apiDelete, apiGet, apiPatch, apiUpload } from "@/lib/api";
import type { ProductFormValues } from "@/components/admin/schemas";
import type { ProductAdminResponse } from "@/api/generated/model";

export type AdminOption = { key: string; label: string };

export type AdminVariant = {
	id: string;
	attributeValues: Record<string, string>;
	title: string;
	description: string;
	price: number;
	originalPrice: number | null;
	stock: number;
	photos: string[];
};

export type AdminProductDetail = {
	id: string;
	name: string;
	categoryId: string;
	categoryTitle: string;
	options: AdminOption[];
	variants: AdminVariant[];
};

export type VariantInput = {
	title: string;
	description: string;
	price: number;
	originalPrice: number | null;
	stock: number;
	attributeValues: Record<string, string>;
};

function mapProduct(data: ProductAdminResponse): AdminProductDetail {
	return {
		id: data.id ?? "",
		name: data.name ?? "",
		categoryId: data.category?.id ?? "",
		categoryTitle: data.category?.title ?? "",
		options: (data.options ?? []).map((o) => ({
			key: o.key ?? "",
			label: o.label ?? "",
		})),
		variants: (data.variants ?? []).map((v) => ({
			id: v.id ?? "",
			attributeValues: (v.attributes ?? {}) as Record<string, string>,
			title: v.title ?? "",
			description: v.description ?? "",
			price: v.price ?? 0,
			originalPrice: v.originalPrice ?? null,
			stock: v.stock ?? 0,
			photos: v.photos ?? [],
		})),
	};
}

/** Cria o Product junto com opções e variantes num único envio multipart. */
export async function createProduct(
	values: ProductFormValues,
): Promise<AdminProductDetail> {
	const formData = new FormData();
	formData.append(
		"data",
		JSON.stringify({
			name: values.name,
			categoryId: values.categoryId,
			options: values.options.map((o) => ({ key: o.key, label: o.label })),
			variants: values.variants.map((v) => ({
				title: v.title,
				description: v.description ?? "",
				price: Number(v.price),
				originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
				stock: Number(v.stock),
				attributes: v.attributeValues,
			})),
		}),
	);
	values.variants.forEach((v, index) => {
		const cover = v.photos[0];
		if (cover) formData.append(`variantImage${index}`, cover);
	});
	let product = mapProduct(
		await apiUpload<ProductAdminResponse>("/admin/products", "POST", formData),
	);

	// A criação só aceita 1 foto por variante (capa); fotos extras são
	// enviadas em seguida, uma a uma, pela rota de fotos da variante.
	for (const [index, variant] of values.variants.entries()) {
		const createdVariant = product.variants[index];
		if (!createdVariant) continue;
		for (const photo of variant.photos.slice(1)) {
			product = await addVariantPhoto(product.id, createdVariant.id, photo);
		}
	}

	return product;
}

export async function getProduct(id: string): Promise<AdminProductDetail> {
	const data = await apiGet<ProductAdminResponse>(`/admin/products/${id}`);
	return mapProduct(data);
}

/** Atualiza somente nome/categoria do Product. */
export async function updateProductDetails(
	id: string,
	patch: { name: string; categoryId: string },
): Promise<AdminProductDetail> {
	const data = await apiPatch<ProductAdminResponse>(
		`/admin/products/${id}`,
		patch,
	);
	return mapProduct(data);
}

/** Cria uma nova variante/SKU para um Product existente. */
export async function createVariant(
	productId: string,
	input: VariantInput,
	photos: File[],
): Promise<AdminProductDetail> {
	const formData = new FormData();
	formData.append(
		"data",
		JSON.stringify({
			title: input.title,
			description: input.description,
			price: input.price,
			originalPrice: input.originalPrice ?? undefined,
			stock: input.stock,
			attributes: input.attributeValues,
		}),
	);
	photos.forEach((file, index) => {
		formData.append(`image${index}`, file);
	});
	const data = await apiUpload<ProductAdminResponse>(
		`/admin/products/${productId}/variants`,
		"POST",
		formData,
	);
	return mapProduct(data);
}

/** Atualiza os dados de uma variante/SKU existente (sem mexer nas fotos). */
export async function updateVariant(
	productId: string,
	skuId: string,
	input: VariantInput,
): Promise<AdminProductDetail> {
	const data = await apiPatch<ProductAdminResponse>(
		`/admin/products/${productId}/variants/${skuId}`,
		{
			title: input.title,
			description: input.description,
			price: input.price,
			originalPrice: input.originalPrice ?? undefined,
			stock: input.stock,
			attributes: input.attributeValues,
		},
	);
	return mapProduct(data);
}

export async function deleteVariant(
	productId: string,
	skuId: string,
): Promise<void> {
	await apiDelete(`/admin/products/${productId}/variants/${skuId}`);
}

export async function addVariantPhoto(
	productId: string,
	skuId: string,
	file: File,
): Promise<AdminProductDetail> {
	const formData = new FormData();
	formData.append("image", file);
	const data = await apiUpload<ProductAdminResponse>(
		`/admin/products/${productId}/variants/${skuId}/photos`,
		"POST",
		formData,
	);
	return mapProduct(data);
}

export async function deleteVariantPhoto(
	productId: string,
	skuId: string,
	photo: string,
): Promise<AdminProductDetail> {
	const data = await apiDelete<ProductAdminResponse>(
		`/admin/products/${productId}/variants/${skuId}/photos?photo=${encodeURIComponent(photo)}`,
	);
	return mapProduct(data);
}

export async function reorderVariantPhotos(
	productId: string,
	skuId: string,
	photos: string[],
): Promise<AdminProductDetail> {
	const data = await apiPatch<ProductAdminResponse>(
		`/admin/products/${productId}/variants/${skuId}/photos/reorder`,
		{ photos },
	);
	return mapProduct(data);
}
