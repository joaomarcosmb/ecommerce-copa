import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type ReactNode,
} from "react";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
	CartItemRequest,
	CartItemResponse,
	CartResponse,
} from "@/api/generated/model";
import type { AuthUser } from "@/hooks/use-current-user";
import {
	addToGuestCart,
	clearGuestCart,
	getGuestCart,
	removeFromGuestCart,
	updateGuestCart,
} from "@/lib/guest-cart";

export type GuestItemMeta = Pick<
	CartItemResponse,
	"title" | "photo" | "unitPrice" | "stock"
>;

type CartState = {
	cart: CartResponse | null;
	isLoading: boolean;
};

type CartContextValue = {
	cart: CartResponse | null;
	isLoading: boolean;
	itemCount: number;
	addItem: (
		skuId: string,
		amount: number,
		meta?: GuestItemMeta,
	) => Promise<void>;
	updateItem: (skuId: string, amount: number) => Promise<void>;
	removeItem: (skuId: string) => Promise<void>;
	mergeGuestCartOnLogin: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function guestCartToResponse(items: CartItemResponse[]): CartResponse {
	const totalValue = items.reduce(
		(sum, i) => sum + (i.subtotal ?? (i.unitPrice ?? 0) * (i.amount ?? 1)),
		0,
	);
	return { items, totalValue };
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<CartState>({
		cart: null,
		isLoading: true,
	});
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		apiGet<AuthUser>("/auth/me")
			.then((u) => {
				setUser(u);
				return apiGet<CartResponse>("/cart").then((cart) => {
					const guestItems = getGuestCart();
					if (guestItems.length > 0) {
						mergeIntoApi(cart, guestItems).then((merged) => {
							clearGuestCart();
							setState({ cart: merged, isLoading: false });
						});
					} else {
						setState({ cart, isLoading: false });
					}
				});
			})
			.catch(() => {
				setUser(null);
				const guestItems = getGuestCart();
				setState({
					cart: guestCartToResponse(guestItems),
					isLoading: false,
				});
			});
	}, []);

	async function mergeIntoApi(
		apiCart: CartResponse,
		guestItems: CartItemResponse[],
	): Promise<CartResponse> {
		const apiItems = apiCart.items ?? [];
		let result = apiCart;
		for (const guestItem of guestItems) {
			const existing = apiItems.find((i) => i.skuId === guestItem.skuId);
			const body: CartItemRequest = {
				skuId: guestItem.skuId!,
				amount: existing
					? (existing.amount ?? 0) + (guestItem.amount ?? 1)
					: (guestItem.amount ?? 1),
			};
			if (existing) {
				result = await apiPatch<CartResponse>(
					`/cart/items/${guestItem.skuId}`,
					{ amount: body.amount },
				);
			} else {
				result = await apiPost<CartResponse>("/cart/items", body);
			}
		}
		return result;
	}

	const mergeGuestCartOnLogin = useCallback(async () => {
		const guestItems = getGuestCart();
		if (guestItems.length === 0) return;
		const apiCart = await apiGet<CartResponse>("/cart");
		const merged = await mergeIntoApi(apiCart, guestItems);
		clearGuestCart();
		setState({ cart: merged, isLoading: false });
	}, []);

	async function addItem(
		skuId: string,
		amount: number,
		meta?: GuestItemMeta,
	): Promise<void> {
		if (!user) {
			const items = addToGuestCart({ skuId, amount, ...meta });
			setState((s) => ({ ...s, cart: guestCartToResponse(items) }));
			return;
		}
		const cart = await apiPost<CartResponse>("/cart/items", {
			skuId,
			amount,
		} satisfies CartItemRequest);
		setState((s) => ({ ...s, cart }));
	}

	async function updateItem(skuId: string, amount: number): Promise<void> {
		if (!user) {
			const items = updateGuestCart(skuId, amount);
			setState((s) => ({ ...s, cart: guestCartToResponse(items) }));
			return;
		}
		const cart = await apiPatch<CartResponse>(`/cart/items/${skuId}`, {
			amount,
		});
		setState((s) => ({ ...s, cart }));
	}

	async function removeItem(skuId: string): Promise<void> {
		if (!user) {
			const items = removeFromGuestCart(skuId);
			setState((s) => ({ ...s, cart: guestCartToResponse(items) }));
			return;
		}
		const cart = await apiDelete<CartResponse>(`/cart/items/${skuId}`);
		setState((s) => ({ ...s, cart }));
	}

	const itemCount = (state.cart?.items ?? []).reduce(
		(sum, i) => sum + (i.amount ?? 0),
		0,
	);

	return (
		<CartContext.Provider
			value={{
				cart: state.cart,
				isLoading: state.isLoading,
				itemCount,
				addItem,
				updateItem,
				removeItem,
				mergeGuestCartOnLogin,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used inside CartProvider");
	return ctx;
}
