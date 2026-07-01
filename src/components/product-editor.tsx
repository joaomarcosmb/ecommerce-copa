import { useEffect, useState } from "react";
import type {
	CategoryListResponse,
	CategoryResponse,
} from "@/api/generated/model";
import { ProductCreateForm } from "@/components/admin/product-create-form";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { AppShell } from "@/components/ecommerce-showcase/app-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageLoader } from "@/components/ui/page-loader";
import { useCurrentUser } from "@/hooks/use-current-user";
import { type AdminProductDetail, getProduct } from "@/lib/admin-products";
import { apiGet } from "@/lib/api";

interface ProductEditorProps {
	productId?: string;
}

export function ProductEditor({ productId }: ProductEditorProps) {
	const { user, isLoading: authLoading } = useCurrentUser();
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const [product, setProduct] = useState<AdminProductDetail | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const resolvedId =
		productId ??
		(typeof window !== "undefined"
			? (new URLSearchParams(window.location.search).get("id") ?? undefined)
			: undefined);

	useEffect(() => {
		async function load() {
			try {
				const cats = await apiGet<CategoryListResponse>("/admin/categories");
				setCategories(cats.items ?? []);
				if (resolvedId) {
					setProduct(await getProduct(resolvedId));
				}
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Erro ao carregar.");
			} finally {
				setIsLoading(false);
			}
		}
		load();
	}, [resolvedId]);

	if (authLoading) {
		return (
			<AppShell>
				<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
					<PageLoader />
				</main>
			</AppShell>
		);
	}
	if (user === null) {
		window.location.href = "/signin";
		return null;
	}
	if (user.role !== "ADMIN") {
		window.location.href = "/account";
		return null;
	}

	if (loadError) {
		return (
			<AppShell>
				<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
					<Alert variant="error">
						<AlertDescription>{loadError}</AlertDescription>
					</Alert>
				</main>
			</AppShell>
		);
	}

	if (isLoading) {
		return (
			<AppShell>
				<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
					<PageLoader />
				</main>
			</AppShell>
		);
	}

	if (resolvedId && product) {
		return <ProductEditForm product={product} categories={categories} />;
	}

	return <ProductCreateForm categories={categories} />;
}
