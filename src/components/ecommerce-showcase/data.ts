import {
  ArrowLeft,
  ArrowRight,
  Download,
  Eye,
  EyeOff,
  Info,
  LogIn,
  LogOut,
  Menu,
  Pencil,
  Search,
  Share2,
  ShoppingCart,
  Trash2,
  User,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";

export type ProductCategory = "albuns" | "figurinhas";

export type Product = {
  id: number;
  image: string;
  images?: string[];
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  category: ProductCategory;
};

export const PRODUCT_CATEGORY_ORDER: ProductCategory[] = ["albuns", "figurinhas"];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  albuns: "Álbuns",
  figurinhas: "Figurinhas",
};

export function getInstallments(
  price: number,
): { count: number; value: number } | null {
  if (price < 2) return null;
  const count = price >= 120 ? 6 : price >= 60 ? 3 : 2;
  return { count, value: price / count };
}

export const products: Product[] = [
  // Álbuns
  {
    id: 101,
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Álbum Oficial FIFA Copa do Mundo 2026™",
    price: 49.9,
    rating: 4.8,
    reviewCount: 3241,
    badge: "Novo",
    category: "albuns",
  },
  {
    id: 102,
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Álbum Capa Dura Holográfica Copa 2026",
    price: 89.9,
    originalPrice: 119.9,
    rating: 4.9,
    reviewCount: 1872,
    category: "albuns",
  },
  {
    id: 103,
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Álbum Edição Limitada Ouro Copa do Mundo",
    price: 149.9,
    originalPrice: 199.9,
    rating: 4.7,
    reviewCount: 654,
    badge: "Hot",
    category: "albuns",
  },
  {
    id: 104,
    image:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Álbum Pocket Copa 2026 - Edição Viagem",
    price: 29.9,
    rating: 4.5,
    reviewCount: 908,
    category: "albuns",
  },
  // Figurinhas
  {
    id: 201,
    image:
      "https://images.unsplash.com/photo-1761449021169-43e776e86179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Envelope de Figurinhas Copa do Mundo 2026",
    price: 4.5,
    rating: 4.4,
    reviewCount: 12487,
    category: "figurinhas",
  },
  {
    id: 202,
    image:
      "https://images.unsplash.com/photo-1629977008298-926046be0a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1629977008298-926046be0a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1761449021169-43e776e86179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    title: "Pacote com 5 Envelopes de Figurinhas",
    price: 19.9,
    originalPrice: 22.5,
    rating: 4.6,
    reviewCount: 5310,
    badge: "Promo",
    category: "figurinhas",
  },
  {
    id: 203,
    image:
      "https://images.unsplash.com/photo-1728520508268-1766303e1ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Figurinha Especial Holográfica - Edição Rara",
    price: 12.9,
    rating: 4.8,
    reviewCount: 2103,
    category: "figurinhas",
  },
  {
    id: 204,
    image:
      "https://images.unsplash.com/photo-1760177379284-b68471fdd217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Caixa com 100 Envelopes de Figurinhas",
    price: 79.9,
    originalPrice: 99.9,
    rating: 4.9,
    reviewCount: 789,
    badge: "Mais vendido",
    category: "figurinhas",
  },
];

export type IconTile = {
  icon: LucideIcon;
  label: string;
  hoverColorClass: string;
};

export type InfoSlide = {
  id: number;
  text: string;
};

export const infoSlides: InfoSlide[] = [
  {
    id: 1,
    text: "Entrega grátis para compras acima de R$ 199 em todo o Brasil.",
  },
  {
    id: 2,
    text: "Até 30% OFF nos kits oficiais da Copa 2026 por tempo limitado.",
  },
  {
    id: 3,
    text: "Novos uniformes e acessórios acabaram de chegar na coleção.",
  },
];

export const iconTiles: IconTile[] = [
  { icon: ShoppingCart, label: "Carrinho", hoverColorClass: "hover:bg-blue-700" },
  { icon: Eye, label: "Ver", hoverColorClass: "hover:bg-green-700" },
  { icon: EyeOff, label: "Ocultar", hoverColorClass: "hover:bg-red-700" },
  { icon: LogIn, label: "Entrar", hoverColorClass: "hover:bg-blue-700" },
  { icon: LogOut, label: "Sair", hoverColorClass: "hover:bg-red-700" },
  { icon: Share2, label: "Compartilhar", hoverColorClass: "hover:bg-green-700" },
  { icon: Menu, label: "Menu", hoverColorClass: "hover:bg-blue-700" },
  { icon: ArrowLeft, label: "Voltar", hoverColorClass: "hover:bg-slate-900" },
  { icon: ArrowRight, label: "Avançar", hoverColorClass: "hover:bg-slate-900" },
  { icon: Pencil, label: "Editar", hoverColorClass: "hover:bg-blue-700" },
  { icon: Trash2, label: "Excluir", hoverColorClass: "hover:bg-red-700" },
  { icon: Search, label: "Buscar", hoverColorClass: "hover:bg-blue-700" },
  { icon: ZoomIn, label: "Zoom +", hoverColorClass: "hover:bg-green-700" },
  { icon: ZoomOut, label: "Zoom -", hoverColorClass: "hover:bg-red-700" },
  { icon: Info, label: "Alerta", hoverColorClass: "hover:bg-amber-500" },
  { icon: Download, label: "Download", hoverColorClass: "hover:bg-green-700" },
  { icon: User, label: "Usuário", hoverColorClass: "hover:bg-blue-700" },
];

export type Category = {
  label: string;
  slug: string;
};

export const categories: Category[] = [
  { label: "Álbuns", slug: "albuns" },
  { label: "Figurinhas", slug: "stickers" },
  { label: "Kits", slug: "kits" },
  { label: "Acessórios", slug: "accessories" },
  { label: "Promoções", slug: "promos" },
];

export type FeaturedCategory = {
  slug: string;
  label: string;
  image: string;
};

export const STADIUM_FANS =
  "https://images.unsplash.com/photo-1705593973313-75de7bf95b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
export const TROPHY_STADIUM =
  "https://images.unsplash.com/photo-1527871454777-032ec3f75edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

// TODO: replace image placeholders with real category images from the CMS/API
export const featuredCategories: FeaturedCategory[] = [
  { slug: "kits", label: "Kits", image: TROPHY_STADIUM },
  { slug: "albuns", label: "Álbuns", image: TROPHY_STADIUM },
  { slug: "figurinhas", label: "Figurinhas", image: STADIUM_FANS },
];

export type HeroSlide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: STADIUM_FANS,
    title: "Copa do Mundo 2026 está chegando!",
    subtitle:
      "Monte sua coleção com os produtos oficiais FIFA. Álbuns, figurinhas e kits colecionáveis.",
    cta: "Ver kits oficiais",
    link: "/category/kits",
  },
  {
    id: 2,
    image: TROPHY_STADIUM,
    title: "Álbum Oficial FIFA 2026™",
    subtitle:
      "640 figurinhas para coletar. Edições capa dura, holográfica e limitada disponíveis.",
    cta: "Comprar álbum",
    link: "/category/albuns",
  },
  {
    id: 3,
    image: TROPHY_STADIUM,
    title: "Figurinhas Raras e Especiais",
    subtitle:
      "Holográficas, douradas e edições exclusivas. Complete seu álbum agora!",
    cta: "Ver figurinhas",
    link: "/category/figurinhas",
  },
];
