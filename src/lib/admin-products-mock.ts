/**
 * Dados mockados para PREVIEW local do novo cadastro de produtos/variantes,
 * sem depender do backend.
 *
 * Para voltar às chamadas reais de API, defina `PREVIEW_MOCK = false`
 * (ou remova este arquivo e os trechos `if (PREVIEW_MOCK) …` nos componentes
 * `admin-products-page.tsx` e `product-editor.tsx`).
 */
import type { CategoryResponse } from "@/api/generated/model";
import type { AdminProductDetail } from "./admin-products";

/** Liga o modo de visualização com dados fixos. */
export const PREVIEW_MOCK = true;

export const MOCK_CATEGORIES: CategoryResponse[] = [
	{ id: "cat-albuns", slug: "albuns", title: "Álbuns", featured: true },
	{
		id: "cat-figurinhas",
		slug: "figurinhas",
		title: "Figurinhas",
		featured: true,
	},
	{
		id: "cat-acessorios",
		slug: "acessorios",
		title: "Acessórios",
		featured: false,
	},
];

/** Linha da listagem de produtos (formato consumido por `admin-products-page`). */
export type MockProductRow = {
	id: string;
	name: string;
	images: string[];
	variantCount: number;
	category: { id: string; title: string };
};

export const MOCK_PRODUCTS: MockProductRow[] = [
	{
		id: "p-album-2026",
		name: "Álbum Copa do Mundo 2026",
		images: ["https://picsum.photos/seed/album2026/240"],
		variantCount: 6,
		category: { id: "cat-albuns", title: "Álbuns" },
	},
	{
		id: "p-pack-figurinhas",
		name: "Pacote de Figurinhas Premium",
		images: ["https://picsum.photos/seed/figurinhas/240"],
		variantCount: 3,
		category: { id: "cat-figurinhas", title: "Figurinhas" },
	},
	{
		id: "p-caneta",
		name: "Caneta Comemorativa",
		images: [],
		variantCount: 1,
		category: { id: "cat-acessorios", title: "Acessórios" },
	},
];

/** Detalhe completo de cada produto, para o editor em modo edição. */
export const MOCK_PRODUCT_DETAILS: Record<string, AdminProductDetail> = {
	"p-album-2026": {
		id: "p-album-2026",
		name: "Álbum Copa do Mundo 2026",
		description: "Álbum oficial para colar as figurinhas da Copa de 2026.",
		categoryId: "cat-albuns",
		images: [
			"https://picsum.photos/seed/album2026/240",
			"https://picsum.photos/seed/album2026b/240",
		],
		options: [
			{ name: "Capa", values: ["Mole", "Dura"] },
			{ name: "Idioma", values: ["Português", "Espanhol", "Inglês"] },
		],
		variants: [
			{
				optionValues: ["Mole", "Português"],
				price: "39.90",
				originalPrice: "49.90",
				stock: "120",
				sku: "ALBUM-COPA-2026-MOLE-PORTUGUES",
			},
			{
				optionValues: ["Mole", "Espanhol"],
				price: "39.90",
				originalPrice: "",
				stock: "40",
				sku: "ALBUM-COPA-2026-MOLE-ESPANHOL",
			},
			{
				optionValues: ["Mole", "Inglês"],
				price: "39.90",
				originalPrice: "",
				stock: "35",
				sku: "ALBUM-COPA-2026-MOLE-INGLES",
			},
			{
				optionValues: ["Dura", "Português"],
				price: "59.90",
				originalPrice: "69.90",
				stock: "80",
				sku: "ALBUM-COPA-2026-DURA-PORTUGUES",
			},
			{
				optionValues: ["Dura", "Espanhol"],
				price: "59.90",
				originalPrice: "",
				stock: "20",
				sku: "ALBUM-COPA-2026-DURA-ESPANHOL",
			},
			{
				optionValues: ["Dura", "Inglês"],
				price: "59.90",
				originalPrice: "",
				stock: "18",
				sku: "ALBUM-COPA-2026-DURA-INGLES",
			},
		],
	},
	"p-pack-figurinhas": {
		id: "p-pack-figurinhas",
		name: "Pacote de Figurinhas Premium",
		description: "Pacotes com figurinhas douradas e brilhantes.",
		categoryId: "cat-figurinhas",
		images: ["https://picsum.photos/seed/figurinhas/240"],
		options: [
			{
				name: "Quantidade",
				values: ["5 figurinhas", "10 figurinhas", "20 figurinhas"],
			},
		],
		variants: [
			{
				optionValues: ["5 figurinhas"],
				price: "5.00",
				originalPrice: "",
				stock: "500",
				sku: "PACOTE-FIGURINHAS-PREMIUM-5-FIGURINHAS",
			},
			{
				optionValues: ["10 figurinhas"],
				price: "9.00",
				originalPrice: "10.00",
				stock: "300",
				sku: "PACOTE-FIGURINHAS-PREMIUM-10-FIGURINHAS",
			},
			{
				optionValues: ["20 figurinhas"],
				price: "16.00",
				originalPrice: "20.00",
				stock: "150",
				sku: "PACOTE-FIGURINHAS-PREMIUM-20-FIGURINHAS",
			},
		],
	},
	"p-caneta": {
		id: "p-caneta",
		name: "Caneta Comemorativa",
		description: "Caneta com o logotipo oficial.",
		categoryId: "cat-acessorios",
		images: [],
		options: [],
		variants: [
			{
				optionValues: [],
				price: "12.90",
				originalPrice: "",
				stock: "200",
				sku: "CANETA-COMEMORATIVA",
			},
		],
	},
};
