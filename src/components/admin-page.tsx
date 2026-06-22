import { Package, Tag } from "lucide-react";

import { AdminEntityCard } from "./admin/admin-entity-card";
import { AppShell } from "./ecommerce-showcase/app-shell";

export function AdminPage() {
	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex min-h-[60vh] flex-col items-center justify-center">
					<div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
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
