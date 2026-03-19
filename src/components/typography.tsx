import React from "react";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

function H1({ children, className = "" }: TypographyProps) {
  return (
    <h1
      className={`font-['Big Shoulders',sans-serif] text-[57px] leading-16 tracking-[-0.25px] ${className}`}
    >
      {children}
    </h1>
  );
}

function H2({ children, className = "" }: TypographyProps) {
  return (
    <h2
      className={`font-['Big Shoulders',sans-serif] text-[28px] leading-9 ${className}`}
    >
      {children}
    </h2>
  );
}

function H3({ children, className = "" }: TypographyProps) {
  return (
    <h3
      className={`font-['Poppins',sans-serif] text-[16px] leading-6 font-medium ${className}`}
    >
      {children}
    </h3>
  );
}

function P({ children, className = "" }: TypographyProps) {
  return (
    <p
      className={`font-['Poppins',sans-serif] text-[14px] leading-5 tracking-[0.25px] ${className}`}
    >
      {children}
    </p>
  );
}

function BodySmall({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-[12px] leading-4 font-['Poppins',sans-serif] font-normal tracking-[0.4px] ${className}`}>
      {children}
    </p>
  );
}

function LabelLarge({ children, className = "" }: TypographyProps) {
  return (
    <span
      className={`text-[14px] leading-5 font-['Poppins',sans-serif] font-medium tracking-[0.1px] ${className}`}
    >
      {children}
    </span>
  );
}

function LabelMedium({ children, className = "" }: TypographyProps) {
  return (
    <span
      className={`text-[12px] leading-4 font-['Poppins',sans-serif] font-medium tracking-[0.5px] ${className}`}
    >
      {children}
    </span>
  );
}

function LabelSmall({ children, className = "" }: TypographyProps) {
  return (
    <span
      className={`text-[11px] leading-4 font-['Poppins',sans-serif] font-medium tracking-[0.5px] ${className}`}
    >
      {children}
    </span>
  );
}

export { H1, H2, H3, P, BodySmall, LabelLarge, LabelMedium, LabelSmall };
