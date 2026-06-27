"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import {
	Controller,
	FormProvider,
	useFormContext,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name?: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

const FormItemContext = React.createContext<{ id: string }>({ id: "" });

function FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
}

function useFormField() {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const form = useFormContext();

	const { id } = itemContext;

	if (!fieldContext.name) {
		return {
			id,
			name: undefined,
			formItemId: `${id}-item`,
			formDescriptionId: `${id}-description`,
			formMessageId: `${id}-message`,
			invalid: false,
			isDirty: false,
			isTouched: false,
			isValidating: false,
			error: undefined,
		};
	}

	const fieldState = form.getFieldState(fieldContext.name, form.formState);

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-item`,
		formDescriptionId: `${id}-description`,
		formMessageId: `${id}-message`,
		...fieldState,
	};
}

function FormSurface({ className, ...props }: React.ComponentProps<"form">) {
	return (
		<form
			data-slot="form"
			className={cn(
				"w-full rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)] sm:px-9",
				className,
			)}
			{...props}
		/>
	);
}

function FormHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="form-header"
			className={cn("mb-8 space-y-2", className)}
			{...props}
		/>
	);
}

function FormTitle({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"h3"> & { asChild?: boolean }) {
	const Comp = asChild ? Slot.Root : "h3";
	return (
		<Comp
			data-slot="form-title"
			className={cn(
				"font-sans text-[18px] leading-7 font-semibold text-slate-950",
				className,
			)}
			{...props}
		/>
	);
}

function FormLead({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="form-lead"
			className={cn(
				"max-w-[48ch] font-sans text-[14px] leading-6 text-slate-500 -mt-2",
				className,
			)}
			{...props}
		/>
	);
}

function FormBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="form-body"
			className={cn("space-y-7", className)}
			{...props}
		/>
	);
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				data-slot="form-item"
				className={cn("space-y-3", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
}

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
	const { error, formItemId } = useFormField();

	return (
		<label
			data-slot="form-label"
			htmlFor={formItemId}
			className={cn(
				"block font-sans text-[14px] leading-6 font-semibold text-slate-950",
				error && "text-red-700",
				className,
			)}
			{...props}
		/>
	);
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot.Root>) {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField();

	return (
		<Slot.Root
			data-slot="form-control"
			id={formItemId}
			aria-describedby={
				error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
			}
			aria-invalid={Boolean(error)}
			{...props}
		/>
	);
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	const { formDescriptionId } = useFormField();

	return (
		<p
			data-slot="form-description"
			id={formDescriptionId}
			className={cn(
				"font-sans text-[13px] leading-6 text-slate-500",
				className,
			)}
			{...props}
		/>
	);
}

function FormMessage({
	className,
	children,
	...props
}: React.ComponentProps<"p">) {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error.message ?? "") : children;

	if (!body) {
		return null;
	}

	return (
		<p
			data-slot="form-message"
			id={formMessageId}
			className={cn("font-sans text-[12px] leading-5 text-red-700", className)}
			{...props}
		>
			{body}
		</p>
	);
}

function FormTextarea({
	className,
	...props
}: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="form-textarea"
			className={cn(
				"min-h-40 w-full resize-none rounded-[18px] border border-slate-200 bg-white px-4 py-4",
				"font-sans text-[14px] leading-6 text-slate-700 placeholder:text-slate-400",
				"shadow-sm transition-[border-color,box-shadow] duration-200",
				"focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function FormMetaRow({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="form-meta-row"
			className={cn(
				"flex items-center justify-between gap-3 font-sans text-[12px] leading-5 text-slate-500",
				className,
			)}
			{...props}
		/>
	);
}

function FormActions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="form-actions"
			className={cn("flex items-center gap-4 pt-1", className)}
			{...props}
		/>
	);
}

export {
	Form,
	FormActions,
	FormBody,
	FormControl,
	FormDescription,
	FormField,
	FormHeader,
	FormItem,
	FormLabel,
	FormLead,
	FormMessage,
	FormMetaRow,
	FormSurface,
	FormTextarea,
	FormTitle,
};
