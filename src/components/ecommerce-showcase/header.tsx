import { Search, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";

import { categories } from "./data";

function AccountMenu() {
  const { user, isLoading } = useCurrentUser();
  const { logout } = useAuth();

  const signInRedirect = () => {
    if (!isLoading && user === null) {
      window.location.href = "/signin";
    }
  };

  // Avoid a flash of the wrong state while the session is being checked.
  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Entrar"
        className="text-white hover:bg-white/10"
        onClick={signInRedirect}
      >
        <User aria-hidden="true" className="size-5" />
      </Button>
    );
  }

  const firstName = user.name.split(" ")[0];

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
        <DropdownMenuItem
          asChild
          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 font-['Poppins',sans-serif] text-sm font-medium text-slate-700 focus:text-blue-600 focus:bg-transparent"
        >
          <a href="/account">Meu perfil</a>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => logout()}
          className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 font-['Poppins',sans-serif] text-sm font-medium text-slate-700 focus:text-blue-600 focus:bg-transparent"
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 shadow-xl">
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Pesquisar"
            className="text-white hover:bg-white/10"
          >
            <Search aria-hidden="true" className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Carrinho de compras"
            className="text-white hover:bg-white/10"
          >
            <ShoppingCart aria-hidden="true" className="size-5" />
          </Button>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
