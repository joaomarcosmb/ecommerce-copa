import { CheckCircle2, ShoppingCart, Star } from "lucide-react";

import { P } from "@/components/typography";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatCurrency, products } from "./data";

type ProductsSectionProps = {
  selectedProduct: string | null;
  onSelectProduct: (value: string | null) => void;
};

export function ProductsSection({
  selectedProduct,
  onSelectProduct,
}: ProductsSectionProps) {
  return (
    <>
      <section className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 className="font-['Sansita',sans-serif] text-[28px] leading-9 text-slate-900">
            Product Cards
          </h2>
          <Badge variant="success">Coleção Copa 2026</Badge>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const discount = product.originalPrice
              ? Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100,
                )
              : 0;

            return (
              <Card
                key={product.id}
                className="group overflow-hidden border-slate-200 bg-white shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-blue-700 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    width={1080}
                    height={1080}
                    loading="lazy"
                    className="h-70 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {product.badge ? (
                    <div className="absolute top-3 left-3">
                      <Badge variant="error">{product.badge}</Badge>
                    </div>
                  ) : null}
                  {discount > 0 ? (
                    <div className="absolute top-3 right-3">
                      <Badge variant="success">-{discount}%</Badge>
                    </div>
                  ) : null}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </div>
                <CardContent className="space-y-3 pt-4">
                  <h3 className="line-clamp-2 font-['Poppins',sans-serif] text-[14px] font-medium text-slate-900">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Star
                          key={index}
                          aria-hidden="true"
                          className={`size-4 ${index < Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <span className="font-['Poppins',sans-serif] text-[12px] text-slate-400">
                      ({product.rating})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Poppins',sans-serif] text-[16px] font-medium text-red-700">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice ? (
                      <span className="font-['Poppins',sans-serif] text-[14px] text-slate-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => onSelectProduct(product.title)}>
                    <ShoppingCart aria-hidden="true" className="size-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <Dialog
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) {
            onSelectProduct(null);
          }
        }}
      >
        <DialogContent className="max-w-lg rounded-3xl bg-white p-0">
          <DialogHeader className="border-b border-slate-200 p-6">
            <DialogTitle className="font-['Poppins',sans-serif] text-[22px] font-medium text-slate-900">
              {selectedProduct || "Detalhes do Produto"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Modal com informações detalhadas do produto selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <P className="text-slate-500">
              Este modal exibe os detalhes do produto selecionado. Você pode
              personalizar tamanho, cor e quantidade.
            </P>
            <Alert className="rounded-xl border-l-4 border-l-green-700 bg-green-100 text-green-900">
              <CheckCircle2 aria-hidden="true" className="size-4 text-green-700" />
              <AlertDescription className="font-['Poppins',sans-serif] text-[14px] text-green-900">
                Produto disponível em estoque. Entrega em até 3 dias úteis!
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-3 gap-3">
              {["P", "M", "G", "GG", "XGG"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className="rounded-xl border-2 border-slate-200 py-2 font-['Poppins',sans-serif] text-[13px] font-medium text-slate-900 transition-colors duration-200 hover:border-blue-700 hover:text-blue-700"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter className="justify-end gap-3 border-t border-slate-200 p-6">
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => onSelectProduct(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => onSelectProduct(null)}
            >
              Adicionar ao Carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
