import { cn } from "@/lib/utils";

function H1({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"font-['Big_Shoulders',sans-serif] text-[57px] leading-16 tracking-[-0.25px]",
				className,
			)}
			{...props}
		/>
	);
}

function H2({ className, ...props }: React.ComponentProps<"h2">) {
	return (
		<h2
			className={cn(
				"font-['Big_Shoulders',sans-serif] text-[28px] leading-9",
				className,
			)}
			{...props}
		/>
	);
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			className={cn("font-sans text-[16px] leading-6 font-medium", className)}
			{...props}
		/>
	);
}

function P({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"font-sans text-[14px] leading-5 tracking-[0.25px]",
				className,
			)}
			{...props}
		/>
	);
}

function BodySmall({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"font-sans text-[12px] leading-4 font-normal tracking-[0.4px]",
				className,
			)}
			{...props}
		/>
	);
}

function LabelLarge({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"font-sans text-[14px] leading-5 font-medium tracking-[0.1px]",
				className,
			)}
			{...props}
		/>
	);
}

function LabelMedium({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"font-sans text-[12px] leading-4 font-medium tracking-[0.5px]",
				className,
			)}
			{...props}
		/>
	);
}

function LabelSmall({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"font-sans text-[11px] leading-4 font-medium tracking-[0.5px]",
				className,
			)}
			{...props}
		/>
	);
}

export { H1, H2, H3, P, BodySmall, LabelLarge, LabelMedium, LabelSmall };
