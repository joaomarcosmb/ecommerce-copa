import { Loader2 } from "lucide-react";

interface PageLoaderProps {
	label?: string;
}

/** Centered loading state used while a page waits on auth/data before rendering. */
export function PageLoader({ label = "Carregando…" }: PageLoaderProps) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
			<Loader2
				aria-hidden="true"
				className="size-8 animate-spin text-blue-700"
			/>
			<p className="font-sans text-slate-500">{label}</p>
		</div>
	);
}
