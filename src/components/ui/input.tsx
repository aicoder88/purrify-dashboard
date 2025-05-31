import * as React from "react";
import { cn } from "@/lib/utils";
import type { InputProps } from "@/types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    ...props 
  }, ref) => {
    const inputId = React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className="w-full group">
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "block text-sm font-semibold mb-3 transition-colors duration-200",
              "text-white/90",
              isFocused && "text-gradient",
              error && "text-danger-400"
            )}
          >
            {label}
            {props.required && (
              <span className="text-danger-400 ml-1 text-base">*</span>
            )}
          </label>
        )}
        
        <div className="relative group">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <span className={cn(
                "text-white/50 transition-colors duration-200",
                isFocused && "text-primary-400",
                error && "text-danger-400"
              )}>
                {leftIcon}
              </span>
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              "input",
              "w-full h-12 px-4 py-3",
              "text-white placeholder:text-white/40",
              "bg-glass-light backdrop-blur-xl",
              "border border-white/15",
              "rounded-xl",
              "transition-all duration-300 ease-out",
              "focus:border-primary-400/60 focus:bg-glass-medium",
              "focus:shadow-glow-primary focus:outline-none",
              "hover:border-white/25 hover:bg-glass-medium",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              error && "border-danger-400/60 focus:border-danger-400 focus:shadow-glow-danger",
              "font-medium tracking-wide",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
              <span className={cn(
                "text-white/50 transition-colors duration-200",
                isFocused && "text-primary-400",
                error && "text-danger-400"
              )}>
                {rightIcon}
              </span>
            </div>
          )}

          {/* Focus ring effect */}
          <div className={cn(
            "absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none",
            "bg-gradient-to-r from-primary-500/20 to-accent-500/20",
            isFocused ? "opacity-100" : "opacity-0"
          )} />
        </div>
        
        {error && (
          <div className="mt-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-danger-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-danger-400">{error}</p>
          </div>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm font-medium text-white/60">{helperText}</p>
        )}
      </div>
    );
  }
);

// Enhanced Input variants
const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "bg-glass-subtle",
        "border-white/10",
        "focus:border-accent-400/60 focus:shadow-glow-accent",
        className
      )}
      leftIcon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      placeholder="Search..."
      {...props}
    />
  )
);

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={className}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/50 hover:text-white/80 transition-colors duration-200 p-1"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
SearchInput.displayName = "SearchInput";
PasswordInput.displayName = "PasswordInput";

export { Input, SearchInput, PasswordInput };