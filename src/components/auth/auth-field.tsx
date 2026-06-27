import type { FieldPath, FieldValues } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface AuthFieldProps<TValues extends FieldValues> {
	name: FieldPath<TValues>;
	label: string;
	type?: "text" | "email" | "password" | "date";
	placeholder?: string;
	autoComplete?: string;
	mask?: (value: string) => string;
}

export function AuthField<TValues extends FieldValues>({
	name,
	label,
	type = "text",
	placeholder,
	autoComplete,
	mask,
}: AuthFieldProps<TValues>) {
	return (
		<FormField<TValues>
			name={name}
			render={({ field, fieldState }) => (
				<FormItem className="space-y-2">
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<input
							{...field}
							value={field.value ?? ""}
							type={type}
							placeholder={placeholder}
							autoComplete={autoComplete}
							spellCheck={type === "email" ? false : undefined}
							onChange={(e) =>
								field.onChange(mask ? mask(e.target.value) : e.target.value)
							}
							className={cn(
								"w-full rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm",
								"text-[14px] leading-5 font-sans text-slate-900 placeholder:text-slate-400",
								"focus-visible:border-blue-600 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1",
								"transition-[background-color,border-color,box-shadow] duration-200",
								"disabled:cursor-not-allowed disabled:opacity-50",
								fieldState.error &&
									"border-red-600 focus-visible:border-red-600 focus-visible:ring-red-200",
							)}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
