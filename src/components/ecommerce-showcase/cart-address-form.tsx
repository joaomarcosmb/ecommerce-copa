import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { H2, P } from "../typography";

const addressSchema = z.object({
	cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido (ex: 01234-010)"),
	endereco: z.string().min(3, "Informe o endereço"),
	numero: z.string().min(1, "Informe o número"),
	complemento: z.string().optional(),
	bairro: z.string().min(2, "Informe o bairro"),
	cidade: z.string().min(2, "Informe a cidade"),
	estado: z.string().min(2, "Informe o estado"),
});

type AddressValues = z.infer<typeof addressSchema>;

const inputClass = cn(
	"w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm",
	"text-[14px] leading-5 font-['Poppins',sans-serif] text-slate-900 placeholder:text-slate-400",
	"focus-visible:border-blue-600 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1",
	"transition-[background-color,border-color,box-shadow] duration-200",
	"disabled:cursor-not-allowed disabled:opacity-50",
);

function AddressField({
	name,
	label,
	placeholder,
	autoComplete,
	className,
}: {
	name: keyof AddressValues;
	label: string;
	placeholder?: string;
	autoComplete?: string;
	className?: string;
}) {
	return (
		<FormField<AddressValues>
			name={name}
			render={({ field, fieldState }) => (
				<FormItem className={cn("space-y-2", className)}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<input
							{...field}
							value={field.value ?? ""}
							placeholder={placeholder}
							autoComplete={autoComplete}
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
	);
}

interface CartAddressFormProps {
	onSuccess: () => void;
}

export function CartAddressForm({ onSuccess }: CartAddressFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<AddressValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			cep: "",
			endereco: "",
			numero: "",
			complemento: "",
			bairro: "",
			cidade: "",
			estado: "",
		},
	});

	async function onSubmit(_values: AddressValues) {
		setIsLoading(true);
		setError(null);
		try {
			onSuccess();
		} catch {
			setError("Não foi possível salvar o endereço. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<FormBody>
					{error && (
						<Alert variant="error">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<H2 className="text-xl font-semibold text-slate-800 text-center mb-3">
						Informações de entrega
					</H2>
					<P className="text-center text-slate-600">
						Preencha o formulário abaixo com as informações do local em que a
						entrega deverá ser realizada.
					</P>
					<div className="grid grid-cols-2 divide-x divide-slate-100 max-w-4xl mx-auto">
						<div className="space-y-5 pr-8">
							<AddressField
								name="cep"
								label="CEP"
								placeholder="00000-000"
								autoComplete="postal-code"
							/>
							<AddressField
								name="endereco"
								label="Endereço"
								placeholder="Rua, Avenida..."
								autoComplete="street-address"
							/>
							<div className="grid grid-cols-[1fr_auto] gap-4">
								<AddressField
									name="numero"
									label="Número"
									placeholder="000"
									autoComplete="off"
								/>
								<AddressField
									name="complemento"
									label="Complemento"
									placeholder="Apto, Bloco..."
									autoComplete="off"
								/>
							</div>
						</div>

						<div className="space-y-5 pl-8">
							<AddressField
								name="bairro"
								label="Bairro"
								placeholder="Seu bairro"
								autoComplete="address-level3"
							/>
							<AddressField
								name="cidade"
								label="Cidade"
								placeholder="Sua cidade"
								autoComplete="address-level2"
							/>
							<AddressField
								name="estado"
								label="Estado"
								placeholder="Seu estado"
								autoComplete="address-level1"
							/>
						</div>
					</div>

					<FormActions>
						<Button
							type="submit"
							size="lg"
							className="w-full max-w-md mx-auto cursor-pointer"
							disabled={isLoading}
						>
							{isLoading ? "Salvando..." : "Finalizar compra"}
						</Button>
					</FormActions>
				</FormBody>
			</form>
		</Form>
	);
}
