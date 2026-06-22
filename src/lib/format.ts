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

export function resolveMediaUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;
	if (/^https?:\/\//i.test(url)) return url;
	return `http://localhost:8080${url}`;
}
