import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

const alertVariants = cva(
	"group/alert relative w-full rounded-xl border-l-4 p-4 flex gap-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18",
	{
		variants: {
			variant: {
				info: "border-blue-700 bg-blue-50",
				success: "border-green-700 bg-green-50",
				warning: "border-amber-500 bg-amber-100",
				error: "border-red-700 bg-red-50",
			},
		},
		defaultVariants: {
			variant: "info",
		},
	},
);

const iconColorVariants: Record<string, string> = {
	info: "text-blue-700",
	success: "text-green-700",
	warning: "text-amber-500",
	error: "text-red-700",
};

const textColorVariants: Record<string, string> = {
	info: "text-blue-800",
	success: "text-green-900",
	warning: "text-amber-900",
	error: "text-red-900",
};

type AlertVariantType = "info" | "success" | "warning" | "error";

function Alert({
	className,
	variant = "info",
	children,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	const variantKey = (variant ?? "info") as AlertVariantType;

	return (
		<div
			data-slot="alert"
			role="alert"
			data-variant={variantKey}
			className={cn(alertVariants({ variant }), className)}
			{...props}
		>
			<div
				className={cn(
					"shrink-0 flex items-center justify-center",
					iconColorVariants[variantKey],
				)}
			>
				<Info className="w-5 h-5" />
			</div>
			<div className={cn("flex-1", textColorVariants[variantKey])}>
				{children}
			</div>
		</div>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"text-[14px] leading-5 font-['Poppins',sans-serif] font-semibold mb-1 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:opacity-80",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"text-[14px] leading-5 font-['Poppins',sans-serif] text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:opacity-80 [&_p:not(:last-child)]:mb-4",
				className,
			)}
			{...props}
		/>
	);
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-action"
			className={cn("absolute top-2 right-2", className)}
			{...props}
		/>
	);
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
