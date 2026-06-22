import { useEffect, useState } from "react";

import { apiGet } from "@/lib/api";
import type {
	CatalogSkuListResponse,
	CatalogSkuResponse,
} from "@/api/generated/model";

type ProductsState = {
	data: CatalogSkuResponse[];
	isLoading: boolean;
	error: Error | null;
};

export function useProducts(): ProductsState {
	const [state, setState] = useState<ProductsState>({
		data: [],
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		apiGet<CatalogSkuListResponse>("/catalog/skus")
			.then((res) =>
				setState({ data: res.items ?? [], isLoading: false, error: null }),
			)
			.catch((error) => setState({ data: [], isLoading: false, error }));
	}, []);

	return state;
}
