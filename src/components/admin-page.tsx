import { FileText, Package, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { AdminEntityCard } from "./admin/admin-entity-card";
import { ReportsDialog } from "./admin/reports-dialog";
import { AppShell } from "./ecommerce-showcase/app-shell";
import { H2 } from "./typography";

export function AdminPage() {
	const { user, isLoading } = useCurrentUser();
	const [reportsOpen, setReportsOpen] = useState(false);

	if (!isLoading && user === null) {
		window.location.href = "/signin";
		return null;
	}

	if (!isLoading && user?.role !== "ADMIN") {
		window.location.href = "/account";
		return null;
	}

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex min-h-[60vh] flex-col items-center justify-center">
					<H2 className="text-2xl font-bold text-slate-900 mt-10">
						O que você deseja fazer?
					</H2>
					<div className="mt-6 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<AdminEntityCard
							href="/admin/products"
							icon={Package}
							title="Gerenciar produtos"
							description="Cadastre, edite e remova produtos do catálogo."
						/>
						<AdminEntityCard
							href="/admin/categories"
							icon={Tag}
							title="Gerenciar categorias"
							description="Organize as categorias usadas na loja."
						/>
						<AdminEntityCard
							href="/admin/orders"
							icon={ShoppingBag}
							title="Gerenciar compras"
							description="Visualize e exclua as compras de qualquer cliente."
						/>
						<AdminEntityCard
							onClick={() => setReportsOpen(true)}
							icon={FileText}
							title="Exportar relatórios"
							description="Exporte relatórios administrativos em PDF."
						/>
					</div>
				</div>
			</main>
			<ReportsDialog open={reportsOpen} onOpenChange={setReportsOpen} />
		</AppShell>
	);
}
