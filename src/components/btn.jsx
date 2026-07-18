import React from 'react'

function btn({
  children,
  type = "button",
  variant = "primary",
  className = '',
  classname = '', // keeping for backward compatibility in this codebase
  ...props
}) {
  const baseStyle = "px-6 py-3.5 rounded-[14px] text-sm font-medium transition-all duration-300 flex items-center justify-center";
  const variants = {
    primary: "bg-[var(--color-primary-text)] text-white hover:bg-black hover:shadow-lg",
    secondary: "bg-transparent border border-[var(--color-border-light)] text-[var(--color-primary-text)] hover:border-[var(--color-primary-text)] hover:bg-white"
  };

  const finalClassName = `${baseStyle} ${variants[variant] || variants.primary} ${className || classname}`;

  return (
    <button
      type={type}
      className={finalClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export default btn
