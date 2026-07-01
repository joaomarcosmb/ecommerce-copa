import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, LogOut, Pencil, MapPinPlus, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { H2, LabelLarge, P } from "@/components/typography";
import { useClientProfile } from "@/hooks/use-client-profile";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuth } from "@/hooks/use-auth";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { formatCpf, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AddressListResponse } from "@/api/generated/model/addressListResponse";
import type { AddressResponse } from "@/api/generated/model/addressResponse";
import type { ClientMeResponse } from "@/api/generated/model/clientMeResponse";

import { AddressForm, type AddressFormValues } from "./account/address-form";
import { AppShell } from "./ecommerce-showcase/app-shell";

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Informe a senha atual."),
		newPassword: z.string().min(6, "Mínimo 6 caracteres."),
		confirmPassword: z.string().min(1, "Confirme a nova senha."),
	})
	.refine((d) => d.newPassword === d.confirmPassword, {
		path: ["confirmPassword"],
		message: "As senhas não coincidem.",
	});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

const editProfileSchema = z.object({
	name: z.string().trim().min(2, "Mínimo 2 caracteres."),
	email: z.email("E-mail inválido."),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="font-big-shoulders text-2xl font-bold text-slate-900">
			{children}
		</h2>
	);
}

function DataRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid grid-cols-[160px_1fr] items-baseline gap-2">
			<LabelLarge className="text-lefttext-slate-900">{label}</LabelLarge>
			<P className="text-slate-600">{value}</P>
		</div>
	);
}

function DataRowSkeleton() {
	return (
		<div className="grid grid-cols-[160px_1fr] items-baseline gap-2">
			<div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
			<div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
		</div>
	);
}

interface AddressFieldProps {
	address: AddressResponse;
	onEdit: (address: AddressResponse) => void;
	onDelete: (address: AddressResponse) => void;
}

function AddressField({ address, onEdit, onDelete }: AddressFieldProps) {
	const {
		name,
		street,
		number,
		neighborhood,
		city,
		state,
		postalCode,
		isDefault,
	} = address;

	const formatted = [
		street,
		number,
		neighborhood,
		city,
		state,
		postalCode,
	].filter(Boolean).length
		? `${street}, ${number} - ${neighborhood}, ${city} - ${state}. ${postalCode}`
		: "—";

	return (
		<div className="w-full grid grid-cols-[80px_minmax(0,1fr)_130px] grid-flow-col items-center gap-4">
			<LabelLarge className="text-slate-900 text-md">{name}</LabelLarge>
			<P className="text-slate-600 text-wrap">{formatted}</P>
			<div className="flex items-center gap-1.5 ml-auto">
				{isDefault && <P className="text-slate-600 text-sm">Padrão</P>}
				<Button
					variant="ghost"
					size="icon-sm"
					className="cursor-pointer"
					aria-label={`Editar endereço ${name}`}
					onClick={() => onEdit(address)}
				>
					<Pencil aria-hidden="true" className="size-4.5" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					className="cursor-pointer"
					aria-label={`Remover endereço ${name}`}
					onClick={() => onDelete(address)}
				>
					<Trash2
						aria-hidden="true"
						className="size-4.5 text-red-700 hover:bg-red-50"
					/>
				</Button>
			</div>
		</div>
	);
}

interface EditProfileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialName: string;
	initialEmail: string;
	onSuccess: (updated: ClientMeResponse) => void;
}

function EditProfileDialog({
	open,
	onOpenChange,
	initialName,
	initialEmail,
	onSuccess,
}: EditProfileDialogProps) {
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<EditProfileValues>({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			name: initialName,
			email: initialEmail,
		},
	});

	// Reset form when dialog opens with fresh defaults
	useEffect(() => {
		if (open) {
			form.reset({ name: initialName, email: initialEmail });
			setSubmitError(null);
		}
	}, [open, initialName, initialEmail]);

	async function handleSubmit(values: EditProfileValues) {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			const updated = await apiPatch<ClientMeResponse>("/clients/me", {
				name: values.name,
				email: values.email,
			});
			onSuccess(updated);
			onOpenChange(false);
		} catch (err) {
			setSubmitError(
				err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!isSubmitting) onOpenChange(o);
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="gap-0 overflow-hidden rounded-[28px] border-none p-0 shadow-2xl sm:max-w-md"
			>
				<DialogHeader className="space-y-0 px-7 pb-5 pt-7">
					<div className="grid grid-cols-[auto_1fr] items-center gap-4">
						<span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-white bg-blue-700 shadow-md">
							<Pencil aria-hidden="true" className="size-5" />
						</span>
						<DialogTitle>
							<H2>Editar dados pessoais</H2>
							<P className="text-slate-500">
								Atualize suas informações pessoais
							</P>
						</DialogTitle>
					</div>
				</DialogHeader>
				<div className="w-full h-px bg-slate-200" />

				<div className="px-7 py-5">
					{submitError && (
						<Alert variant="error" className="mb-4">
							<AlertDescription>{submitError}</AlertDescription>
						</Alert>
					)}

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input placeholder="Seu nome" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="seu@email.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="w-full h-px bg-slate-200 mt-5!" />

							<div className="flex justify-between mt-0! pt-4">
								<Button
									type="button"
									variant="ghost"
									onClick={() => onOpenChange(false)}
									disabled={isSubmitting}
								>
									Cancelar
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "Salvando…" : "Salvar"}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

// ── Change password dialog ─────────────────────────────────────────────────────

interface ChangePasswordDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function ChangePasswordDialog({
	open,
	onOpenChange,
}: ChangePasswordDialogProps) {
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const form = useForm<ChangePasswordValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		if (open) {
			form.reset();
			setSubmitError(null);
			setSuccess(false);
		}
	}, [open]);

	async function handleSubmit(values: ChangePasswordValues) {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			// The API uses session auth; currentPassword is a UX safeguard only.
			await apiPatch<ClientMeResponse>("/clients/me", {
				password: values.newPassword,
			});
			setSuccess(true);
		} catch (err) {
			setSubmitError(
				err instanceof Error
					? err.message
					: "Erro ao alterar senha. Tente novamente.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!isSubmitting) onOpenChange(o);
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="gap-0 overflow-hidden rounded-[28px] border-none p-0 shadow-2xl sm:max-w-md"
			>
				<DialogHeader className="space-y-0 px-7 pb-5 pt-7">
					<div className="grid grid-cols-[auto_1fr] items-center gap-4">
						<span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white shadow-md">
							<Lock aria-hidden="true" className="size-5" />
						</span>
						<DialogTitle>
							<H2>Alterar senha</H2>
							<P className="text-slate-500">
								{" "}
								Altere sua senha para manter sua conta segura
							</P>
						</DialogTitle>
					</div>
				</DialogHeader>
				<div className="h-px w-full bg-slate-200" />

				<div className="px-7 py-5">
					{success ? (
						<div className="space-y-5">
							<Alert variant="success">
								<AlertDescription>Senha alterada com sucesso.</AlertDescription>
							</Alert>
							<div className="flex justify-end">
								<Button onClick={() => onOpenChange(false)}>Fechar</Button>
							</div>
						</div>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleSubmit)}
								className="space-y-4"
							>
								{submitError && (
									<Alert variant="error" className="mb-4">
										<AlertDescription>{submitError}</AlertDescription>
									</Alert>
								)}

								<FormField
									control={form.control}
									name="currentPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Senha atual</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nova senha</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Mínimo 6 caracteres"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirmar nova senha</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Repita a nova senha"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="mt-5! h-px w-full bg-slate-200" />

								<div className="flex justify-between pt-4">
									<Button
										type="button"
										variant="ghost"
										onClick={() => onOpenChange(false)}
										disabled={isSubmitting}
									>
										Cancelar
									</Button>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? "Salvando…" : "Alterar senha"}
									</Button>
								</div>
							</form>
						</Form>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AccountPage() {
	const { user, isLoading: authLoading } = useCurrentUser();
	const { profile: fetchedProfile, isLoading: profileLoading } =
		useClientProfile();
	const { logout } = useAuth();

	// Local profile state so it can be updated after edits
	const [profile, setProfile] = useState<ClientMeResponse | null>(null);

	useEffect(() => {
		if (fetchedProfile) setProfile(fetchedProfile);
	}, [fetchedProfile]);

	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
	const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
		useState(false);

	const [addresses, setAddresses] = useState<AddressResponse[]>([]);
	const [addressesLoading, setAddressesLoading] = useState(true);

	// Address add/edit dialog
	const [addressDialogOpen, setAddressDialogOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(
		null,
	);
	const [addressSubmitError, setAddressSubmitError] = useState<string | null>(
		null,
	);
	const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);

	// Address delete dialog
	const [deleteAddressDialogOpen, setDeleteAddressDialogOpen] = useState(false);
	const [deletingAddress, setDeletingAddress] =
		useState<AddressResponse | null>(null);
	const [isDeletingAddress, setIsDeletingAddress] = useState(false);
	const [deleteAddressError, setDeleteAddressError] = useState<string | null>(
		null,
	);

	useEffect(() => {
		apiGet<AddressListResponse>("/addresses")
			.then((res) => setAddresses(res.items ?? []))
			.catch(() => setAddresses([]))
			.finally(() => setAddressesLoading(false));
	}, []);

	if (!authLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}

	async function handleDeleteAccount() {
		setIsDeleting(true);
		setDeleteError(null);
		try {
			await apiDelete("/clients/me");
			window.location.href = "/";
		} catch {
			setDeleteError("Não foi possível excluir a conta. Tente novamente.");
			setIsDeleting(false);
			setIsDeleteDialogOpen(false);
		}
	}

	function handleOpenAddAddress() {
		setEditingAddress(null);
		setAddressSubmitError(null);
		setAddressDialogOpen(true);
	}

	function handleOpenEditAddress(address: AddressResponse) {
		setEditingAddress(address);
		setAddressSubmitError(null);
		setAddressDialogOpen(true);
	}

	function handleOpenDeleteAddress(address: AddressResponse) {
		setDeletingAddress(address);
		setDeleteAddressError(null);
		setDeleteAddressDialogOpen(true);
	}

	async function handleAddressSubmit(values: AddressFormValues) {
		setIsAddressSubmitting(true);
		setAddressSubmitError(null);
		try {
			if (editingAddress?.id) {
				const updated = await apiPatch<AddressResponse>(
					`/addresses/${editingAddress.id}`,
					values,
				);
				setAddresses((prev) =>
					prev.map((a) => (a.id === updated.id ? updated : a)),
				);
			} else {
				const created = await apiPost<AddressResponse>("/addresses", values);
				setAddresses((prev) => [created, ...prev]);
			}
			setAddressDialogOpen(false);
		} catch (err) {
			setAddressSubmitError(
				err instanceof Error ? err.message : "Erro ao salvar endereço.",
			);
		} finally {
			setIsAddressSubmitting(false);
		}
	}

	async function handleDeleteAddress() {
		if (!deletingAddress?.id) return;
		setIsDeletingAddress(true);
		setDeleteAddressError(null);
		try {
			await apiDelete(`/addresses/${deletingAddress.id}`);
			setAddresses((prev) => prev.filter((a) => a.id !== deletingAddress.id));
			setDeleteAddressDialogOpen(false);
		} catch {
			setDeleteAddressError(
				"Não foi possível remover o endereço. Tente novamente.",
			);
			setIsDeletingAddress(false);
		}
	}

	const personalDataRows = profile
		? [
				{ label: "E-mail", value: profile.email ?? "—" },
				{ label: "Nome", value: profile.name ?? "—" },
				{
					label: "Data de nascimento",
					value: formatDate(profile.dateOfBirth ?? ""),
				},
				{ label: "CPF", value: formatCpf(profile.cpf ?? "") },
			]
		: null;

	const addressDefaultValues: AddressFormValues = editingAddress
		? {
				name: editingAddress.name ?? "",
				street: editingAddress.street ?? "",
				number: editingAddress.number ?? "",
				neighborhood: editingAddress.neighborhood ?? "",
				city: editingAddress.city ?? "",
				state: editingAddress.state ?? "",
				postalCode: editingAddress.postalCode ?? "",
				complement: editingAddress.complement ?? "",
				isDefault: editingAddress.isDefault ?? false,
			}
		: {
				name: "",
				street: "",
				number: "",
				neighborhood: "",
				city: "",
				state: "",
				postalCode: "",
				complement: "",
				isDefault: false,
			};

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8 pb-0">
				<h1 className="font-big-shoulders text-4xl font-bold text-slate-900">
					Minha conta
				</h1>

				<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Dados pessoais */}
					<Card
						className={cn("border-transparent bg-slate-50 p-6 shadow-none")}
					>
						<SectionTitle>Dados pessoais</SectionTitle>
						<div className="mt-6 space-y-3">
							{profileLoading || !personalDataRows
								? Array.from({ length: 4 }).map((_, i) => (
										<DataRowSkeleton key={i} />
									))
								: personalDataRows.map((row) => (
										<DataRow
											key={row.label}
											label={row.label}
											value={row.value}
										/>
									))}
						</div>
						<div className="mt-6 flex justify-center">
							<Button
								variant="outline"
								onClick={() => setIsEditProfileDialogOpen(true)}
							>
								Editar
							</Button>
						</div>
					</Card>

					{/* Endereços salvos */}
					<Card
						className={cn("border-transparent bg-slate-50 p-6 shadow-none")}
					>
						<SectionTitle>Endereços salvos</SectionTitle>
						<div className="mt-6 space-y-6">
							{addressesLoading
								? Array.from({ length: 2 }).map((_, i) => (
										<DataRowSkeleton key={i} />
									))
								: addresses.map((address) => (
										<div key={address.id}>
											<AddressField
												address={address}
												onEdit={handleOpenEditAddress}
												onDelete={handleOpenDeleteAddress}
											/>
										</div>
									))}
						</div>
						<div className="mt-6 flex justify-center">
							<Button variant="outline" onClick={handleOpenAddAddress}>
								Adicionar endereço
							</Button>
						</div>
					</Card>
				</div>

				{/* Alterar senha */}
				<div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<SectionTitle>Alterar senha</SectionTitle>
						<P className="mt-1 text-slate-600">
							Altere sua senha para manter sua conta segura. Recomendamos usar
							uma senha forte e única, que você não use em outros sites.
						</P>
					</div>
					<Button
						variant="outline"
						className="shrink-0"
						onClick={() => setIsChangePasswordDialogOpen(true)}
					>
						<Lock aria-hidden="true" className="size-4" />
						Alterar senha
					</Button>
				</div>

				{/* Sair */}
				<div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<SectionTitle>Sair da conta</SectionTitle>
						<P className="mt-1 text-slate-600">
							Encerra a sessão neste dispositivo.
						</P>
					</div>
					<Button
						variant="outline"
						className="shrink-0"
						onClick={() => logout()}
					>
						<LogOut aria-hidden="true" className="size-4" />
						Sair
					</Button>
				</div>

				{/* Excluir conta */}
				<div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<SectionTitle>Excluir conta</SectionTitle>
						<P className="mt-1 text-slate-600">
							Esta ação é permanente e remove todos os seus dados e coleções.
						</P>
						{deleteError && (
							<Alert variant="error" className="mt-3">
								<AlertDescription>{deleteError}</AlertDescription>
							</Alert>
						)}
					</div>
					<Button
						variant="destructive"
						className="shrink-0 py-2"
						onClick={() => setIsDeleteDialogOpen(true)}
					>
						<Trash2 aria-hidden="true" className="size-4" />
						Excluir conta
					</Button>
				</div>
			</main>

			{/* ── Edit profile dialog ──────────────────────────────────────────── */}
			<EditProfileDialog
				open={isEditProfileDialogOpen}
				onOpenChange={setIsEditProfileDialogOpen}
				initialName={profile?.name ?? ""}
				initialEmail={profile?.email ?? ""}
				onSuccess={(updated) => setProfile(updated)}
			/>

			{/* ── Change password dialog ──────────────────────────────────────── */}
			<ChangePasswordDialog
				open={isChangePasswordDialogOpen}
				onOpenChange={setIsChangePasswordDialogOpen}
			/>

			{/* ── Add / Edit address dialog ────────────────────────────────────── */}
			<Dialog
				open={addressDialogOpen}
				onOpenChange={(o) => {
					if (!isAddressSubmitting) setAddressDialogOpen(o);
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="gap-0 overflow-hidden rounded-[28px] border-none p-0 shadow-2xl sm:max-w-lg"
				>
					<DialogHeader className="space-y-0 px-7 pb-5 pt-7">
						<div className="grid grid-cols-[auto_1fr] items-center gap-4">
							<span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-white bg-blue-700 shadow-md">
								{editingAddress ? (
									<Pencil aria-hidden="true" className="size-5" />
								) : (
									<MapPinPlus aria-hidden="true" className="size-5" />
								)}
							</span>
							<DialogTitle>
								<H2>
									{editingAddress ? "Editar endereço" : "Adicionar endereço"}
								</H2>
								<P className="text-slate-500">
									{editingAddress
										? "Atualize os dados do endereço"
										: "Adicione um novo endereço"}
								</P>
							</DialogTitle>
						</div>
					</DialogHeader>
					<div className="w-full h-px bg-slate-200" />
					<div className="px-7 py-5">
						<AddressForm
							key={editingAddress?.id ?? "new"}
							defaultValues={addressDefaultValues}
							submitLabel={editingAddress ? "Salvar alterações" : "Adicionar"}
							isSubmitting={isAddressSubmitting}
							error={addressSubmitError}
							onSubmit={handleAddressSubmit}
							onCancel={() => setAddressDialogOpen(false)}
						/>
					</div>
				</DialogContent>
			</Dialog>

			{/* ── Delete address dialog ────────────────────────────────────────── */}
			<Dialog
				open={deleteAddressDialogOpen}
				onOpenChange={(o) => {
					if (!isDeletingAddress) setDeleteAddressDialogOpen(o);
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="gap-0 overflow-hidden rounded-[28px] border-none p-0 shadow-2xl sm:max-w-md"
				>
					<DialogHeader className="space-y-0 px-7 pb-5 pt-7">
						<div className="grid grid-cols-[auto_1fr] items-center gap-4">
							<span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-white bg-red-700 shadow-md">
								<Trash2 aria-hidden="true" className="size-5" />
							</span>
							<DialogTitle className="font-big-shoulders text-xl font-bold text-slate-900">
								Remover endereço?
							</DialogTitle>
						</div>
					</DialogHeader>
					<div className="w-full h-px bg-slate-200" />
					<DialogDescription className="mt-1 mx-6 my-4 text-slate-600">
						O endereço <strong>{deletingAddress?.name}</strong> será removido
						permanentemente.
					</DialogDescription>
					{deleteAddressError && (
						<div className="mx-6 mb-4">
							<Alert variant="error">
								<AlertDescription>{deleteAddressError}</AlertDescription>
							</Alert>
						</div>
					)}
					<div className="w-full h-px bg-slate-200" />
					<DialogFooter className="flex flex-row justify-between! gap-3 border-t-0 bg-transparent px-5 pb-7 mx-0">
						<Button
							variant="ghost"
							onClick={() => setDeleteAddressDialogOpen(false)}
							disabled={isDeletingAddress}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteAddress}
							disabled={isDeletingAddress}
						>
							{isDeletingAddress ? "Removendo..." : "Remover"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ── Delete account dialog ────────────────────────────────────────── */}
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={(open) => {
					if (!isDeleting) {
						setIsDeleteDialogOpen(open);
					}
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="gap-0 overflow-hidden rounded-[28px] border-none p-0 shadow-2xl sm:max-w-md"
				>
					<DialogHeader className="space-y-0 px-7 pb-5 pt-7">
						<div className="grid grid-cols-[auto_1fr] items-center gap-4">
							<span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-white bg-red-700 shadow-md">
								<Trash2 aria-hidden="true" className="size-5" />
							</span>
							<DialogTitle>
								<H2>Excluir conta</H2>
								<P className="text-slate-500">
									Deseja mesmo excluir sua conta?
								</P>
							</DialogTitle>
						</div>
					</DialogHeader>
					<div className="w-full h-px bg-slate-200"></div>
					<DialogDescription className="mt-1 mx-6 my-4 text-slate-600">
						Esta ação é <span className="font-bold">permanente</span> e remove
						todos os seus dados e coleções.
					</DialogDescription>
					<div className="w-full h-px bg-slate-200"></div>
					<DialogFooter className="flex flex-row justify-between! gap-3 border-t-0 bg-transparent px-5 pb-7 mx-0">
						<Button
							variant="ghost"
							onClick={() => setIsDeleteDialogOpen(false)}
							disabled={isDeleting}
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteAccount}
							disabled={isDeleting}
						>
							{isDeleting ? "Excluindo..." : "Excluir conta"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppShell>
	);
}
