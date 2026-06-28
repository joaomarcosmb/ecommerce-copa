import { useMemo, useRef, useState, useEffect } from "react";
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
import { useProducts } from "@/hooks/use-products";
import { formatCurrency, resolveMediaUrl } from "@/lib/format";
import type { CatalogSkuResponse } from "@/api/generated/model";

import { categories } from "./data";

const menuItemClass =
	"cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-slate-700 focus:text-blue-600 focus:bg-transparent";

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
					<span className="font-sans text-sm font-medium text-white">
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
					<p className="truncate font-sans text-sm font-semibold text-slate-900">
						{user.name}
					</p>
					<p className="truncate font-sans text-xs text-slate-500">
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

interface SuggestionItemProps {
	product: CatalogSkuResponse;
	query: string;
	onSelect: () => void;
}

function SuggestionItem({ product, query, onSelect }: SuggestionItemProps) {
	const href = product.productId
		? `/product?id=${product.productId}&sku=${product.id}`
		: "#";

	const title = product.title ?? "";
	const lowerTitle = title.toLowerCase();
	const lowerQuery = query.toLowerCase();
	const matchIndex = lowerTitle.indexOf(lowerQuery);

	let titleNode: React.ReactNode = title;
	if (matchIndex >= 0) {
		titleNode = (
			<>
				{title.slice(0, matchIndex)}
				<mark className="bg-transparent font-semibold text-slate-900">
					{title.slice(matchIndex, matchIndex + query.length)}
				</mark>
				{title.slice(matchIndex + query.length)}
			</>
		);
	}

	return (
		<a
			href={href}
			onClick={onSelect}
			className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
		>
			<div className="size-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
				{product.photo && (
					<img
						src={resolveMediaUrl(product.photo)}
						alt=""
						className="size-full object-cover"
					/>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-sans text-sm text-slate-700">{titleNode}</p>
				{product.price != null && (
					<p className="font-sans text-xs font-medium text-blue-600">
						{formatCurrency(product.price)}
					</p>
				)}
			</div>
		</a>
	);
}

export function Header() {
	const { user, isLoading } = useCurrentUser();
	const isAdmin = user?.role === "ADMIN";
	const { itemCount } = useCart();
	const { data: allProducts } = useProducts();

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const searchContainerRef = useRef<HTMLDivElement>(null);

	const suggestions = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return [];
		return allProducts
			.filter((p) => p.title?.toLowerCase().includes(q))
			.slice(0, 5);
	}, [allProducts, searchQuery]);

	function openSearch() {
		setIsSearchOpen(true);
		setTimeout(() => inputRef.current?.focus(), 50);
	}

	function closeSearch() {
		setIsSearchOpen(false);
		setSearchQuery("");
	}

	function navigateToSearch() {
		const q = searchQuery.trim();
		if (q) window.location.href = `/catalog?q=${encodeURIComponent(q)}`;
	}

	function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		navigateToSearch();
	}

	useEffect(() => {
		if (!isSearchOpen) return;
		function handleOutsideClick(e: MouseEvent) {
			if (!searchContainerRef.current?.contains(e.target as Node)) {
				closeSearch();
			}
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, [isSearchOpen]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape" && isSearchOpen) closeSearch();
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isSearchOpen]);

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
					className="shrink-0 font-big-shoulders text-4xl font-black tracking-tight text-primary-foreground"
					aria-label="CupStickers — página inicial"
				>
					CupStickers
				</a>

				{!isAdmin && (
					<nav aria-label="Categorias" className="overflow-hidden">
						<ul className="hidden items-center gap-8 lg:flex">
							{categories.map((cat) => (
								<li key={cat.slug}>
									<a
										href={`/catalog?category=${cat.slug}`}
										className="whitespace-nowrap font-sans text-[14px] font-medium text-white/80 transition-colors hover:text-primary-foreground"
									>
										{cat.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				)}

				<div className="flex shrink-0 items-center gap-3">
					{!isAdmin && (
						<>
							<div ref={searchContainerRef} className="relative">
								<div
									className={`flex items-center overflow-hidden rounded-full border transition-[width,border-color,background-color] duration-300 ease-in-out ${
										isSearchOpen
											? "w-64 border-white/25 bg-white/10 sm:w-80"
											: "w-9 border-transparent bg-transparent"
									}`}
								>
									<button
										type="button"
										aria-label={isSearchOpen ? "Pesquisar" : "Abrir busca"}
										onClick={isSearchOpen ? navigateToSearch : openSearch}
										className="flex size-9 shrink-0 items-center justify-center text-white transition-opacity hover:bg-white/10"
									>
										<Search aria-hidden="true" className="size-5" />
									</button>

									<form onSubmit={handleSubmit} className="min-w-0 flex-1 pr-3">
										<input
											ref={inputRef}
											type="search"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Buscar produtos..."
											aria-label="Campo de busca"
											autoComplete="off"
											className={`w-full bg-transparent font-sans text-sm text-white placeholder:text-white/50 outline-none transition-opacity duration-200 ${
												isSearchOpen
													? "opacity-100"
													: "pointer-events-none opacity-0"
											}`}
										/>
									</form>
								</div>

								{isSearchOpen && suggestions.length > 0 && (
									<div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.15)] sm:w-96">
										<p className="px-3 pb-1.5 pt-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-400">
											Resultados
										</p>
										{suggestions.map((product) => (
											<SuggestionItem
												key={product.id}
												product={product}
												query={searchQuery.trim()}
												onSelect={closeSearch}
											/>
										))}
										<div className="mt-1 border-t border-slate-100 pt-1">
											<button
												type="button"
												onClick={navigateToSearch}
												className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 font-sans text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
											>
												<Search
													className="size-4 shrink-0"
													aria-hidden="true"
												/>
												Ver todos os resultados para{" "}
												<span className="font-semibold text-slate-800">
													"{searchQuery.trim()}"
												</span>
											</button>
										</div>
									</div>
								)}

								{/* No results state */}
								{isSearchOpen &&
									searchQuery.trim() &&
									suggestions.length === 0 && (
										<div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.15)] sm:w-96">
											<p className="font-sans text-sm text-slate-500">
												Nenhum produto encontrado para{" "}
												<span className="font-semibold text-slate-800">
													"{searchQuery.trim()}"
												</span>
											</p>
										</div>
									)}
							</div>

							<Button
								asChild
								variant="ghost"
								size="icon"
								aria-label={`Carrinho de compras${itemCount > 0 ? ` (${itemCount} itens)` : ""}`}
								className="relative text-white hover:bg-white/10 active:text-black"
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
							className="text-white hover:bg-white/10 active:text-black"
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
							className="text-white hover:bg-white/10 active:text-black"
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
