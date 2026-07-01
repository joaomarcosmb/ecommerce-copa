import type { FieldPath, FieldValues } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormInput,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

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
			render={({ field }) => (
				<FormItem className="space-y-2">
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<FormInput
							{...field}
							value={field.value ?? ""}
							type={type}
							placeholder={placeholder}
							autoComplete={autoComplete}
							spellCheck={type === "email" ? false : undefined}
							onChange={(e) =>
								field.onChange(mask ? mask(e.target.value) : e.target.value)
							}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
