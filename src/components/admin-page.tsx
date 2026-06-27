import { Package, Tag } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { AdminEntityCard } from "./admin/admin-entity-card";
import { AppShell } from "./ecommerce-showcase/app-shell";
import { H2 } from "./typography";

export function AdminPage() {
	const { user, isLoading } = useCurrentUser();

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
						O que você deseja cadastrar?
					</H2>
					<div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
						<AdminEntityCard
							href="/admin/products"
							icon={Package}
							title="Produtos"
							description="Cadastre, edite e remova produtos do catálogo."
						/>
						<AdminEntityCard
							href="/admin/categories"
							icon={Tag}
							title="Categorias"
							description="Organize as categorias usadas na loja."
						/>
					</div>
				</div>
			</main>
		</AppShell>
	);
}
