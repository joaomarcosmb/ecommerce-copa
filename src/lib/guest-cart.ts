import type { CartItemResponse } from "@/api/generated/model";

const COOKIE_KEY = "guest_cart";
const EXPIRES_DAYS = 7;

function readCookie(): CartItemResponse[] {
	if (typeof document === "undefined") return [];
	const match = document.cookie.match(
		new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`),
	);
	if (!match) return [];
	try {
		return JSON.parse(decodeURIComponent(match[1])) as CartItemResponse[];
	} catch {
		return [];
	}
}

function writeCookie(items: CartItemResponse[]): void {
	const expires = new Date();
	expires.setDate(expires.getDate() + EXPIRES_DAYS);
	document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(items))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function getGuestCart(): CartItemResponse[] {
	return readCookie();
}

export function clearGuestCart(): void {
	document.cookie = `${COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export function addToGuestCart(item: CartItemResponse): CartItemResponse[] {
	const items = readCookie();
	const existing = items.find((i) => i.skuId === item.skuId);
	if (existing) {
		existing.amount = (existing.amount ?? 0) + (item.amount ?? 1);
		existing.subtotal = (existing.unitPrice ?? 0) * existing.amount;
	} else {
		items.push({
			...item,
			subtotal: (item.unitPrice ?? 0) * (item.amount ?? 1),
		});
	}
	writeCookie(items);
	return items;
}

export function updateGuestCart(
	skuId: string,
	amount: number,
): CartItemResponse[] {
	const items = readCookie();
	const existing = items.find((i) => i.skuId === skuId);
	if (existing) {
		existing.amount = amount;
		existing.subtotal = (existing.unitPrice ?? 0) * amount;
	}
	writeCookie(items);
	return items;
}

export function removeFromGuestCart(skuId: string): CartItemResponse[] {
	const items = readCookie().filter((i) => i.skuId !== skuId);
	writeCookie(items);
	return items;
}
