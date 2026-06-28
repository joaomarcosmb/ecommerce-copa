import { useMemo, useRef, useState, useEffect } from "react";
import { Grid2X2Plus, Menu, Search, ShoppingCart, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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

interface MobileMenuProps {
	user: AuthUser | null;
}

function MobileMenu({ user }: MobileMenuProps) {
	const { logout } = useAuth();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Abrir menu"
					className="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none lg:hidden"
				>
					<Menu aria-hidden="true" className="size-6" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0">
				<div className="flex h-1 shrink-0">
					<div className="flex-1 bg-blue-700" />
					<div className="flex-1 bg-green-500" />
					<div className="flex-1 bg-red-700" />
				</div>
				<div className="flex items-center justify-between px-5 py-4">
					<SheetTitle className="font-big-shoulders text-2xl font-black tracking-tight text-slate-900">
						<a href="/" aria-label="CupStickers — página inicial">
							CupStickers
						</a>
					</SheetTitle>
				</div>

				<nav aria-label="Categorias" className="flex-1 overflow-y-auto px-3">
					<p className="px-3 pb-1 pt-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
						Categorias
					</p>
					<ul className="flex flex-col">
						{categories.map((cat) => (
							<li key={cat.slug}>
								<SheetClose asChild>
									<a
										href={`/catalog?category=${cat.slug}`}
										className="block rounded-xl px-3 py-3 font-sans text-base font-medium text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100"
									>
										{cat.label}
									</a>
								</SheetClose>
							</li>
						))}
					</ul>
				</nav>

				<div className="border-t border-slate-100 p-3">
					{user ? (
						<ul className="flex flex-col">
							<li>
								<SheetClose asChild>
									<a
										href="/account"
										className="block rounded-xl px-3 py-2.5 font-sans text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
									>
										Meu perfil
									</a>
								</SheetClose>
							</li>
							<li>
								<SheetClose asChild>
									<a
										href="/orders"
										className="block rounded-xl px-3 py-2.5 font-sans text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
									>
										Meus pedidos
									</a>
								</SheetClose>
							</li>
							<li>
								<button
									type="button"
									onClick={() => logout()}
									className="w-full rounded-xl px-3 py-2.5 text-left font-sans text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
								>
									Sair
								</button>
							</li>
						</ul>
					) : (
						<SheetClose asChild>
							<a
								href="/signin"
								className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-blue-800"
							>
								<User aria-hidden="true" className="size-4" />
								Entrar
							</a>
						</SheetClose>
					)}
				</div>
			</SheetContent>
		</Sheet>
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
	const mobileSearchRef = useRef<HTMLDivElement>(null);

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
			const target = e.target as Node;
			if (
				!searchContainerRef.current?.contains(target) &&
				!mobileSearchRef.current?.contains(target)
			) {
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
			<div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex shrink-0 items-center gap-1.5">
					{!isAdmin && <MobileMenu user={user ?? null} />}
					<a
						href="/"
						className="shrink-0 font-big-shoulders text-3xl font-black tracking-tight text-primary-foreground sm:text-4xl"
						aria-label="CupStickers — página inicial"
					>
						CupStickers
					</a>
				</div>

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
							<button
								type="button"
								aria-label="Abrir busca"
								onClick={openSearch}
								tabIndex={isSearchOpen ? -1 : undefined}
								className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity duration-200 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none sm:hidden ${
									isSearchOpen ? "opacity-0" : "opacity-100"
								}`}
							>
								<Search aria-hidden="true" className="size-5" />
							</button>

							<div
								ref={searchContainerRef}
								className="relative hidden sm:block"
							>
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
								className={`relative text-white transition-opacity duration-200 hover:bg-white/10 active:text-black ${
									isSearchOpen
										? "opacity-0 pointer-events-none sm:pointer-events-auto sm:opacity-100"
										: "opacity-100"
								}`}
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
							className="hidden text-white hover:bg-white/10 active:text-black lg:inline-flex"
							onClick={() => {
								window.location.href = "/signin";
							}}
						>
							<User aria-hidden="true" className="size-5" />
						</Button>
					) : (
						<div className={isAdmin ? "flex" : "hidden lg:flex"}>
							<AccountMenu user={user} />
						</div>
					)}
				</div>

				{/* Mobile search overlay */}
				{!isAdmin && (
					<div
						ref={mobileSearchRef}
						className={`absolute inset-x-4 top-1/2 z-50 -translate-y-1/2 sm:hidden ${
							isSearchOpen ? "pointer-events-auto" : "pointer-events-none"
						}`}
					>
						<div
							className={`ml-auto flex h-11 items-center overflow-hidden rounded-full border transition-[width,border-color,background-color,opacity] duration-300 ease-in-out ${
								isSearchOpen
									? "w-full border-white/25 bg-slate-900 opacity-100"
									: "w-9 border-transparent bg-transparent opacity-0"
							}`}
						>
							<form
								onSubmit={handleSubmit}
								className="flex min-w-0 flex-1 items-center gap-2 pl-3"
							>
								<Search
									aria-hidden="true"
									className="size-5 shrink-0 text-white/70"
								/>
								<input
									ref={inputRef}
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Buscar produtos..."
									aria-label="Campo de busca"
									autoComplete="off"
									tabIndex={isSearchOpen ? undefined : -1}
									className="h-full w-full min-w-0 bg-transparent font-sans text-base text-white placeholder:text-white/50 outline-none"
								/>
							</form>

							<button
								type="button"
								aria-label="Fechar busca"
								onClick={closeSearch}
								tabIndex={isSearchOpen ? undefined : -1}
								className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
							>
								<X aria-hidden="true" className="size-5" />
							</button>
						</div>

						{isSearchOpen && searchQuery.trim() && (
							<div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.15)]">
								{suggestions.length > 0 ? (
									<>
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
												className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-sans text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
											>
												<Search
													className="size-4 shrink-0"
													aria-hidden="true"
												/>
												Ver todos os resultados
											</button>
										</div>
									</>
								) : (
									<p className="px-3 py-4 font-sans text-sm text-slate-500">
										Nenhum produto encontrado para{" "}
										<span className="font-semibold text-slate-800">
											"{searchQuery.trim()}"
										</span>
									</p>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
