import * as React from "react";

import { cn } from "@/lib/utils";

interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
}

function Checkbox({ label, className = "", ...props }: CheckboxProps) {
	return (
		<label className="flex items-center gap-2 cursor-pointer group">
			<div className="relative flex items-center">
				<input
					type="checkbox"
					className={cn(
						"size-5 appearance-none rounded border-2 border-slate-400",
						"checked:border-blue-600 checked:bg-blue-600",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2",
						"transition-[background-color,border-color,box-shadow] duration-200",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						className,
					)}
					{...props}
				/>
			</div>
			{label && (
				<span className="font-['Poppins',sans-serif] text-[14px] leading-5 text-slate-900 transition-colors group-hover:text-blue-700">
					{label}
				</span>
			)}
		</label>
	);
}

export { Checkbox };
