import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { P } from "@/components/typography";

export function ShowcaseHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-blue-700 to-blue-900 px-4 py-20">
      <div className="absolute -top-20 -right-20 size-80 rounded-full bg-red-700/20 blur-3xl" />
      <div className="absolute -bottom-15 -left-15 size-60 rounded-full bg-green-700/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant="error">Copa do Mundo 2026</Badge>
          <Badge variant="success">Design System</Badge>
          <Badge variant="info">v1.0</Badge>
        </div>
        <h2 className="mb-4 max-w-2xl text-balance font-['Sansita',sans-serif] text-[32px] leading-10 text-white">
          Sistema de Design Profissional para Ecommerce de Futebol
        </h2>
        <P className="mb-8 max-w-2xl text-blue-200">
          Uma biblioteca de componentes completa, pronta para produção,
          construída com React e Tailwind CSS. Tipografia Sansita e Poppins,
          paleta Copa do Mundo e ícones para ecommerce esportivo.
        </P>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg">
            Ver Componentes
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-white px-6 py-3 text-white hover:bg-white/10"
          >
            Documentação
          </Button>
        </div>
      </div>
    </section>
  );
}
