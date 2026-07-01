import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { maskCep } from "@/lib/masks";
import { fetchAddressByCep } from "@/lib/via-cep";

const addressSchema = z.object({
	name: z.string().min(1, "Informe o nome."),
	street: z.string().min(1, "Informe o logradouro."),
	number: z.string().min(1, "Informe o número."),
	neighborhood: z.string().min(1, "Informe o bairro."),
	city: z.string().min(1, "Informe a cidade."),
	state: z.string().min(1, "Informe o estado."),
	postalCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido (ex: 01234-010)"),
	complement: z.string().optional(),
	isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
	defaultValues: AddressFormValues;
	submitLabel: string;
	isSubmitting: boolean;
	error?: string | null;
	onSubmit: (values: AddressFormValues) => void;
	onCancel: () => void;
}

export function AddressForm({
	defaultValues,
	submitLabel,
	isSubmitting,
	error,
	onSubmit,
	onCancel,
}: AddressFormProps) {
	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues,
	});
	const [isFetchingCep, setIsFetchingCep] = useState(false);

	async function handleCepChange(masked: string) {
		if (masked.length !== 9) return;
		setIsFetchingCep(true);
		const result = await fetchAddressByCep(masked);
		setIsFetchingCep(false);
		if (!result) return;
		form.setValue("street", result.street, { shouldValidate: true });
		form.setValue("neighborhood", result.neighborhood, {
			shouldValidate: true,
		});
		form.setValue("city", result.city, { shouldValidate: true });
		form.setValue("state", result.state, { shouldValidate: true });
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{error && (
					<Alert variant="error">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome do endereço</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Casa, Trabalho" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="street"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Logradouro</FormLabel>
							<FormControl>
								<Input placeholder="Rua, Avenida, etc." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="number"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número</FormLabel>
								<FormControl>
									<Input placeholder="123" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="complement"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Complemento</FormLabel>
								<FormControl>
									<Input placeholder="Apto, Bloco (opcional)" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="neighborhood"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bairro</FormLabel>
							<FormControl>
								<Input placeholder="Bairro" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cidade</FormLabel>
								<FormControl>
									<Input placeholder="Cidade" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estado</FormLabel>
								<FormControl>
									<Input placeholder="SP" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="postalCode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CEP</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										{...field}
										placeholder="00000-000"
										inputMode="numeric"
										className={isFetchingCep ? "pr-10" : undefined}
										onChange={(e) => {
											const masked = maskCep(e.target.value);
											field.onChange(masked);
											handleCepChange(masked);
										}}
									/>
									{isFetchingCep && (
										<Loader2
											className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-slate-400"
											aria-label="Buscando CEP…"
										/>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="isDefault"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Checkbox
									label="Definir como endereço padrão"
									checked={field.value ?? false}
									onChange={(e) => field.onChange(e.target.checked)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="mt-5! h-px w-full bg-slate-200" />

				<div className="flex justify-between pt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Salvando…" : submitLabel}
					</Button>
				</div>
			</form>
		</Form>
	);
}
