import * as React from "react";

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
          className="text-[14px] leading-5 font-['Poppins',sans-serif] font-medium text-slate-900"
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
          className={`
            w-full px-4 py-2 rounded-xl 
            border border-slate-200 bg-white shadow-sm
            text-[14px] leading-5 font-['Poppins',sans-serif] text-slate-900
            placeholder:text-slate-400
            focus-visible:border-blue-600 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1
            transition-[background-color,border-color,box-shadow] duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? "pl-12" : ""}
            ${error ? "border-red-600 focus-visible:border-red-600 focus-visible:ring-red-200" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p
          id={errorId}
          className="text-[12px] leading-4 font-['Poppins',sans-serif] text-red-700"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={helperTextId}
          className="text-[12px] leading-4 font-['Poppins',sans-serif] text-slate-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export { Input };
