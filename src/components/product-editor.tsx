import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormTextarea,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AdminField } from "@/components/admin/admin-field";
import { ProductImagesField } from "@/components/admin/product-images-field";
import { VariantOptionsEditor } from "@/components/admin/variant-options-editor";
import { VariantMatrix } from "@/components/admin/variant-matrix";
import {
	buildVariantMatrix,
	suggestSku,
	MAX_VARIANTS,
	type ProductOption,
	type VariantDraft,
} from "@/components/admin/variant-matrix-utils";
import {
	emptyProductForm,
	productSchema,
	type ProductFormValues,
} from "@/components/admin/schemas";
import { createProduct, getProduct, updateProduct } from "@/lib/admin-products";
import {
	MOCK_CATEGORIES,
	MOCK_PRODUCT_DETAILS,
	PREVIEW_MOCK,
} from "@/lib/admin-products-mock";
import { ApiError, apiGet } from "@/lib/api";
import type {
	CategoryListResponse,
	CategoryResponse,
} from "@/api/generated/model";
import { AppShell } from "@/components/ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "@/components/ecommerce-showcase/breadcrumb-nav";

interface ProductEditorProps {
	productId?: string;
}

function SectionCard({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<Card className="border-transparent p-6 shadow-none sm:p-7">
			<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
				{title}
			</h2>
			{description && (
				<p className="mt-1 font-['Poppins',sans-serif] text-[14px] text-slate-500">
					{description}
				</p>
			)}
			<div className="mt-5">{children}</div>
		</Card>
	);
}

export function ProductEditor({ productId }: ProductEditorProps) {
	const { user, isLoading: authLoading } = useCurrentUser();
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [formError, setFormError] = useState<string | null>(null);
	const [matrixWarning, setMatrixWarning] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: emptyProductForm,
	});

	// Em edição a página é estática; o id vem da query (?id=…), como nas demais
	// páginas admin. O prop continua suportado para uso direto.
	const resolvedId =
		productId ??
		(typeof window !== "undefined"
			? (new URLSearchParams(window.location.search).get("id") ?? undefined)
			: undefined);

	useEffect(() => {
		async function load() {
			if (PREVIEW_MOCK) {
				setCategories(MOCK_CATEGORIES);
				const product = resolvedId
					? MOCK_PRODUCT_DETAILS[resolvedId]
					: undefined;
				if (product) {
					form.reset({
						name: product.name,
						description: product.description,
						categoryId: product.categoryId,
						images: product.images,
						options: product.options,
						variants: product.variants,
					});
				}
				setIsLoading(false);
				return;
			}
			try {
				const cats = await apiGet<CategoryListResponse>("/admin/categories");
				setCategories(cats.items ?? []);
				if (resolvedId) {
					const product = await getProduct(resolvedId);
					form.reset({
						name: product.name,
						description: product.description,
						categoryId: product.categoryId,
						images: product.images,
						options: product.options,
						variants: product.variants,
					});
				}
			} catch (err) {
				setLoadError(err instanceof Error ? err.message : "Erro ao carregar.");
			} finally {
				setIsLoading(false);
			}
		}
		load();
	}, [resolvedId, form]);

	const isEditing = Boolean(resolvedId);

	const breadcrumbItems = useMemo(
		() => [
			{ label: "Início", href: "/" },
			{ label: "Administração", href: "/admin" },
			{ label: "Produtos", href: "/admin/products" },
			{ label: isEditing ? "Editar produto" : "Novo produto" },
		],
		[isEditing],
	);

	if (!PREVIEW_MOCK && !authLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}
	if (!PREVIEW_MOCK && !authLoading && user?.role !== "ADMIN") {
		window.location.href = "/account";
		return null;
	}

	function recomputeVariants(options: ProductOption[]) {
		const usable = options.filter((o) => o.values.length > 0);
		const total =
			usable.length === 0
				? 1
				: usable.reduce((acc, o) => acc * o.values.length, 1);
		if (total > MAX_VARIANTS) {
			setMatrixWarning(
				`São ${total} combinações; o limite é ${MAX_VARIANTS}. Reduza os valores das opções.`,
			);
			return;
		}
		setMatrixWarning(null);
		const current = form.getValues("variants") as VariantDraft[];
		const next = buildVariantMatrix(options, current).map(
			(v): VariantDraft => ({
				...v,
				sku: v.sku || suggestSku(form.getValues("name"), v.optionValues),
			}),
		);
		form.setValue("variants", next, { shouldValidate: false });
	}

	function handleOptionsChange(next: ProductOption[]) {
		form.setValue("options", next, { shouldValidate: false });
		recomputeVariants(next);
	}

	function handleVariantsChange(next: VariantDraft[]) {
		form.setValue("variants", next, { shouldValidate: false });
	}

	function handleRemoveVariant(index: number) {
		const current = form.getValues("variants") as VariantDraft[];
		if (current.length <= 1) return;
		form.setValue(
			"variants",
			current.filter((_, i) => i !== index),
			{ shouldValidate: false },
		);
	}

	function handleApplyToAll(patch: { price?: string; stock?: string }) {
		const current = form.getValues("variants") as VariantDraft[];
		form.setValue(
			"variants",
			current.map((v) => ({
				...v,
				price: patch.price ?? v.price,
				stock: patch.stock ?? v.stock,
			})),
			{ shouldValidate: false },
		);
	}

	async function onSubmit(values: ProductFormValues) {
		setFormError(null);
		setIsSubmitting(true);
		if (PREVIEW_MOCK) {
			// Preview local: não envia ao backend, apenas mostra o payload.
			console.log("Produto (preview, não enviado):", values);
			window.alert(
				`Preview: "${values.name}" salvo localmente com ${values.variants.length} variante(s). Nada foi enviado ao backend.`,
			);
			setIsSubmitting(false);
			return;
		}
		try {
			if (resolvedId) await updateProduct(resolvedId, values);
			else await createProduct(values);
			window.location.href = "/admin/products";
		} catch (err) {
			if (err instanceof ApiError && err.details?.length) {
				setFormError(err.details.map((d) => d.message).join(" · "));
			} else {
				setFormError(err instanceof Error ? err.message : "Erro inesperado.");
			}
			setIsSubmitting(false);
		}
	}

	const options = form.watch("options") as ProductOption[];
	const variants = form.watch("variants") as VariantDraft[];
	const images = form.watch("images");

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
				<BreadcrumbNav items={breadcrumbItems} />

				<h1 className="mt-6 font-big-shoulders text-4xl font-bold text-slate-900">
					{isEditing ? "Editar produto" : "Novo produto"}
				</h1>

				{loadError ? (
					<Alert variant="error" className="mt-6">
						<AlertDescription>{loadError}</AlertDescription>
					</Alert>
				) : isLoading ? (
					<p className="mt-8 font-['Poppins',sans-serif] text-slate-500">
						Carregando…
					</p>
				) : (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="mt-4 space-y-6"
						>
							{formError && (
								<Alert variant="error">
									<AlertDescription>{formError}</AlertDescription>
								</Alert>
							)}

							<SectionCard title="Detalhes">
								<div className="space-y-5">
									<AdminField<ProductFormValues>
										name="name"
										label="Nome"
										placeholder="Álbum Copa do Mundo 2026"
									/>
									<FormField<ProductFormValues>
										name="description"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Descrição</FormLabel>
												<FormTextarea
													{...field}
													value={(field.value as string) ?? ""}
													placeholder="Descreva o produto…"
												/>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField<ProductFormValues>
										name="categoryId"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel>Categoria</FormLabel>
												<Select
													value={field.value as string}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Selecione uma categoria" />
													</SelectTrigger>
													<SelectContent>
														{categories.map((c) => (
															<SelectItem key={c.id} value={c.id ?? ""}>
																{c.title}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</SectionCard>

							<SectionCard
								title="Imagens"
								description="A primeira imagem é usada como capa."
							>
								<ProductImagesField
									value={images}
									onChange={(next) =>
										form.setValue("images", next, { shouldValidate: false })
									}
								/>
							</SectionCard>

							<SectionCard
								title="Opções"
								description="Defina variações como IDIOMA ou VARIANTE para gerar as variantes."
							>
								<VariantOptionsEditor
									options={options}
									onChange={handleOptionsChange}
								/>
							</SectionCard>

							<SectionCard title="Variantes">
								{matrixWarning && (
									<Alert variant="error" className="mb-4">
										<AlertDescription>{matrixWarning}</AlertDescription>
									</Alert>
								)}
								<VariantMatrix
									options={options}
									variants={variants}
									onChange={handleVariantsChange}
									onRemove={handleRemoveVariant}
									onApplyToAll={handleApplyToAll}
								/>
								{form.formState.errors.variants?.root && (
									<p className="mt-3 font-['Poppins',sans-serif] text-[12px] text-red-700">
										{form.formState.errors.variants.root.message}
									</p>
								)}
							</SectionCard>

							<div className="flex items-center justify-between">
								<Button
									type="button"
									variant="ghost"
									onClick={() => {
										window.location.href = "/admin/products";
									}}
								>
									Cancelar
								</Button>
								<Button type="submit" variant="primary" disabled={isSubmitting}>
									{isSubmitting
										? "Salvando…"
										: isEditing
											? "Salvar alterações"
											: "Criar produto"}
								</Button>
							</div>
						</form>
					</Form>
				)}
			</main>
		</AppShell>
	);
}
