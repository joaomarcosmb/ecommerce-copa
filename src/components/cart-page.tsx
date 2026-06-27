import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

import { AppShell } from "./ecommerce-showcase/app-shell";
import { CartAddressForm } from "./ecommerce-showcase/cart-address-form";
import { CartIdentificationForm } from "./ecommerce-showcase/cart-identification-form";
import { CartItem } from "./ecommerce-showcase/cart-item";

const SHIPPING = 20;

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
	return (
		<div className="flex w-full max-w-2xl flex-col items-center gap-1">
			<p className="font-sans text-xs font-medium text-slate-600">
				Etapa {activeStep + 1} de {steps.length}
			</p>
			<div className="flex w-full overflow-hidden rounded-2xl border border-slate-200">
				{steps.map((label, index) => {
					const isDone = index < activeStep;
					const isActive = index === activeStep;
					const isFuture = index > activeStep;

					return (
						<button
							key={label}
							type="button"
							disabled={isFuture}
							onClick={() => isDone && onStepChange(index)}
							className={cn(
								"flex flex-1 items-center justify-center gap-2 py-3.5 transition-colors duration-200",
								"font-sans text-sm font-semibold",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300",
								isActive && "bg-blue-700 text-white",
								isDone && "cursor-pointer text-slate-600 hover:bg-slate-50",
								isFuture && "cursor-not-allowed text-slate-300",
							)}
						>
							{isDone && (
								<Check className="size-3.5 shrink-0" aria-hidden="true" />
							)}
							{label}
						</button>
					);
				})}
			</div>
		</div>
	);
}

const VISITOR_STEPS = ["Revisão dos itens", "Identificação", "Endereço"];
const AUTH_STEPS = ["Revisão dos itens", "Endereço"];

function getInitialStep(): number {
	if (typeof window === "undefined") return 0;
	const s = new URLSearchParams(window.location.search).get("step");
	const n = Number(s);
	return Number.isFinite(n) && n > 0 ? n : 0;
}

function CartPageContent() {
	const { user, isLoading: authLoading } = useCurrentUser();
	const { cart, isLoading: cartLoading, updateItem, removeItem } = useCart();
	const [activeStep, setActiveStep] = useState(getInitialStep);

	const isAuthenticated = !authLoading && user !== null;
	const steps = isAuthenticated ? AUTH_STEPS : VISITOR_STEPS;
	const lastStep = steps.length - 1;

	const isReviewStep = activeStep === 0;
	const isIdentificationStep = !isAuthenticated && activeStep === 1;
	const isAddressStep =
		activeStep === lastStep && !isReviewStep && !isIdentificationStep;

	const items = cart?.items ?? [];
	const subtotal = cart?.totalValue ?? 0;
	const total = subtotal + SHIPPING;

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
						cartLoading ? (
							<div className="flex flex-col gap-4 py-8">
								{Array.from({ length: 2 }).map((_, i) => (
									<div
										key={i}
										className="h-28 animate-pulse rounded-xl bg-slate-100"
									/>
								))}
							</div>
						) : items.length === 0 ? (
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
										key={item.skuId}
										className={cn(
											index < items.length - 1 && "border-b border-slate-100",
										)}
									>
										<CartItem
											item={item}
											onUpdateQuantity={updateItem}
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
	);
}

export function CartPage() {
	return (
		<AppShell>
			<CartPageContent />
		</AppShell>
	);
}
