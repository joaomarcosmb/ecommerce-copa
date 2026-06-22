import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Form,
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
import type { CategoryResponse } from "@/api/generated/model";

import { AdminField } from "./admin-field";
import { productSchema, type ProductFormValues } from "./schemas";
import { DialogFooter } from "../ui/dialog";

interface ProductFormProps {
	defaultValues: ProductFormValues;
	submitLabel: string;
	categories: CategoryResponse[];
	isSubmitting?: boolean;
	error?: string | null;
	onSubmit: (values: ProductFormValues) => void;
	onCancel: () => void;
}

export function ProductForm({
	defaultValues,
	submitLabel,
	categories,
	isSubmitting,
	error,
	onSubmit,
	onCancel,
}: ProductFormProps) {
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues,
	});

	const selectors = useFieldArray({
		control: form.control,
		name: "schemaSelectors",
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex min-h-0 flex-1 flex-col"
			>
				<FormBody className="space-y-5 overflow-y-auto px-7 py-6 sm:px-9 sm:py-7">
					{error && (
						<Alert variant="error">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

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
											<SelectItem key={c.id} value={c.id!}>
												{c.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Seletores de variação */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<FormLabel className="cursor-default">
								Seletores de variação
								<span className="ml-1 font-normal text-slate-400">
									(opcional)
								</span>
							</FormLabel>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => selectors.append({ key: "", label: "" })}
							>
								<Plus aria-hidden="true" className="size-4" />
								Adicionar seletor
							</Button>
						</div>
						{selectors.fields.length === 0 ? (
							<p className="font-['Poppins',sans-serif] text-[13px] text-slate-400">
								Sem seletores definidos.
							</p>
						) : (
							<div className="space-y-3">
								{selectors.fields.map((item, index) => (
									<div key={item.id} className="flex items-start gap-2">
										<div className="flex-1">
											<AdminField<ProductFormValues>
												name={`schemaSelectors.${index}.key`}
												label="Chave"
												placeholder="size"
											/>
										</div>
										<div className="flex-1">
											<AdminField<ProductFormValues>
												name={`schemaSelectors.${index}.label`}
												label="Rótulo"
												placeholder="Tamanho"
											/>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											className="mt-8 shrink-0 text-red-700 hover:bg-red-50"
											aria-label={`Remover seletor ${index + 1}`}
											onClick={() => selectors.remove(index)}
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
					<Button type="submit" variant="primary" disabled={isSubmitting}>
						{submitLabel}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
