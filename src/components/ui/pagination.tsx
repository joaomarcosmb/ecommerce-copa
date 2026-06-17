import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const navButtonBase =
    "inline-flex size-9 items-center justify-center rounded-full font-['Poppins',sans-serif] text-sm transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2";

  return (
    <nav
      aria-label="Paginação"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="Página anterior"
        className={cn(
          navButtonBase,
          "text-slate-600 hover:bg-slate-100 active:bg-slate-200",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Página ${page}`}
          className={cn(
            navButtonBase,
            page === currentPage
              ? "bg-blue-700 text-white disabled:cursor-default disabled:opacity-100"
              : "text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Próxima página"
        className={cn(
          navButtonBase,
          "text-slate-600 hover:bg-slate-100 active:bg-slate-200",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
