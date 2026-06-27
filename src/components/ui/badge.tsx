import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
	variant?: BadgeVariant;
	children: React.ReactNode;
	className?: string;
}

function Badge({ variant = "default", children, className = "" }: BadgeProps) {
	const variants = {
		default: "bg-slate-200 text-slate-700",
		success: "bg-green-700 text-white",
		error: "bg-red-700 text-white",
		warning: "bg-amber-500 text-white",
		info: "bg-blue-700 text-white",
	};

	return (
		<span
			className={cn(
				"inline-flex items-center px-3 py-0.5 rounded-full",
				"text-[11px] leading-4 font-sans font-medium",
				variants[variant],
				className,
			)}
		>
			{children}
		</span>
	);
}

export { Badge };
