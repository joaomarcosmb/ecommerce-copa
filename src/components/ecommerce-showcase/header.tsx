import { Headset, Package, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ShowcaseHeader() {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 shadow-xl">
      <div className="flex h-1">
        <div className="flex-1 bg-blue-700" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-red-700" />
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-md">
            <Package aria-hidden="true" className="size-5" />
          </div>
          <h1 className="font-['Sansita',sans-serif] text-[22px] leading-7 text-white">
            Ecommerce
          </h1>
        </div>
        <div className="flex items-center gap-2">
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
            aria-label="Abrir suporte"
            className="text-white hover:bg-white/10"
          >
            <Headset aria-hidden="true" className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir perfil"
            className="text-white hover:bg-white/10"
          >
            <User aria-hidden="true" className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
