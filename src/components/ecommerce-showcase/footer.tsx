import { Package } from "lucide-react";

import { H3, P } from "@/components/typography";

export function ShowcaseFooter() {
  return (
    <footer className="mt-8 bg-slate-900 py-16 text-white">
      <div className="mb-12 flex h-1">
        <div className="flex-1 bg-blue-700" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-red-700" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-white text-slate-900">
                <Package aria-hidden="true" className="size-4" />
              </div>
              <H3 className="text-white">Ecommerce</H3>
            </div>
            <P className="text-slate-400">
              Design System para e-commerce de figurinhas de futebol da Copa do Mundo de 2026.
            </P>
          </div>
          <div>
            <H3 className="mb-4 text-white">Componentes</H3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Button",
                "Input",
                "Badge",
                "Card",
                "Alert",
                "Modal",
                "Tabs",
                "Select",
              ].map((item) => (
                <p
                  key={item}
                  className="font-['Poppins',sans-serif] text-[12px] text-slate-500 transition-colors hover:text-blue-200"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="font-['Poppins',sans-serif] text-[12px] text-slate-600">
            Construído com Astro, React e Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
