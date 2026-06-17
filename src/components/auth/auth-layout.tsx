import type { ReactNode } from "react";

import { FormHeader, FormLead, FormTitle } from "@/components/ui/form";

interface AuthLayoutProps {
	title: string;
	lead: string;
	children: ReactNode;
	footer: ReactNode;
	wide?: boolean;
}

export function AuthLayout({
	title,
	lead,
	children,
	footer,
	wide = false,
}: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
			<h1 className="mb-6 font-big-shoulders text-4xl font-black tracking-tight text-slate-900 text-center">
				CupStickers
			</h1>
			<div className={wide ? "w-full max-w-4xl" : "w-full max-w-md"}>
				<div className="overflow-hidden rounded-[28px] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)]">
					<div className="flex h-1">
						<div className="flex-1 bg-blue-700" />
						<div className="flex-1 bg-green-500" />
						<div className="flex-1 bg-red-700" />
					</div>
					<div className="w-full bg-white px-8 py-8 sm:px-9">
						<FormHeader className="flex flex-col items-center">
							<FormTitle asChild>
								<h2>{title}</h2>
							</FormTitle>
							<FormLead className="text-center">{lead}</FormLead>
						</FormHeader>
						{children}
					</div>
				</div>
				<p className="mt-6 text-center font-['Poppins',sans-serif] text-[14px] leading-5 text-slate-600">
					{footer}
				</p>
			</div>
		</div>
	);
}
