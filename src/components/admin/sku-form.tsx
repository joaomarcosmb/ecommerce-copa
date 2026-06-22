import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormBody, FormLabel } from "@/components/ui/form";

import { AdminField } from "./admin-field";
import { skuSchema, type SkuFormValues } from "./schemas";
import { DialogFooter } from "../ui/dialog";

interface SkuFormProps {
	defaultValues: SkuFormValues;
	submitLabel: string;
	isSubmitting?: boolean;
	error?: string | null;
	/** When provided, the attributes section renders value-only fields labeled by schema. */
	schemaAttributes?: { key: string; label: string }[];
	onSubmit: (values: SkuFormValues, photo?: File) => void;
	onCancel: () => void;
}

export function SkuForm({
	defaultValues,
	submitLabel,
	isSubmitting,
	error,
	schemaAttributes,
	onSubmit,
	onCancel,
}: SkuFormProps) {
	const [photo, setPhoto] = useState<File | undefined>(undefined);

	const form = useForm<SkuFormValues>({
		resolver: zodResolver(skuSchema),
		defaultValues,
	});

	const attributes = useFieldArray({
		control: form.control,
		name: "attributes",
	});

	function handleSubmit(values: SkuFormValues) {
		onSubmit(values, photo);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex min-h-0 flex-1 flex-col"
			>
				<FormBody className="space-y-5 overflow-y-auto px-7 py-6 sm:px-9 sm:py-7">
					{error && (
						<Alert variant="error">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<AdminField<SkuFormValues>
						name="title"
						label="Título"
						placeholder="Álbum Copa do Mundo 2026"
					/>

					<AdminField<SkuFormValues>
						name="description"
						label="Descrição"
						placeholder="Descrição da variante…"
					/>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<AdminField<SkuFormValues>
							name="price"
							label="Preço (R$)"
							type="number"
							step="0.01"
							placeholder="49.90"
						/>
						<AdminField<SkuFormValues>
							name="originalPrice"
							label="Preço original (R$)"
							type="number"
							step="0.01"
							placeholder="59.90"
							optional
						/>
					</div>

					<AdminField<SkuFormValues>
						name="stock"
						label="Estoque"
						type="number"
						step="1"
						placeholder="0"
					/>

					{/* Foto */}
					<div className="space-y-2">
						<FormLabel>
							Foto
							<span className="ml-1 font-normal text-slate-400">
								(opcional)
							</span>
						</FormLabel>
						<input
							type="file"
							accept="image/*"
							className="block w-full font-['Poppins',sans-serif] text-[14px] text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-blue-700 hover:file:bg-blue-100"
							onChange={(e) => setPhoto(e.target.files?.[0])}
						/>
					</div>

					{/* Atributos — schema-driven (value only) */}
					{schemaAttributes && schemaAttributes.length > 0 ? (
						<div className="space-y-3">
							<FormLabel className="cursor-default text-[11px] font-semibold uppercase text-slate-400">
								Atributos
							</FormLabel>
							{schemaAttributes.map((sa, index) => (
								<AdminField<SkuFormValues>
									key={sa.key}
									name={`attributes.${index}.value`}
									label={sa.label}
									placeholder={`Informe ${sa.label.toLowerCase()}`}
								/>
							))}
						</div>
					) : (
						/* Atributos — livre (chave + valor) */
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<FormLabel className="cursor-default">
									Atributos
									<span className="ml-1 font-normal text-slate-400">
										(opcional)
									</span>
								</FormLabel>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => attributes.append({ key: "", value: "" })}
								>
									<Plus aria-hidden="true" className="size-4" />
									Adicionar atributo
								</Button>
							</div>
							{attributes.fields.length === 0 ? (
								<p className="font-['Poppins',sans-serif] text-[13px] text-slate-400">
									Sem atributos definidos.
								</p>
							) : (
								<div className="space-y-3">
									{attributes.fields.map((item, index) => (
										<div key={item.id} className="flex items-start gap-2">
											<div className="flex-1">
												<AdminField<SkuFormValues>
													name={`attributes.${index}.key`}
													label="Chave"
													placeholder="color"
												/>
											</div>
											<div className="flex-1">
												<AdminField<SkuFormValues>
													name={`attributes.${index}.value`}
													label="Valor"
													placeholder="Azul"
												/>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												className="mt-8 shrink-0 text-red-700 hover:bg-red-50"
												aria-label={`Remover atributo ${index + 1}`}
												onClick={() => attributes.remove(index)}
											>
												<Trash2 aria-hidden="true" className="size-4.5" />
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					)}
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
