import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { BreadcrumbNav } from "./ecommerce-showcase/breadcrumb-nav";
import { CartAddressForm } from "./ecommerce-showcase/cart-address-form";
import { CartIdentificationForm } from "./ecommerce-showcase/cart-identification-form";
import { CartItem, type CartItemData } from "./ecommerce-showcase/cart-item";

const SHIPPING = 20;

const INITIAL_ITEMS: CartItemData[] = [
	{
		id: 1,
		title: "Álbum Oficial FIFA Copa do Mundo 2026™",
		variant: "Normal",
		price: 49.9,
		quantity: 1,
		image:
			"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
	},
	{
		id: 2,
		title: "Álbum Capa Dura Holográfica Copa 2026",
		variant: "Holográfica",
		price: 89.9,
		quantity: 1,
		image:
			"https://images.unsplash.com/photo-1529900748604-07564a03e7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
	},
];

const breadcrumbItems = [{ label: "Início", href: "/" }, { label: "Carrinho" }];

interface StepIndicatorProps {
	steps: string[];
	activeStep: number;
	onStepChange: (step: number) => void;
}

function StepIndicator({
	steps,
	activeStep,
	onStepChange,
}: StepIndicatorProps) {
	const stepClass = (index: number) =>
		cn(
			"flex flex-1 items-center justify-center py-3.5 transition-colors duration-200",
			"font-['Poppins',sans-serif] text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300",
			activeStep === index
				? "bg-blue-700 text-white"
				: "text-slate-500 hover:bg-slate-50",
		);

	return (
		<div className="flex w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200">
			{steps.map((label, index) => (
				<button
					key={label}
					type="button"
					className={stepClass(index)}
					onClick={() => onStepChange(index)}
				>
					{label}
				</button>
			))}
		</div>
	);
}

const VISITOR_STEPS = ["Revisão dos itens", "Identificação", "Endereço"];
const AUTH_STEPS = ["Revisão dos itens", "Endereço"];

export function CartPage() {
	const { user, isLoading: authLoading } = useCurrentUser();
	const [items, setItems] = useState<CartItemData[]>(INITIAL_ITEMS);
	const [activeStep, setActiveStep] = useState(0);

	const isAuthenticated = !authLoading && user !== null;
	const steps = isAuthenticated ? AUTH_STEPS : VISITOR_STEPS;
	const lastStep = steps.length - 1;

	// Map step index to content type
	// visitor:       0=revisão  1=identificação  2=endereço
	// authenticated: 0=revisão  1=endereço
	const isReviewStep = activeStep === 0;
	const isIdentificationStep = !isAuthenticated && activeStep === 1;
	const isAddressStep =
		activeStep === lastStep && !isReviewStep && !isIdentificationStep;

	const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
	const total = subtotal + SHIPPING;

	function updateQuantity(id: number, quantity: number) {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
		);
	}

	function removeItem(id: number) {
		setItems((prev) => prev.filter((item) => item.id !== id));
	}

	const summaryButton = isReviewStep ? (
		<Button
			variant="primary"
			size="lg"
			className="w-full"
			disabled={items.length === 0}
			onClick={() => setActiveStep(1)}
		>
			Continuar
		</Button>
	) : null;

	return (
		<AppShell>
			<main className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8 pb-0">
				<h1 className="font-big-shoulders text-4xl font-bold text-slate-900">
					Meu carrinho
				</h1>

				<div className="mt-6 flex justify-center">
					<StepIndicator
						steps={steps}
						activeStep={activeStep}
						onStepChange={setActiveStep}
					/>
				</div>

				<div className="mt-6 grid grid-cols-[1fr_400px] gap-6">
					{/* Main column */}
					<div className="rounded-2xl border border-slate-200 bg-white px-8 py-2">
						{isReviewStep ? (
							items.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-16 text-center">
									<p className="text-slate-500">Seu carrinho está vazio.</p>
									<a
										href="/"
										className="mt-4 text-sm font-medium text-blue-700 hover:underline"
									>
										Continuar comprando
									</a>
								</div>
							) : (
								<ul>
									{items.map((item, index) => (
										<li
											key={item.id}
											className={cn(
												index < items.length - 1 && "border-b border-slate-100",
											)}
										>
											<CartItem
												item={item}
												onUpdateQuantity={updateQuantity}
												onRemove={removeItem}
											/>
										</li>
									))}
								</ul>
							)
						) : isIdentificationStep ? (
							<div className="py-6">
								<CartIdentificationForm onSuccess={() => setActiveStep(2)} />
							</div>
						) : isAddressStep ? (
							<div className="py-6">
								<CartAddressForm
									onSuccess={() => {
										window.location.href = "/checkout";
									}}
								/>
							</div>
						) : null}
					</div>

					{/* Order summary */}
					<aside className="flex flex-col gap-5 self-start rounded-2xl border border-slate-200 bg-white px-8 py-6">
						<h2 className="font-big-shoulders text-xl font-bold text-slate-900">
							Resumo do pedido
						</h2>

						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between text-sm text-slate-600">
								<span>Subtotal</span>
								<span>{formatCurrency(subtotal)}</span>
							</div>
							<div className="flex items-center justify-between text-sm text-slate-600">
								<span>Frete</span>
								<span>{formatCurrency(SHIPPING)}</span>
							</div>
						</div>

						<div className="border-t border-slate-200 pt-4">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-slate-900">Total</span>
								<span className="text-lg font-bold text-slate-900">
									{formatCurrency(total)}
								</span>
							</div>
						</div>

						<div className="flex flex-col items-center gap-3">
							{summaryButton}
							<a
								href="/"
								className="text-sm text-slate-500 transition-colors duration-200 hover:text-slate-800"
							>
								Continuar comprando
							</a>
						</div>
					</aside>
				</div>
			</main>
		</AppShell>
	);
}
