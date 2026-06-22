"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { apiGet } from "@/lib/api";
import type {
	CatalogProductDetailResponse,
	CatalogSkuOptionResponse,
} from "@/api/generated/model";
import { H2, P } from "../typography";

interface ProductDetailsModalProps {
	productId: string | null;
	onClose: () => void;
}

export function ProductDetailsModal({
	productId,
	onClose,
}: ProductDetailsModalProps) {
	const [product, setProduct] = useState<CatalogProductDetailResponse | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedSku, setSelectedSku] =
		useState<CatalogSkuOptionResponse | null>(null);

	useEffect(() => {
		if (!productId) {
			setProduct(null);
			setSelectedSku(null);
			return;
		}

		setIsLoading(true);
		setSelectedSku(null);
		apiGet<CatalogProductDetailResponse>(`/catalog/products/${productId}`)
			.then((res) => setProduct(res))
			.catch(() => setProduct(null))
			.finally(() => setIsLoading(false));
	}, [productId]);

	return (
		<Dialog
			open={Boolean(productId)}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="w-[min(94vw,760px)] max-h-[90vh] gap-0 overflow-hidden rounded-[32px] border-none bg-white p-0 shadow-2xl lg:max-w-190"
			>
				<DialogHeader className="space-y-0 px-7 pb-5 pt-7 sm:px-9">
					<div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
						<span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/20">
							<ShoppingCart aria-hidden="true" className="size-6" />
						</span>
						<div className="min-w-0 text-left">
							<DialogTitle>
								<H2>{product?.category?.title ?? "Produto"}</H2>
							</DialogTitle>
							<P className="text-slate-500">Adicionar à sacola</P>
						</div>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Fechar modal"
							onClick={onClose}
							className="text-slate-900 hover:bg-transparent cursor-pointer"
						>
							<X aria-hidden="true" className="size-8" />
						</Button>
					</div>
					<DialogDescription className="sr-only">
						Selecione uma variante para adicionar ao carrinho.
					</DialogDescription>
				</DialogHeader>

				<div className="mx-7 h-px bg-slate-200 sm:mx-9" />

				<div className="space-y-7 overflow-y-auto px-7 py-6 sm:px-9 sm:py-7">
					{isLoading ? (
						<div className="space-y-3">
							<div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
								{Array.from({ length: 3 }).map((_, i) => (
									<div
										key={i}
										className="h-10 animate-pulse rounded-lg bg-slate-200"
									/>
								))}
							</div>
						</div>
					) : (product?.skus ?? []).length > 0 ? (
						<div className="space-y-4">
							<P className="text-slate-500">Selecione uma variante</P>
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
								{product!.skus!.map((sku) => (
									<Button
										key={sku.id}
										onClick={() => setSelectedSku(sku)}
										variant={selectedSku?.id === sku.id ? "primary" : "outline"}
										disabled={sku.stock === 0}
									>
										{sku.title}
										{sku.stock === 0 && (
											<span className="ml-1 text-xs opacity-60">
												(esgotado)
											</span>
										)}
									</Button>
								))}
							</div>
						</div>
					) : (
						<P className="text-slate-500">Nenhuma variante disponível.</P>
					)}
				</div>

				<DialogFooter className="flex justify-between! pb-9! px-10!">
					<Button variant="ghost" onClick={onClose}>
						Cancelar
					</Button>
					<Button disabled={!selectedSku || selectedSku.stock === 0}>
						Adicionar ao Carrinho
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
