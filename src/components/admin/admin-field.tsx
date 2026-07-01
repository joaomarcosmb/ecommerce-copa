import type { FieldPath, FieldValues } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormInput,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface AdminFieldProps<TValues extends FieldValues> {
	name: FieldPath<TValues>;
	label: string;
	type?: "text" | "number";
	placeholder?: string;
	step?: string;
	optional?: boolean;
	className?: string;
}

/** Text/number input wired to react-hook-form, styled like the shared Input. */
export function AdminField<TValues extends FieldValues>({
	name,
	label,
	type = "text",
	placeholder,
	step,
	optional = false,
	className,
}: AdminFieldProps<TValues>) {
	return (
		<FormField<TValues>
			name={name}
			render={({ field }) => (
				<FormItem className={cn("space-y-2", className)}>
					<FormLabel>
						{label}
						{optional && (
							<span className="ml-1 font-normal text-slate-400">
								(opcional)
							</span>
						)}
					</FormLabel>
					<FormControl>
						<FormInput
							{...field}
							value={field.value ?? ""}
							type={type}
							inputMode={type === "number" ? "decimal" : undefined}
							step={step}
							placeholder={placeholder}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
