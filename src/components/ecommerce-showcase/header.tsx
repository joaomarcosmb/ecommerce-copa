import { ShoppingCart, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import { categories } from "./data";

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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Minha conta"
            className="text-white hover:bg-white/10"
          >
            <User aria-hidden="true" className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
