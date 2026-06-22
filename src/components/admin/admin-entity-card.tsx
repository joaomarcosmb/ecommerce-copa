import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { H3, P } from "@/components/typography";

interface AdminEntityCardProps {
	href: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

/** Large clickable card used on the admin selector screen. */
export function AdminEntityCard({
	href,
	icon: Icon,
	title,
	description,
}: AdminEntityCardProps) {
	return (
		<a href={href} className="group block">
			<Card
				hover
				className="min-h-100 cursor-pointer p-8 text-center flex flex-col justify-center"
			>
				<span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors duration-200 group-hover:bg-blue-700 group-hover:text-white">
					<Icon aria-hidden="true" className="size-8" />
				</span>
				<H3 className="mt-5 text-lg text-slate-900">{title}</H3>
				<P className="mt-2 text-slate-500">{description}</P>
			</Card>
		</a>
	);
}
