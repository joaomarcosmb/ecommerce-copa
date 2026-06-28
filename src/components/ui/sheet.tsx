"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Side = "left" | "right";

function Sheet({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetContent({
	className,
	children,
	side = "left",
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	side?: Side;
	showCloseButton?: boolean;
}) {
	const sideClasses =
		side === "left"
			? "inset-y-0 left-0 border-r data-closed:slide-out-to-left data-open:slide-in-from-left"
			: "inset-y-0 right-0 border-l data-closed:slide-out-to-right data-open:slide-in-from-right";

	return (
		<DialogPrimitive.Portal data-slot="sheet-portal">
			<DialogPrimitive.Overlay
				data-slot="sheet-overlay"
				className="fixed inset-0 z-50 bg-black/40 duration-200 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
			/>
			<DialogPrimitive.Content
				data-slot="sheet-content"
				className={cn(
					"fixed z-50 flex h-full w-[84vw] max-w-sm flex-col bg-background shadow-2xl outline-none duration-300 ease-out data-open:animate-in data-closed:animate-out",
					sideClasses,
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="sheet-close"
						className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:outline-none"
					>
						<XIcon className="size-5" />
						<span className="sr-only">Fechar</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
}

function SheetTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="sheet-title"
			className={cn("text-base font-semibold text-slate-900", className)}
			{...props}
		/>
	);
}

function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="sheet-description"
			className={cn("text-sm text-slate-500", className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetDescription,
};
