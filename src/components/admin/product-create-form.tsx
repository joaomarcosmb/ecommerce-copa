import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AdminField } from "@/components/admin/admin-field";
import { VariantOptionsEditor } from "@/components/admin/variant-options-editor";
import { VariantCard } from "@/components/admin/variant-card";
import {
	buildVariantMatrix,
	suggestTitle,
	MAX_VARIANTS,
	type ProductOption,
	type VariantDraft,
} from "@/components/admin/variant-matrix-utils";
import {
	emptyProductForm,
	productSchema,
	type ProductFormValues,
} from "@/components/admin/schemas";
import { createProduct } from "@/lib/admin-products";
import { ApiError } from "@/lib/api";
import type { CategoryResponse } from "@/api/generated/model";
import { AppShell } from "@/components/ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "@/components/ecommerce-showcase/breadcrumb-nav";

interface ProductCreateFormProps {
	categories: CategoryResponse[];
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
				<p className="mt-1 font-sans text-[14px] text-slate-500">
					{description}
				</p>
			)}
			<div className="mt-5">{children}</div>
		</Card>
	);
}

const breadcrumbItems = [
	{ label: "Início", href: "/" },
	{ label: "Administração", href: "/admin" },
	{ label: "Produtos", href: "/admin/products" },
	{ label: "Novo produto" },
];

export function ProductCreateForm({ categories }: ProductCreateFormProps) {
	const [formError, setFormError] = useState<string | null>(null);
	const [matrixWarning, setMatrixWarning] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: emptyProductForm,
	});

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
				title:
					v.title ||
					suggestTitle(form.getValues("name"), options, v.attributeValues),
			}),
		);
		form.setValue("variants", next, { shouldValidate: false });
	}

	// Preenche o título das variantes que ainda não foram nomeadas manualmente
	// conforme o nome do produto é digitado.
	useEffect(() => {
		const subscription = form.watch((value, { name: changedField }) => {
			if (changedField !== "name") return;
			const productName = value.name ?? "";
			const currentOptions = (value.options ?? []) as ProductOption[];
			const currentVariants = (value.variants ?? []) as VariantDraft[];
			const next = currentVariants.map((v) =>
				v.title
					? v
					: {
							...v,
							title: suggestTitle(
								productName,
								currentOptions,
								v.attributeValues,
							),
						},
			);
			form.setValue("variants", next, { shouldValidate: false });
		});
		return () => subscription.unsubscribe();
	}, [form]);

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

	function onInvalid() {
		setFormError("Corrija os campos destacados antes de continuar.");
	}

	async function onSubmit(values: ProductFormValues) {
		setFormError(null);
		setIsSubmitting(true);
		try {
			await createProduct(values);
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

	const breadcrumb = useMemo(() => breadcrumbItems, []);

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
				<BreadcrumbNav items={breadcrumb} />

				<h1 className="mt-6 font-big-shoulders text-4xl font-bold text-slate-900">
					Novo produto
				</h1>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, onInvalid)}
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
							<VariantCard
								options={options}
								variants={variants}
								errors={form.formState.errors.variants}
								onChange={handleVariantsChange}
								onRemove={handleRemoveVariant}
								onApplyToAll={handleApplyToAll}
							/>
							{form.formState.errors.variants?.root && (
								<p className="mt-3 font-sans text-[12px] text-red-700">
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
								{isSubmitting ? "Salvando…" : "Criar produto"}
							</Button>
						</div>
					</form>
				</Form>
			</main>
		</AppShell>
	);
}
