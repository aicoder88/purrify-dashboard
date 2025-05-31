import * as React from "react";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    loading = false,
    icon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "btn";
    
    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      success: "btn-success",
      warning: "btn-warning",
      danger: "btn-danger",
      ghost: "btn-ghost",
      outline: "btn-outline",
      destructive: "btn-danger", // Alias for danger
    };
    
    const sizeClasses = {
      sm: "btn-sm",
      md: "btn-md", 
      lg: "btn-lg",
      xl: "btn-xl",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          loading && "opacity-50 cursor-not-allowed pointer-events-none",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        {!loading && icon && (
          <span className="flex items-center justify-center mr-2 transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
        <span className="relative z-10 font-medium tracking-wide">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };