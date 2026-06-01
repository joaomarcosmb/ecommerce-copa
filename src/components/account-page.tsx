import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabelLarge, P } from "@/components/typography";
import { cn } from "@/lib/utils";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";

// TODO: replace with real account data from API (e.g. useAccount hook)
const PERSONAL_DATA = [
  { label: "E-mail", value: "pele@selecaobr.com" },
  { label: "Nome", value: "Edson" },
  { label: "Sobrenome", value: "Arantes do Nascimento" },
  { label: "Data de nascimento", value: "23/10/1940" },
  { label: "CPF", value: "10********70" },
];

// TODO: replace with real saved addresses from API
const ADDRESSES = [
  {
    id: "1",
    name: "Casa",
    isDefault: true,
    fields: {
      endereco: { label: "Endereço", value: "Rua Três Corações" },
      numero: { label: "Número", value: "10" },
      bairro: { label: "Bairro", value: "Vila Pelé" },
      cep: { label: "CEP", value: "37520-000" },
      cidade: { label: "Cidade", value: "Três Corações" },
      estado: { label: "Estado", value: "Minas Gerais" },
      complemento: { label: "Complemento", value: "Rei do Futebol" },
    },
  },
  {
    id: "2",
    name: "Estádio",
    fields: {
      endereco: { label: "Endereço", value: "Praça Charles Miller" },
      numero: { label: "Número", value: "1" },
      bairro: { label: "Bairro", value: "Pacaembu" },
      cep: { label: "CEP", value: "01234-010" },
      cidade: { label: "Cidade", value: "São Paulo" },
      estado: { label: "Estado", value: "São Paulo" },
      complemento: { label: "Complemento", value: "Portão dos Campeões" },
    },
  },
  {
    id: "3",
    name: "Trabalho",
    fields: {
      endereco: { label: "Endereço", value: "Av. Maracanã" },
      numero: { label: "Número", value: "2000" },
      bairro: { label: "Bairro", value: "Maracanã" },
      cep: { label: "CEP", value: "20271-130" },
      cidade: { label: "Cidade", value: "Rio de Janeiro" },
      estado: { label: "Estado", value: "Rio de Janeiro" },
      complemento: { label: "Complemento", value: "Setor Leste Superior" },
    },
  },
];

const breadcrumbItems = [{ label: "Início", href: "/" }, { label: "Conta" }];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-big-shoulders text-2xl font-bold text-slate-900">
      {children}
    </h2>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-baseline gap-2">
      <LabelLarge className="text-lefttext-slate-900">{label}</LabelLarge>
      <P className="text-slate-600">{value}</P>
    </div>
  );
}

type Address = {
  id: string;
  name: string;
  isDefault?: boolean;
  fields: {
    endereco: { label: string; value: string };
    numero: { label: string; value: string };
    bairro: { label: string; value: string };
    cep: { label: string; value: string };
    cidade: { label: string; value: string };
    estado: { label: string; value: string };
    complemento?: { label: string; value: string };
  };
};
function AddressField({ name, isDefault, fields }: Address) {
  return (
    <div className="w-full grid grid-cols-[80px_minmax(0,1fr)_130px] grid-flow-col items-center gap-4">
      <LabelLarge className="text-slate-900 text-md">{name}</LabelLarge>
      <P className="text-slate-600 text-wrap">
        {fields.endereco.value}, {fields.numero.value} - {fields.bairro.value},{" "}
        {fields.cidade.value} - {fields.estado.value}. {fields.cep.value}
      </P>
      <div className="flex items-center gap-1.5 ml-auto">
        {isDefault && <P className="text-slate-600 text-sm">Padrão</P>}
        <Button
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          aria-label={`Editar endereço ${name}`}
        >
          <Pencil aria-hidden="true" className="size-4.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          aria-label={`Remover endereço ${name}`}
        >
          <Trash2 aria-hidden="true" className="size-4.5" />
        </Button>
      </div>
    </div>
  );
}

export function AccountPage() {
  return (
    <AppShell>
      <BreadcrumbNav items={breadcrumbItems} className="mx-6 mt-6" />
      <main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8 pb-0">
        <h1 className="font-big-shoulders text-4xl font-bold text-slate-900">
          Minha conta
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Dados pessoais */}
          <Card
            className={cn("border-transparent bg-slate-50 p-6 shadow-none")}
          >
            <SectionTitle>Dados pessoais</SectionTitle>
            <div className="mt-6 space-y-3">
              {PERSONAL_DATA.map((row) => (
                <DataRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Editar</Button>
            </div>
          </Card>

          {/* Endereços salvos */}
          <Card
            className={cn("border-transparent bg-slate-50 p-6 shadow-none")}
          >
            <SectionTitle>Endereços salvos</SectionTitle>
            <div className="mt-6 space-y-6">
              {ADDRESSES.map((address) => (
                <div key={address.id}>
                  <div className="flex items-center justify-between">
                    <AddressField
                      id={address.id}
                      name={address.name}
                      isDefault={address.isDefault}
                      fields={address.fields}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Adicionar endereço</Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionTitle>Excluir conta</SectionTitle>
            <P className="mt-1 text-slate-600">
              Esta ação é permanente e remove todos os seus dados e coleções.
            </P>
          </div>
          <Button variant="destructive" className="shrink-0">
            <Trash2 aria-hidden="true" className="size-4" />
            Excluir conta
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
