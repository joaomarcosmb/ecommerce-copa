import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { CartItemRequest, CartResponse } from "@/api/generated/model";

type CartState = {
	cart: CartResponse | null;
	isLoading: boolean;
};

type CartContextValue = {
	cart: CartResponse | null;
	isLoading: boolean;
	itemCount: number;
	addItem: (skuId: string, amount: number) => Promise<void>;
	updateItem: (skuId: string, amount: number) => Promise<void>;
	removeItem: (skuId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<CartState>({
		cart: null,
		isLoading: true,
	});

	useEffect(() => {
		apiGet<CartResponse>("/cart")
			.then((cart) => setState({ cart, isLoading: false }))
			.catch(() => setState({ cart: null, isLoading: false }));
	}, []);

	async function addItem(skuId: string, amount: number): Promise<void> {
		const body: CartItemRequest = { skuId, amount };
		const cart = await apiPost<CartResponse>("/cart/items", body);
		setState((s) => ({ ...s, cart }));
	}

	async function updateItem(skuId: string, amount: number): Promise<void> {
		const cart = await apiPatch<CartResponse>(`/cart/items/${skuId}`, {
			amount,
		});
		setState((s) => ({ ...s, cart }));
	}

	async function removeItem(skuId: string): Promise<void> {
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
