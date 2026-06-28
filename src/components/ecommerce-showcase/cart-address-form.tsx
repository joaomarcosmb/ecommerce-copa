import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus } from "lucide-react";
import { useForm, useFormContext } from "react-hook-form";
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
import { apiGet, apiPost } from "@/lib/api";
import { maskCep } from "@/lib/masks";
import { fetchAddressByCep } from "@/lib/via-cep";
import type {
	AddressListResponse,
	AddressResponse,
	CreateAddressRequest,
} from "@/api/generated/model";
import { cn } from "@/lib/utils";
import { H2, P } from "../typography";

const addressSchema = z.object({
	name: z.string().min(1, "Dê um nome ao endereço (ex: Casa, Trabalho)"),
	postalCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido (ex: 01234-010)"),
	street: z.string().min(3, "Informe o endereço"),
	number: z.string().min(1, "Informe o número"),
	complement: z.string().optional(),
	neighborhood: z.string().min(2, "Informe o bairro"),
	city: z.string().min(2, "Informe a cidade"),
	state: z.string().min(2, "Informe o estado"),
});

type AddressValues = z.infer<typeof addressSchema>;

const inputClass = cn(
	"w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm",
	"text-[14px] leading-5 font-sans text-slate-900 placeholder:text-slate-400",
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

function CepField() {
	const { setValue, trigger } = useFormContext<AddressValues>();
	const [isFetching, setIsFetching] = useState(false);

	async function handleCepChange(masked: string) {
		if (masked.length !== 9) return;
		setIsFetching(true);
		const result = await fetchAddressByCep(masked);
		setIsFetching(false);
		if (!result) return;
		setValue("street", result.street, { shouldValidate: true });
		setValue("neighborhood", result.neighborhood, { shouldValidate: true });
		setValue("city", result.city, { shouldValidate: true });
		setValue("state", result.state, { shouldValidate: true });
		trigger(["street", "neighborhood", "city", "state"]);
	}

	return (
		<FormField<AddressValues>
			name="postalCode"
			render={({ field, fieldState }) => (
				<FormItem className="space-y-2">
					<FormLabel>CEP</FormLabel>
					<FormControl>
						<div className="relative">
							<input
								{...field}
								value={field.value ?? ""}
								placeholder="00000-000"
								autoComplete="postal-code"
								inputMode="numeric"
								onChange={(e) => {
									const masked = maskCep(e.target.value);
									field.onChange(masked);
									handleCepChange(masked);
								}}
								className={cn(
									inputClass,
									isFetching && "pr-10",
									fieldState.error &&
										"border-red-600 focus-visible:border-red-600 focus-visible:ring-red-200",
								)}
							/>
							{isFetching && (
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
	);
}

function formatAddressLine(a: AddressResponse): string {
	const parts = [a.street, a.number, a.complement].filter(Boolean).join(", ");
	return `${parts} — ${a.neighborhood}, ${a.city}/${a.state} · CEP ${a.postalCode}`;
}

interface AddressCardProps {
	address: AddressResponse;
	selected: boolean;
	onSelect: () => void;
}

function AddressCard({ address, selected, onSelect }: AddressCardProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"flex w-full items-start gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-colors",
				selected
					? "border-blue-700 bg-blue-50"
					: "border-slate-200 hover:border-slate-300 bg-white",
			)}
		>
			<MapPin
				className={cn(
					"mt-0.5 size-5 shrink-0",
					selected ? "text-blue-700" : "text-slate-400",
				)}
				aria-hidden="true"
			/>
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-sm text-slate-900">
					{address.name}
					{address.isDefault && (
						<span className="ml-2 text-xs font-normal text-blue-600">
							(padrão)
						</span>
					)}
				</p>
				<p className="mt-0.5 text-sm text-slate-500 truncate">
					{formatAddressLine(address)}
				</p>
			</div>
		</button>
	);
}

// New address form

interface NewAddressFormProps {
	onSaved: (address: AddressResponse) => void;
	onCancel?: () => void;
}

function NewAddressForm({ onSaved, onCancel }: NewAddressFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<AddressValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			name: "",
			postalCode: "",
			street: "",
			number: "",
			complement: "",
			neighborhood: "",
			city: "",
			state: "",
		},
	});

	async function onSubmit(values: AddressValues) {
		setIsLoading(true);
		setError(null);
		try {
			const body: CreateAddressRequest = {
				name: values.name,
				postalCode: values.postalCode,
				street: values.street,
				number: values.number,
				complement: values.complement,
				neighborhood: values.neighborhood,
				city: values.city,
				state: values.state,
			};
			const saved = await apiPost<AddressResponse>("/addresses", body);
			onSaved(saved);
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

					<AddressField
						name="name"
						label="Apelido do endereço"
						placeholder="Ex: Casa, Trabalho..."
					/>

					<div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-0 md:divide-x md:divide-slate-100">
						<div className="space-y-5 md:pr-8">
							<CepField />
							<AddressField
								name="street"
								label="Endereço"
								placeholder="Rua, Avenida..."
								autoComplete="street-address"
							/>
							<div className="grid grid-cols-[1fr_auto] gap-4">
								<AddressField
									name="number"
									label="Número"
									placeholder="000"
									autoComplete="off"
								/>
								<AddressField
									name="complement"
									label="Complemento"
									placeholder="Apto, Bloco..."
									autoComplete="off"
								/>
							</div>
						</div>

						<div className="space-y-5 md:pl-8">
							<AddressField
								name="neighborhood"
								label="Bairro"
								placeholder="Seu bairro"
								autoComplete="address-level3"
							/>
							<AddressField
								name="city"
								label="Cidade"
								placeholder="Sua cidade"
								autoComplete="address-level2"
							/>
							<AddressField
								name="state"
								label="Estado"
								placeholder="Seu estado"
								autoComplete="address-level1"
							/>
						</div>
					</div>

					<FormActions>
						<div className="flex gap-3 max-w-md mx-auto w-full">
							{onCancel && (
								<Button
									type="button"
									variant="outline"
									size="lg"
									className="flex-1"
									onClick={onCancel}
									disabled={isLoading}
								>
									Cancelar
								</Button>
							)}
							<Button
								type="submit"
								size="lg"
								className="flex-1 cursor-pointer"
								disabled={isLoading}
							>
								{isLoading ? "Salvando..." : "Salvar endereço"}
							</Button>
						</div>
					</FormActions>
				</FormBody>
			</form>
		</Form>
	);
}

// Main component

interface CartAddressFormProps {
	onSuccess: () => void;
}

export function CartAddressForm({ onSuccess }: CartAddressFormProps) {
	const [addresses, setAddresses] = useState<AddressResponse[] | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [showNewForm, setShowNewForm] = useState(false);

	useEffect(() => {
		apiGet<AddressListResponse>("/addresses")
			.then((res) => {
				const items = res.items ?? [];
				setAddresses(items);
				if (items.length === 0) {
					setShowNewForm(true);
				} else {
					const def = items.find((a) => a.isDefault) ?? items[0];
					setSelectedId(def.id ?? null);
				}
			})
			.catch(() => {
				setAddresses([]);
				setShowNewForm(true);
			});
	}, []);

	function handleAddressSaved(address: AddressResponse) {
		setAddresses((prev) => [...(prev ?? []), address]);
		setSelectedId(address.id ?? null);
		setShowNewForm(false);
	}

	// Loading
	if (addresses === null) {
		return (
			<div className="flex flex-col gap-3 py-4">
				{Array.from({ length: 2 }).map((_, i) => (
					<div
						key={i}
						className="h-20 animate-pulse rounded-2xl bg-slate-100"
					/>
				))}
			</div>
		);
	}

	// No addresses yet or user clicked "Novo endereço"
	if (showNewForm) {
		return (
			<>
				{addresses.length > 0 && (
					<div className="mb-6">
						<H2 className="text-xl font-semibold text-slate-800 text-center mb-1">
							Novo endereço
						</H2>
						<P className="text-center text-slate-600 text-sm">
							Preencha os dados abaixo ou{" "}
							<button
								type="button"
								className="text-blue-700 underline hover:no-underline text-sm"
								onClick={() => setShowNewForm(false)}
							>
								use um endereço salvo
							</button>
							.
						</P>
					</div>
				)}
				<NewAddressForm
					onSaved={handleAddressSaved}
					onCancel={
						addresses.length > 0 ? () => setShowNewForm(false) : undefined
					}
				/>
			</>
		);
	}

	// If has addresses, show selector
	return (
		<div className="py-4">
			<H2 className="text-xl font-semibold text-slate-800 text-center mb-1">
				Selecione o endereço de entrega
			</H2>
			<P className="text-center text-slate-600 text-sm mb-6">
				Escolha um dos seus endereços cadastrados.
			</P>

			<div className="flex flex-col gap-3 max-w-xl mx-auto">
				{addresses.map((address) => (
					<AddressCard
						key={address.id}
						address={address}
						selected={address.id === selectedId}
						onSelect={() => setSelectedId(address.id ?? null)}
					/>
				))}

				<button
					type="button"
					onClick={() => setShowNewForm(true)}
					className="flex items-center gap-2 text-sm text-blue-700 hover:underline mt-1"
				>
					<Plus className="size-4" aria-hidden="true" />
					Adicionar novo endereço
				</button>
			</div>

			<div className="mt-8 flex justify-center">
				<Button
					size="lg"
					className="w-full max-w-md cursor-pointer"
					disabled={!selectedId}
					onClick={onSuccess}
				>
					Finalizar compra
				</Button>
			</div>
		</div>
	);
}
