import { useEffect, useState } from "react";

import {
	heroSlides,
	type HeroSlide,
} from "@/components/ecommerce-showcase/data";

type HeroSlidesState = {
	data: HeroSlide[];
	isLoading: boolean;
	error: Error | null;
};

export function useHeroSlides(): HeroSlidesState {
	const [state, setState] = useState<HeroSlidesState>({
		data: [],
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		// TODO: replace with fetch("/api/hero-slides").then(r => r.json())
		Promise.resolve(heroSlides)
			.then((data) => setState({ data, isLoading: false, error: null }))
			.catch((error) => setState({ data: [], isLoading: false, error }));
	}, []);

	return state;
}
