import { useEffect, useState } from "react";

import { products, type Product } from "@/components/ecommerce-showcase/data";

type ProductsState = {
  data: Product[];
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
    // TODO: replace with fetch("/api/products").then(r => r.json())
    Promise.resolve(products)
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((error) => setState({ data: [], isLoading: false, error }));
  }, []);

  return state;
}
