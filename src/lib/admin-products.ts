import { ApiError } from "@/lib/api";
import type { ProductFormValues } from "@/components/admin/schemas";
import type {
	ProductOption,
	VariantDraft,
} from "@/components/admin/variant-matrix-utils";

export type AdminProductDetail = {
	id: string;
	name: string;
	description: string;
	categoryId: string;
	images: string[];
	options: ProductOption[];
	variants: VariantDraft[];
};

function buildFormData(values: ProductFormValues): FormData {
	const fd = new FormData();
	fd.append("name", values.name);
	fd.append("description", values.description ?? "");
	fd.append("categoryId", values.categoryId);
	fd.append("options", JSON.stringify(values.options));

	// Variantes sem o blob de imagem; arquivos vão em variantImages[<index>].
	const variants = values.variants.map((v, index) => {
		if (v.image instanceof File) fd.append(`variantImages[${index}]`, v.image);
		return {
			optionValues: v.optionValues,
			price: v.price,
			originalPrice: v.originalPrice || null,
			stock: v.stock,
			sku: v.sku,
			image: typeof v.image === "string" ? v.image : null,
		};
	});
	fd.append("variants", JSON.stringify(variants));

	// Galeria: URLs já salvas em JSON; novos uploads em images[].
	const imageUrls: string[] = [];
	for (const img of values.images) {
		if (img instanceof File) fd.append("images", img);
		else if (typeof img === "string") imageUrls.push(img);
	}
	fd.append("imageUrls", JSON.stringify(imageUrls));

	return fd;
}

async function submit(
	path: string,
	method: "POST" | "PATCH",
	values: ProductFormValues,
): Promise<{ id: string }> {
	const res = await fetch(`/api${path}`, {
		method,
		credentials: "include",
		body: buildFormData(values),
	});
	const json = await res.json();
	if (!res.ok) {
		const e = json?.error ?? {};
		throw new ApiError(
			e.code ?? "ERROR",
			e.message ?? "Erro ao salvar o produto.",
			e.details,
		);
	}
	return json.data as { id: string };
}

export function createProduct(values: ProductFormValues) {
	return submit("/admin/products", "POST", values);
}

export function updateProduct(id: string, values: ProductFormValues) {
	return submit(`/admin/products/${id}`, "PATCH", values);
}

export async function getProduct(id: string): Promise<AdminProductDetail> {
	const res = await fetch(`/api/admin/products/${id}`, {
		credentials: "include",
	});
	const json = await res.json();
	if (!res.ok) {
		const e = json?.error ?? {};
		throw new ApiError(e.code ?? "ERROR", e.message ?? "Erro ao carregar.");
	}
	const d = json.data as AdminProductDetail;
	return {
		id: d.id,
		name: d.name ?? "",
		description: d.description ?? "",
		categoryId: d.categoryId ?? "",
		images: d.images ?? [],
		options: d.options ?? [],
		variants:
			d.variants && d.variants.length > 0
				? d.variants.map((v) => ({
						optionValues: v.optionValues ?? [],
						price: String(v.price ?? ""),
						originalPrice:
							v.originalPrice != null ? String(v.originalPrice) : "",
						stock: String(v.stock ?? "0"),
						sku: v.sku ?? "",
						image: typeof v.image === "string" ? v.image : undefined,
					}))
				: [
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
}
