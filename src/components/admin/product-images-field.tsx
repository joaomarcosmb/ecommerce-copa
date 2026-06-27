import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { resolveMediaUrl } from "@/lib/format";

interface ProductImagesFieldProps {
	value: (File | string)[];
	onChange: (next: (File | string)[]) => void;
}

function previewUrl(item: File | string): string {
	return typeof item === "string"
		? (resolveMediaUrl(item) ?? item)
		: URL.createObjectURL(item);
}

export function ProductImagesField({
	value,
	onChange,
}: ProductImagesFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	// Mantém object URLs para revogar no unmount/troca.
	const [urls, setUrls] = useState<string[]>([]);

	useEffect(() => {
		const next = value.map(previewUrl);
		setUrls(next);
		return () => {
			for (const [i, item] of value.entries()) {
				if (typeof item !== "string") URL.revokeObjectURL(next[i]);
			}
		};
	}, [value]);

	function addFiles(files: FileList | null) {
		if (!files?.length) return;
		onChange([...value, ...Array.from(files)]);
	}

	function removeAt(index: number) {
		onChange(value.filter((_, i) => i !== index));
	}

	return (
		<div className="flex flex-wrap gap-3">
			{value.map((item, index) => (
				<div
					key={typeof item === "string" ? item : `${item.name}-${index}`}
					className="relative size-60 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
				>
					<img src={urls[index]} alt="" className="size-full object-cover" />
					<button
						type="button"
						aria-label={`Remover imagem ${index + 1}`}
						onClick={() => removeAt(index)}
						className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-red-700"
					>
						<X aria-hidden="true" className="size-4" />
					</button>
				</div>
			))}

			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				className="flex size-60 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-blue-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
			>
				<ImagePlus aria-hidden="true" className="size-12" />
				<span className="font-sans text-[12px]">Adicionar</span>
			</button>

			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				className="hidden"
				onChange={(e) => {
					addFiles(e.target.files);
					e.target.value = "";
				}}
			/>
		</div>
	);
}
