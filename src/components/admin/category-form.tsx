import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormActions,
	FormBody,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { categorySchema, type CategoryFormValues } from "./schemas";
import { slugify } from "./slugify";
import { DialogFooter } from "../ui/dialog";

const inputClass = cn(
	"w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm",
	"text-[14px] leading-5 font-['Poppins',sans-serif] text-slate-900 placeholder:text-slate-400",
	"focus-visible:border-blue-600 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1",
	"transition-[background-color,border-color,box-shadow] duration-200",
);

interface CategoryFormProps {
	defaultValues: CategoryFormValues;
	submitLabel: string;
	error?: string | null;
	onSubmit: (values: CategoryFormValues) => void;
	onCancel: () => void;
}

export function CategoryForm({
	defaultValues,
	submitLabel,
	error,
	onSubmit,
	onCancel,
}: CategoryFormProps) {
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues,
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
					<FormField<CategoryFormValues>
						name="label"
						render={({ field, fieldState }) => (
							<FormItem className="space-y-2">
								<FormLabel>Nome</FormLabel>
								<FormControl>
									<input
										{...field}
										value={field.value ?? ""}
										placeholder="Acessórios"
										onChange={(e) => {
											field.onChange(e);
											form.setValue("slug", slugify(e.target.value), {
												shouldValidate: form.formState.isSubmitted,
											});
										}}
										className={cn(
											inputClass,
											fieldState.error &&
												"border-red-600 focus-visible:border-red-600 focus-visible:ring-red-200",
										)}
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
