import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormBody,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { AdminField } from "./admin-field";
import { categorySchema, type CategoryFormValues } from "./schemas";
import { DialogFooter } from "../ui/dialog";

interface CategoryFormProps {
	defaultValues: CategoryFormValues;
	currentImage?: string;
	submitLabel: string;
	error?: string | null;
	onSubmit: (values: CategoryFormValues, image?: File) => void;
	onCancel: () => void;
}

export function CategoryForm({
	defaultValues,
	currentImage,
	submitLabel,
	error,
	onSubmit,
	onCancel,
}: CategoryFormProps) {
	const [image, setImage] = useState<File | undefined>(undefined);
	const [preview, setPreview] = useState<string | undefined>(currentImage);

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues,
	});

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setImage(file);
		setPreview(URL.createObjectURL(file));
	}

	function handleSubmit(values: CategoryFormValues) {
		onSubmit(values, image);
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

					<AdminField<CategoryFormValues>
						name="title"
						label="Nome"
						placeholder="Acessórios"
					/>

					<div className="space-y-2">
						<FormLabel>
							Imagem
							<span className="ml-1 font-normal text-slate-400">
								(opcional)
							</span>
						</FormLabel>
						{preview && (
							<img
								src={preview}
								alt="Pré-visualização"
								className="mb-2 h-24 w-24 rounded-xl object-cover"
							/>
						)}
						<input
							type="file"
							accept="image/*"
							className="block w-full font-['Poppins',sans-serif] text-[14px] text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-blue-700 hover:file:bg-blue-100"
							onChange={handleFileChange}
						/>
					</div>

					<FormField<CategoryFormValues>
						name="featured"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel>
									Destaque
									<span className="ml-1 font-normal text-slate-400">
										(opcional)
									</span>
								</FormLabel>
								<FormControl>
									<Checkbox
										label="Exibir em destaque"
										checked={(field.value as boolean) ?? false}
										onChange={(e) => field.onChange(e.target.checked)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
