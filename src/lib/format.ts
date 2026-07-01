const brlFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export const formatCurrency = (value: number) => brlFormatter.format(value);

export function formatDate(iso: string): string {
	const [y, m, d] = iso.split("-");
	return `${d}/${m}/${y}`;
}

export function formatCpf(raw: string): string {
	return raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatRelativeDate(iso: string): string {
	const diffMs = Date.now() - new Date(iso).getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays <= 0) return "hoje";
	if (diffDays === 1) return "há 1 dia";
	if (diffDays < 7) return `há ${diffDays} dias`;

	const diffWeeks = Math.floor(diffDays / 7);
	if (diffWeeks === 1) return "há 1 semana";
	if (diffWeeks < 5) return `há ${diffWeeks} semanas`;

	const diffMonths = Math.floor(diffDays / 30);
	if (diffMonths === 1) return "há 1 mês";
	if (diffMonths < 12) return `há ${diffMonths} meses`;

	const diffYears = Math.floor(diffDays / 365);
	return diffYears === 1 ? "há 1 ano" : `há ${diffYears} anos`;
}

export function resolveMediaUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;
	if (/^https?:\/\//i.test(url)) return url;
	return `https://ecommerce-copa-api.onrender.com/${url.replace(/^\/+/, "")}`;
}
