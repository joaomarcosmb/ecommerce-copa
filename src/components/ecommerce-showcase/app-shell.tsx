import type { ReactNode } from "react";

import { CartProvider } from "@/contexts/cart-context";

import { Footer } from "./footer";
import { Header } from "./header";
import { InfoCarousel } from "./info-carousel";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<CartProvider>
			<div className="min-h-screen">
				<InfoCarousel />
				<Header />
				{children}
				<Footer />
			</div>
		</CartProvider>
	);
}
