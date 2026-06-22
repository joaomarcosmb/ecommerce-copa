import { useEffect, useState } from "react";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { CartItemRequest, CartResponse } from "@/api/generated/model";

type CartState = {
	cart: CartResponse | null;
	isLoading: boolean;
};

export function useCart() {
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

	return {
		cart: state.cart,
		isLoading: state.isLoading,
		itemCount,
		addItem,
		updateItem,
		removeItem,
	};
}
