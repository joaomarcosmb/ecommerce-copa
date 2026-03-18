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

export type Product = {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  badge?: string;
};

export const products: Product[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1629977008298-926046be0a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Kit Oficial Copa do Mundo 2026",
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.9,
    badge: "Novo",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1728520508268-1766303e1ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Chuteira Pro Elite Carbon",
    price: 349.99,
    originalPrice: 499.99,
    rating: 4.7,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1761449021169-43e776e86179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Bola Oficial Copa do Mundo FIFA",
    price: 129.99,
    rating: 4.8,
    badge: "Hot",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1760177379284-b68471fdd217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Luvas Goleiro Championship Pro",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.6,
  },
];

export type IconTile = {
  icon: LucideIcon;
  label: string;
  hoverColorClass: string;
};

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

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
