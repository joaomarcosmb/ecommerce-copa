import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { H2, P } from "@/components/typography";

interface AdminFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	icon: LucideIcon;
	title: string;
	subtitle: string;
	/** Form element rendering the scrollable body and footer actions. */
	children: React.ReactNode;
}

/**
 * Modal-style shell for the admin create/edit forms.
 */
export function AdminFormDialog({
	open,
	onOpenChange,
	icon: Icon,
	title,
	subtitle,
	children,
}: AdminFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[90vh] w-[min(94vw,640px)] lg:max-w-190 flex-col gap-0 overflow-hidden rounded-[32px] border-none bg-white p-0 shadow-2xl"
			>
				<DialogHeader className="space-y-0 px-7 pb-5 pt-7 sm:px-9">
					<div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
						<span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/20">
							<Icon aria-hidden="true" className="size-6" />
						</span>
						<div className="min-w-0 text-left">
							<DialogTitle>
								<H2>{title}</H2>
							</DialogTitle>
							<P className="text-slate-500">{subtitle}</P>
						</div>
						<DialogClose asChild>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Fechar"
								className="cursor-pointer text-slate-900 hover:bg-transparent"
							>
								<X aria-hidden="true" className="size-8" />
							</Button>
						</DialogClose>
					</div>
					<DialogDescription className="sr-only">{subtitle}</DialogDescription>
				</DialogHeader>

				<div className="mx-7 h-px bg-slate-200 sm:mx-9" />

				{children}
			</DialogContent>
		</Dialog>
	);
}
