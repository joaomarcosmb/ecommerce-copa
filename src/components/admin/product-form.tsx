import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormActions,
	FormBody,
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
import { PRODUCT_CATEGORY_LABELS } from "@/components/ecommerce-showcase/data";

import { AdminField } from "./admin-field";
import {
	PRODUCT_CATEGORY_VALUES,
	productSchema,
	type ProductFormValues,
} from "./schemas";
import { DialogFooter } from "../ui/dialog";

interface ProductFormProps {
	defaultValues: ProductFormValues;
	submitLabel: string;
	onSubmit: (values: ProductFormValues) => void;
	onCancel: () => void;
}

export function ProductForm({
	defaultValues,
	submitLabel,
	onSubmit,
	onCancel,
}: ProductFormProps) {
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues,
	});

	const images = useFieldArray({ control: form.control, name: "images" });
	const variants = useFieldArray({ control: form.control, name: "variants" });

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex min-h-0 flex-1 flex-col"
			>
				<FormBody className="space-y-5 overflow-y-auto px-7 py-6 sm:px-9 sm:py-7">
					<AdminField<ProductFormValues>
						name="title"
						label="Título"
						placeholder="Álbum Oficial FIFA Copa do Mundo 2026™"
					/>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<AdminField<ProductFormValues>
							name="price"
							label="Preço (R$)"
							type="number"
							step="0.01"
							placeholder="49.90"
						/>
						<AdminField<ProductFormValues>
							name="originalPrice"
							label="Preço original (R$)"
							type="number"
							step="0.01"
							placeholder="59.90"
							optional
						/>
					</div>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<FormField<ProductFormValues>
							name="category"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Categoria</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
										<SelectContent>
											{PRODUCT_CATEGORY_VALUES.map((value) => (
												<SelectItem key={value} value={value}>
													{PRODUCT_CATEGORY_LABELS[value]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<AdminField<ProductFormValues>
							name="badge"
							label="Selo"
							placeholder="Novo, Promo, Hot…"
							optional
						/>
					</div>

					<AdminField<ProductFormValues>
						name="image"
						label="Imagem principal (URL)"
						placeholder="https://…"
					/>

					{/* Imagens adicionais */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<FormLabel className="cursor-default">
								Imagens adicionais
								<span className="ml-1 font-normal text-slate-400">
									(opcional)
								</span>
							</FormLabel>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => images.append({ url: "" })}
							>
								<Plus aria-hidden="true" className="size-4" />
								Adicionar
							</Button>
						</div>
						{images.fields.length === 0 ? (
							<p className="font-['Poppins',sans-serif] text-[13px] text-slate-400">
								Nenhuma imagem adicional.
							</p>
						) : (
							<div className="space-y-3">
								{images.fields.map((item, index) => (
									<div key={item.id} className="flex items-start gap-2">
										<div className="flex-1">
											<AdminField<ProductFormValues>
												name={`images.${index}.url`}
												label={`Imagem ${index + 1}`}
												placeholder="https://…"
											/>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											className="mt-8 shrink-0 text-red-700 hover:bg-red-50"
											aria-label={`Remover imagem ${index + 1}`}
											onClick={() => images.remove(index)}
										>
											<Trash2 aria-hidden="true" className="size-4.5" />
										</Button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Variantes */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<FormLabel className="cursor-default">
								Variantes
								<span className="ml-1 font-normal text-slate-400">
									(opcional)
								</span>
							</FormLabel>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => variants.append({ label: "", productId: "" })}
							>
								<Plus aria-hidden="true" className="size-4" />
								Adicionar
							</Button>
						</div>
						{variants.fields.length === 0 ? (
							<p className="font-['Poppins',sans-serif] text-[13px] text-slate-400">
								Nenhuma variante.
							</p>
						) : (
							<div className="space-y-3">
								{variants.fields.map((item, index) => (
									<div key={item.id} className="flex items-start gap-2">
										<div className="flex-1">
											<AdminField<ProductFormValues>
												name={`variants.${index}.label`}
												label="Rótulo"
												placeholder="Holográfica"
											/>
										</div>
										<div className="w-32">
											<AdminField<ProductFormValues>
												name={`variants.${index}.productId`}
												label="ID do produto"
												type="number"
												placeholder="102"
											/>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											className="mt-8 shrink-0 text-red-700 hover:bg-red-50"
											aria-label={`Remover variante ${index + 1}`}
											onClick={() => variants.remove(index)}
										>
											<Trash2 aria-hidden="true" className="size-4.5" />
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</FormBody>

				<DialogFooter className="flex justify-between! pb-9! px-10!">
					<Button type="button" variant="ghost" onClick={onCancel}>
						Cancelar
					</Button>
					<Button type="submit" variant="primary">
						{submitLabel}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
