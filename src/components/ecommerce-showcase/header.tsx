import { Grid2X2Plus, Search, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser, type AuthUser } from "@/hooks/use-current-user";
import { useCart } from "@/contexts/cart-context";

import { categories } from "./data";

const menuItemClass =
	"cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 font-['Poppins',sans-serif] text-sm font-medium text-slate-700 focus:text-blue-600 focus:bg-transparent";

interface AccountMenuProps {
	user: AuthUser;
}

function AccountMenu({ user }: AccountMenuProps) {
	const { logout } = useAuth();
	const firstName = user.name.split(" ")[0];
	const isAdmin = user.role === "ADMIN";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
				>
					<span className="font-['Poppins',sans-serif] text-sm font-medium text-white">
						Olá, {firstName}
					</span>
					<User aria-hidden="true" className="size-5 text-white" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				sideOffset={10}
				className="w-60 rounded-2xl border-0 p-2 shadow-[0_8px_30px_rgba(15,23,42,0.12)] ring-slate-200/70"
			>
				<div className="px-3 py-2">
					<p className="truncate font-['Poppins',sans-serif] text-sm font-semibold text-slate-900">
						{user.name}
					</p>
					<p className="truncate font-['Poppins',sans-serif] text-xs text-slate-500">
						{user.email}
					</p>
				</div>
				<DropdownMenuSeparator className="bg-slate-100" />

				{!isAdmin && (
					<>
						<DropdownMenuItem asChild className={menuItemClass}>
							<a href="/account">Meu perfil</a>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className={menuItemClass}>
							<a href="/orders">Meus pedidos</a>
						</DropdownMenuItem>
					</>
				)}

				<DropdownMenuItem onSelect={() => logout()} className={menuItemClass}>
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function Header() {
	const { user, isLoading } = useCurrentUser();
	const isAdmin = user?.role === "ADMIN";
	const { itemCount } = useCart();

	return (
		<header className="sticky top-0 z-40 bg-slate-900 shadow-md">
			<div className="flex h-1">
				<div className="flex-1 bg-blue-700" />
				<div className="flex-1 bg-green-500" />
				<div className="flex-1 bg-red-700" />
			</div>
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<a
					href="/"
					className="font-big-shoulders text-4xl font-black tracking-tight text-primary-foreground"
					aria-label="CupStickers — página inicial"
				>
					CupStickers
				</a>

				{!isAdmin && (
					<nav aria-label="Categorias">
						<ul className="hidden items-center gap-8 lg:flex">
							{categories.map((cat) => (
								<li key={cat.slug}>
									<a
										href={`/category/${cat.slug}`}
										className="whitespace-nowrap font-sans text-[14px] font-medium text-white/80 transition-colors hover:text-primary-foreground"
									>
										{cat.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				)}

				<div className="flex items-center gap-4">
					{!isAdmin && (
						<>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Pesquisar"
								className="text-white hover:bg-white/10"
							>
								<Search aria-hidden="true" className="size-5" />
							</Button>
							<Button
								asChild
								variant="ghost"
								size="icon"
								aria-label={`Carrinho de compras${itemCount > 0 ? ` (${itemCount} itens)` : ""}`}
								className="relative text-white hover:bg-white/10"
							>
								<a href="/cart">
									<ShoppingCart aria-hidden="true" className="size-5" />
									{itemCount > 0 && (
										<span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
											{itemCount > 99 ? "99+" : itemCount}
										</span>
									)}
								</a>
							</Button>
						</>
					)}

					{isAdmin && (
						<Button
							asChild
							variant="ghost"
							size="icon"
							className="text-white hover:bg-white/10"
						>
							<a href="/admin" aria-label="Cadastrar produtos ou categorias">
								<Grid2X2Plus aria-hidden="true" className="size-5" />
							</a>
						</Button>
					)}

					{isLoading ? null : !user ? (
						<Button
							variant="ghost"
							size="icon"
							aria-label="Entrar"
							className="text-white hover:bg-white/10"
							onClick={() => {
								window.location.href = "/signin";
							}}
						>
							<User aria-hidden="true" className="size-5" />
						</Button>
					) : (
						<AccountMenu user={user} />
					)}
				</div>
			</div>
		</header>
	);
}
