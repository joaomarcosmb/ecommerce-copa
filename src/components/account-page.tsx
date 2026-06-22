import { useState } from "react";
import { LogOut, Pencil, Trash2 } from "lucide-react";

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
import { LabelLarge, P } from "@/components/typography";
import { useClientProfile } from "@/hooks/use-client-profile";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuth } from "@/hooks/use-auth";
import { apiDelete } from "@/lib/api";
import { formatCpf, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

// Addresses are not yet covered by the API — kept as mock data.
const ADDRESSES = [
	{
		id: "1",
		name: "Casa",
		isDefault: true,
		fields: {
			endereco: { label: "Endereço", value: "Rua Três Corações" },
			numero: { label: "Número", value: "10" },
			bairro: { label: "Bairro", value: "Vila Pelé" },
			cep: { label: "CEP", value: "37520-000" },
			cidade: { label: "Cidade", value: "Três Corações" },
			estado: { label: "Estado", value: "Minas Gerais" },
			complemento: { label: "Complemento", value: "Rei do Futebol" },
		},
	},
	{
		id: "2",
		name: "Estádio",
		fields: {
			endereco: { label: "Endereço", value: "Praça Charles Miller" },
			numero: { label: "Número", value: "1" },
			bairro: { label: "Bairro", value: "Pacaembu" },
			cep: { label: "CEP", value: "01234-010" },
			cidade: { label: "Cidade", value: "São Paulo" },
			estado: { label: "Estado", value: "São Paulo" },
			complemento: { label: "Complemento", value: "Portão dos Campeões" },
		},
	},
	{
		id: "3",
		name: "Trabalho",
		fields: {
			endereco: { label: "Endereço", value: "Av. Maracanã" },
			numero: { label: "Número", value: "2000" },
			bairro: { label: "Bairro", value: "Maracanã" },
			cep: { label: "CEP", value: "20271-130" },
			cidade: { label: "Cidade", value: "Rio de Janeiro" },
			estado: { label: "Estado", value: "Rio de Janeiro" },
			complemento: { label: "Complemento", value: "Setor Leste Superior" },
		},
	},
];

const breadcrumbItems = [{ label: "Início", href: "/" }, { label: "Conta" }];

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

type Address = {
	id: string;
	name: string;
	isDefault?: boolean;
	fields: {
		endereco: { label: string; value: string };
		numero: { label: string; value: string };
		bairro: { label: string; value: string };
		cep: { label: string; value: string };
		cidade: { label: string; value: string };
		estado: { label: string; value: string };
		complemento?: { label: string; value: string };
	};
};

function AddressField({ name, isDefault, fields }: Address) {
	return (
		<div className="w-full grid grid-cols-[80px_minmax(0,1fr)_130px] grid-flow-col items-center gap-4">
			<LabelLarge className="text-slate-900 text-md">{name}</LabelLarge>
			<P className="text-slate-600 text-wrap">
				{fields.endereco.value}, {fields.numero.value} - {fields.bairro.value},{" "}
				{fields.cidade.value} - {fields.estado.value}. {fields.cep.value}
			</P>
			<div className="flex items-center gap-1.5 ml-auto">
				{isDefault && <P className="text-slate-600 text-sm">Padrão</P>}
				<Button
					variant="ghost"
					size="icon-sm"
					className="cursor-pointer"
					aria-label={`Editar endereço ${name}`}
				>
					<Pencil aria-hidden="true" className="size-4.5" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					className="cursor-pointer"
					aria-label={`Remover endereço ${name}`}
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

export function AccountPage() {
	const { user, isLoading: authLoading } = useCurrentUser();
	const { profile, isLoading: profileLoading } = useClientProfile();
	const { logout } = useAuth();
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// Auth guard — redirect while still loading or once confirmed unauthenticated.
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

	const personalDataRows = profile
		? [
				{ label: "E-mail", value: profile.email },
				{ label: "Nome", value: profile.name },
				{ label: "Data de nascimento", value: formatDate(profile.dateOfBirth) },
				{ label: "CPF", value: formatCpf(profile.cpf) },
			]
		: null;

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
							<Button variant="outline" disabled title="Em breve">
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
							{ADDRESSES.map((address) => (
								<div key={address.id}>
									<div className="flex items-center justify-between">
										<AddressField
											id={address.id}
											name={address.name}
											isDefault={address.isDefault}
											fields={address.fields}
										/>
									</div>
								</div>
							))}
						</div>
						<div className="mt-6 flex justify-center">
							<Button variant="outline" disabled>
								Adicionar endereço
							</Button>
						</div>
					</Card>
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
							<DialogTitle className="font-big-shoulders text-xl font-bold text-slate-900">
								Deseja mesmo excluir sua conta?
							</DialogTitle>
						</div>
					</DialogHeader>
					<div className="w-full h-px bg-slate-200"></div>
					<DialogDescription className="mt-1 mx-6 my-4 text-slate-600">
						Esta ação é permanente e remove todos os seus dados e coleções. Tem
						certeza de que deseja continuar?
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
