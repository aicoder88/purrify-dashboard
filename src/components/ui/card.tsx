import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  variant?: "default" | "glass" | "glass-strong" | "glass-subtle";
  glow?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, variant = "glass", glow = false, children, ...props }, ref) => {
    const variantClasses = {
      default: "card",
      glass: "glass-card",
      "glass-strong": "glass-card bg-glass-strong",
      "glass-subtle": "glass-card bg-glass-light",
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          hover && "glass-card-hover",
          glow && "glow-primary",
          "group transition-all duration-300 ease-out",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-2 p-6 pb-4",
        "border-b border-white/10",
        "relative",
        className
      )}
      {...props}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  )
);

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-bold leading-tight tracking-tight",
        "text-white",
        "group-hover:text-gradient transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-sm font-medium",
        "text-white/70",
        "group-hover:text-white/90 transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between p-6 pt-4",
        "border-t border-white/10",
        "relative",
        className
      )}
      {...props}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  )
);

// Enhanced Card variants for specific use cases
const GlowCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-500/20 before:to-accent-500/20 before:opacity-0 before:transition-opacity before:duration-500",
        "hover:before:opacity-100",
        className
      )}
      hover
      glow
      {...props}
    >
      {children}
    </Card>
  )
);

const MetricCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "metric-card",
        "relative overflow-hidden",
        "group cursor-pointer",
        className
      )}
      hover
      {...props}
    >
      {children}
    </Card>
  )
);

const FeatureCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        "border-2 border-transparent",
        "hover:border-primary-500/30",
        "transition-all duration-500 ease-out",
        "group cursor-pointer",
        className
      )}
      variant="glass-strong"
      hover
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  )
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
GlowCard.displayName = "GlowCard";
MetricCard.displayName = "MetricCard";
FeatureCard.displayName = "FeatureCard";

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  GlowCard,
  MetricCard,
  FeatureCard
};