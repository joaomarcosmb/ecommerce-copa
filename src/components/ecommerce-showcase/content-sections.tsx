import { AtSign, CircleCheck, Info, ShoppingCart, Star } from "lucide-react";

import { H1, H2, H3, P, LabelMedium, BodySmall } from "@/components/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { tailwindColors } from "@/lib/tailwind-colors";

import { iconTiles } from "./data";

const colorGroups = [
  {
    name: "Azul - Cor Principal",
    colors: tailwindColors.blue,
    chip: "bg-blue-700",
    badge: "info" as const,
  },
  {
    name: "Vermelho - Perigo / Destaque",
    colors: tailwindColors.red,
    chip: "bg-red-700",
    badge: "error" as const,
  },
  {
    name: "Verde - Sucesso / Campo",
    colors: tailwindColors.green,
    chip: "bg-green-700",
    badge: "success" as const,
  },
  {
    name: "Slate - Neutros",
    colors: tailwindColors.slate,
    chip: "bg-slate-500",
    badge: "default" as const,
  },
];

const TABS_RATING_STARS = [0, 1, 2, 3, 4];
const TABS_REVIEW_DISTRIBUTION = [
  { star: 5, width: "82%" },
  { star: 4, width: "10%" },
  { star: 3, width: "5%" },
  { star: 2, width: "2%" },
  { star: 1, width: "1%" },
];

const badgeLabels = {
  default: "Neutral",
  info: "Primary",
  error: "Danger",
  success: "Success",
} as const;

const showcaseTabs = [
  {
    label: "Visão Geral",
    content: (
      <div>
        <H3 className="mb-3 text-slate-900">Visão Geral</H3>
        <P className="text-slate-500">
          As tabs organizam conteúdo em abas dentro de um mesmo contexto, sem
          navegação de página.
        </P>
      </div>
    ),
  },
  {
    label: "Especificações",
    content: (
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <BodySmall className="mb-1 text-slate-400">Material</BodySmall>
          <H3 className="text-slate-900">Microfibra Técnica</H3>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <BodySmall className="mb-1 text-slate-400">Tecnologia</BodySmall>
          <H3 className="text-slate-900">Dri-FIT Pro</H3>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <BodySmall className="mb-1 text-slate-400">Certificado</BodySmall>
          <H3 className="text-slate-900">FIFA Quality Pro</H3>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <BodySmall className="mb-1 text-slate-400">Origem</BodySmall>
          <H3 className="text-slate-900">Edição Especial 2026</H3>
        </div>
      </div>
    ),
  },
  {
    label: "Avaliações",
    content: (
      <div>
        <div className="mb-4 flex items-center gap-4">
          <div className="text-center">
            <div className="font-['Big Shoulders',sans-serif] text-[48px] leading-none text-slate-900">
              4.8
            </div>
            <div className="mt-1 flex justify-center gap-1">
              {TABS_RATING_STARS.map((index) => (
                <Star
                  key={index}
                  aria-hidden="true"
                  className="size-3 text-amber-500"
                  fill="currentColor"
                />
              ))}
            </div>
            <BodySmall className="mt-1 text-slate-400">
              248 avaliações
            </BodySmall>
          </div>
          <div className="flex-1">
            {TABS_REVIEW_DISTRIBUTION.map((review) => (
              <div key={review.star} className="mb-1 flex items-center gap-2">
                <BodySmall className="w-3 text-slate-400">
                  {review.star}
                </BodySmall>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: review.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <P className="text-slate-500">
          Avaliações reais de clientes verificados.
        </P>
      </div>
    ),
  },
];

export function ContentSections() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <H2 className="text-slate-900">Alertas</H2>
          <Badge variant="default">4 variantes</Badge>
        </div>
        <div className="grid gap-4">
          <Alert variant="info">
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>
              Seu pedido foi recebido e está sendo processado.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>
              Pagamento confirmado! Seu kit oficial Copa do Mundo será enviado
              em breve.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Estoque baixo: apenas 3 unidades do Kit Oficial restantes.
            </AlertDescription>
          </Alert>
          <Alert variant="error">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível processar o pagamento. Verifique os dados do
              cartão.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <H2 className="text-slate-900">Botões</H2>
          <Badge variant="info">6 variantes</Badge>
        </div>
        <div className="mb-6 flex flex-wrap gap-4">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destrutivo</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
          <Button variant="secondary">
            <ShoppingCart aria-hidden="true" className="size-4" />
            Com Ícone
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <H2 className="text-slate-900">Formulários</H2>
          <Badge variant="default">Input · Select · Checkbox</Badge>
        </div>
        <Card>
          <CardHeader>
            <H3>Checkout</H3>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            <Input
              label="E-mail"
              name="email"
              autoComplete="email"
              type="email"
              placeholder="nome@dominio.com…"
              icon={<AtSign aria-hidden="true" />}
            />
            <Input
              label="Senha"
              name="password"
              autoComplete="current-password"
              type="password"
              placeholder="Mínimo 8 caracteres…"
              helperText="Use letras, números e símbolos para maior segurança"
            />
            <Input
              label="Cupom de desconto"
              name="coupon"
              autoComplete="off"
              type="text"
              placeholder="Ex: COPA2026…"
              error="Cupom inválido ou expirado"
            />
            <Select>
              <SelectTrigger label="Tamanho do produto" className="w-full">
                <SelectValue placeholder="Selecione o tamanho…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pp">PP - Extra Pequeno</SelectItem>
                <SelectItem value="p">P - Pequeno</SelectItem>
                <SelectItem value="m">M - Médio</SelectItem>
                <SelectItem value="g">G - Grande</SelectItem>
                <SelectItem value="gg">GG - Extra Grande</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-3">
              <LabelMedium>Preferências</LabelMedium>
              <Checkbox label="Receber newsletter com promoções" />
              <Checkbox label="Ativar notificações de estoque" />
              <Checkbox label="Salvar dados para próxima compra" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end gap-3">
              <Button variant="ghost">Cancelar</Button>
              <Button variant="primary">Finalizar Compra</Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <H2 className="text-slate-900">Cards</H2>
          <Badge variant="default">Base · Hover</Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <Info aria-hidden="true" className="size-4" />
                </div>
                <H3 className="text-slate-900">Card Simples</H3>
              </div>
            </CardHeader>
            <CardContent>
              <P className="text-slate-500">
                Componente base de card com header, body e variantes de layout.
              </P>
            </CardContent>
          </Card>
          <Card hover>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <CircleCheck aria-hidden="true" className="size-4" />
                </div>
                <H3 className="text-slate-900">Card com Hover</H3>
              </div>
            </CardHeader>
            <CardContent>
              <P className="text-slate-500">
                Card com efeito hover, elevando e destacando a borda ao passar o
                cursor.
              </P>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Saiba Mais
              </Button>
            </CardFooter>
          </Card>
          <Card
            hover
            className="border-blue-700 bg-linear-to-br from-blue-700 to-slate-900 text-white"
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white">
                  <Star aria-hidden="true" className="size-4 fill-white" />
                </div>
                <H3 className="text-white">Card Premium</H3>
              </div>
            </CardHeader>
            <CardContent>
              <P className="text-blue-200">
                Variante escura com gradiente para CTAs de destaque.
              </P>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white/20"
              >
                Ver Oferta
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <H2 className="text-slate-900">Tabs</H2>
          <Badge variant="default">Navegação</Badge>
        </div>
        <Card>
          <CardContent>
            <Tabs tabs={showcaseTabs} />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <H2 className="text-slate-900">Tipografia</H2>
          <Badge variant="default">Big Shoulders · Poppins · Escalas</Badge>
        </div>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-6 pt-6">
            <div className="border-b border-slate-200 pb-5">
              <p className="mb-2 font-['Poppins',sans-serif] text-[12px] text-slate-400">
                Display Large · Big Shoulders 57px/64px
              </p>
              <H1 className="text-slate-900">Copa do Mundo</H1>
            </div>
            <div className="border-b border-slate-200 pb-5">
              <p className="mb-2 font-['Poppins',sans-serif] text-[12px] text-slate-400">
                Headline Medium · Big Shoulders 28px/36px
              </p>
              <H2 className="text-red-700">Coleção Oficial 2026</H2>
            </div>
            <div className="border-b border-slate-200 pb-5">
              <p className="mb-2 font-['Poppins',sans-serif] text-[12px] text-slate-400">
                Body Medium · Poppins 14px/20px
              </p>
              <P className="text-slate-900">
                O melhor equipamento esportivo para jogar como os campeões.
              </P>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 font-['Poppins',sans-serif] text-[12px] text-slate-400">
                  Headline + Subtitle
                </p>
                <H3 className="text-slate-900">Uniforme Home 2026</H3>
                <BodySmall className="mt-1 text-slate-500">
                  Edição limitada com tecido respirável e acabamento premium.
                </BodySmall>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 font-['Poppins',sans-serif] text-[12px] text-slate-400">
                  Label Variants
                </p>
                <div className="flex items-center gap-2">
                  <LabelMedium className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">
                    Novo
                  </LabelMedium>
                  <LabelMedium className="rounded-full bg-green-100 px-2 py-1 text-green-800">
                    Em estoque
                  </LabelMedium>
                  <LabelMedium className="rounded-full bg-amber-100 px-2 py-1 text-amber-800">
                    Oferta
                  </LabelMedium>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 font-['Poppins',sans-serif] text-[12px] text-slate-400">
                  Numeric Typography
                </p>
                <p className="font-['Poppins',sans-serif] text-[26px] font-semibold text-slate-900 [font-variant-numeric:tabular-nums]">
                  1.248 pedidos
                </p>
                <BodySmall className="text-slate-500">
                  Crescimento de 18,4% no último mês.
                </BodySmall>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 font-['Poppins',sans-serif] text-[12px] text-slate-400">
                  CTA Copy
                </p>
                <p className="font-['Poppins',sans-serif] text-[16px] font-medium text-slate-900">
                  Finalize sua compra com frete grátis.
                </p>
                <BodySmall className="text-slate-500">
                  Oferta válida até domingo às 23:59.
                </BodySmall>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <H2 className="text-slate-900">Paleta de Cores</H2>
          <Badge variant="info">Copa do Mundo</Badge>
        </div>
        <div className="grid gap-8">
          {colorGroups.map((group) => (
            <Card
              key={group.name}
              className="border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`size-5 rounded-full ${group.chip}`} />
                <H3 className="text-slate-900">{group.name}</H3>
                <Badge variant={group.badge}>{badgeLabels[group.badge]}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(group.colors).map(([label, color]) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div
                      className="size-14 rounded-xl border border-black/5 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-['Poppins',sans-serif] text-[12px] text-slate-500">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <H2 className="text-slate-900">Ícones</H2>
          <Badge variant="default">17 ícones</Badge>
        </div>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-8">
              {iconTiles.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors duration-200 hover:text-white ${item.hoverColorClass}`}
                  >
                    <item.icon aria-hidden="true" className="size-6" />
                  </div>
                  <span className="text-center font-['Poppins',sans-serif] text-[12px] text-slate-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
