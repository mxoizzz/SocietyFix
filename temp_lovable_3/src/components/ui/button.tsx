import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border border-border bg-background text-foreground hover:bg-muted",
        outline: "border border-border bg-background text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        quiet: "text-muted-foreground hover:bg-muted hover:text-foreground",
        vote: "border border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary",
        voted: "border border-primary bg-secondary text-primary",
      },
      size: { default: "h-11", sm: "h-9 min-h-9 px-3 text-xs", lg: "h-12 px-7", icon: "h-10 min-h-10 w-10 px-0", compact: "h-9 min-h-9 px-3 text-xs", wide: "h-12 w-full" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);

Button.displayName = "Button";
