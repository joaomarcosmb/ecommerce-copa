import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "default" | "success" | "error" | "warning" | "info";
type BadgeVariant = "solid" | "soft";
type BadgeSize = "sm" | "md";

interface BadgeProps {
	/** Color family. */
	variant?: BadgeTone;
	/** Solid (filled) or soft (tinted background + colored text). */
	appearance?: BadgeVariant;
	size?: BadgeSize;
	children: React.ReactNode;
	className?: string;
}

const solidTones: Record<BadgeTone, string> = {
	default: "bg-slate-200 text-slate-700",
	success: "bg-green-700 text-white",
	error: "bg-red-700 text-white",
	warning: "bg-amber-500 text-white",
	info: "bg-blue-700 text-white",
};

const softTones: Record<BadgeTone, string> = {
	default: "bg-slate-100 text-slate-700",
	success: "bg-green-50 text-green-700",
	error: "bg-red-50 text-red-700",
	warning: "bg-amber-100 text-amber-700",
	info: "bg-blue-50 text-blue-700",
};

const sizes: Record<BadgeSize, string> = {
	sm: "px-3 py-0.5 text-[11px] leading-4",
	md: "px-3 py-1 text-[12px] leading-5",
};

function Badge({
	variant = "default",
	appearance = "solid",
	size = "sm",
	children,
	className = "",
}: BadgeProps) {
	const tones = appearance === "soft" ? softTones : solidTones;

	return (
		<span
			data-slot="badge"
			className={cn(
				"inline-flex items-center rounded-full font-sans font-medium",
				sizes[size],
				tones[variant],
				className,
			)}
		>
			{children}
		</span>
	);
}

export { Badge };
