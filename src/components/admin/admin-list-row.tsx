import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabelLarge, P } from "@/components/typography";

interface AdminListRowProps {
	thumbnail?: string;
	largeImage?: boolean;
	title: string;
	subtitle?: ReactNode;
	editLabel: string;
	deleteLabel: string;
	onEdit: () => void;
	onDelete: () => void;
}

/** A single row in an admin listing: optional thumbnail, content, and actions. */
export function AdminListRow({
	thumbnail,
	largeImage = false,
	title,
	subtitle,
	editLabel,
	deleteLabel,
	onEdit,
	onDelete,
}: AdminListRowProps) {
	if (largeImage) {
		return (
			<Card className="border-transparent p-6 shadow-none">
				<div className="flex items-start gap-4">
					{thumbnail && (
						<img
							src={thumbnail}
							alt=""
							className="size-40 shrink-0 rounded-md object-cover"
						/>
					)}
					<div className="min-w-0 flex-1">
						<LabelLarge className="block text-slate-900">{title}</LabelLarge>
						{subtitle && <P className="mt-1 text-slate-500">{subtitle}</P>}
					</div>
					<div className="flex shrink-0 items-center gap-1.5">
						<Button
							variant="ghost"
							size="icon-sm"
							className="cursor-pointer"
							aria-label={editLabel}
							onClick={onEdit}
						>
							<Pencil aria-hidden="true" className="size-4.5" />
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							className="cursor-pointer text-red-700 hover:bg-red-50"
							aria-label={deleteLabel}
							onClick={onDelete}
						>
							<Trash2 aria-hidden="true" className="size-4.5" />
						</Button>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<div className="flex items-center gap-4 p-4">
			{thumbnail && (
				<img
					src={thumbnail}
					alt=""
					className="size-14 shrink-0 rounded-xl object-cover"
				/>
			)}
			<div className="min-w-0 flex-1">
				<p className="truncate font-['Poppins',sans-serif] text-[14px] leading-5 font-medium text-slate-900">
					{title}
				</p>
				{subtitle && (
					<div className="mt-0.5 truncate text-[13px] leading-5 text-slate-500">
						{subtitle}
					</div>
				)}
			</div>
			<div className="flex shrink-0 items-center gap-1.5">
				<Button
					variant="ghost"
					size="icon-sm"
					className="cursor-pointer"
					aria-label={editLabel}
					onClick={onEdit}
				>
					<Pencil aria-hidden="true" className="size-4.5" />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					className="cursor-pointer text-red-700 hover:bg-red-50"
					aria-label={deleteLabel}
					onClick={onDelete}
				>
					<Trash2 aria-hidden="true" className="size-4.5" />
				</Button>
			</div>
		</div>
	);
}
