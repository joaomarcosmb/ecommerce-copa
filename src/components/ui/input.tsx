import * as React from "react";

import { cn } from "@/lib/utils";
import { fieldErrorClassName, fieldInputClassName } from "@/components/ui/form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
	icon?: React.ReactNode;
}

function Input({
	label,
	error,
	helperText,
	icon,
	className = "",
	id,
	...props
}: InputProps) {
	const fallbackId = React.useId();
	const inputId = id ?? fallbackId;
	const errorId = error ? `${inputId}-error` : undefined;
	const helperTextId = helperText && !error ? `${inputId}-helper` : undefined;
	const descriptionId = errorId ?? helperTextId;
	const spellCheck =
		props.spellCheck ?? (props.type === "email" ? false : props.spellCheck);

	return (
		<div className="flex flex-col gap-2 w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="text-[14px] leading-5 font-sans font-medium text-slate-900"
				>
					{label}
				</label>
			)}
			<div className="relative">
				{icon && (
					<div
						aria-hidden="true"
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
					>
						{icon}
					</div>
				)}
				<input
					id={inputId}
					aria-invalid={Boolean(error)}
					aria-describedby={descriptionId}
					spellCheck={spellCheck}
					className={cn(
						fieldInputClassName,
						icon && "pl-12",
						error && fieldErrorClassName,
						className,
					)}
					{...props}
				/>
			</div>
			{error && (
				<p
					id={errorId}
					className="text-[12px] leading-4 font-sans text-red-700"
				>
					{error}
				</p>
			)}
			{helperText && !error && (
				<p
					id={helperTextId}
					className="text-[12px] leading-4 font-sans text-slate-400"
				>
					{helperText}
				</p>
			)}
		</div>
	);
}

export { Input };
