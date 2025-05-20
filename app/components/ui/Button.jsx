import { forwardRef } from "react"
import Link from "next/link"
import { cn } from "../../lib/utils"

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      href,
      fullWidth = false,
      rounded = "md",
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText,
      spinner,
      isExternal = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Base classes
    const baseClasses = cn(
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      {
        "w-full": fullWidth,
        "rounded-none": rounded === "none",
        "rounded-sm": rounded === "sm",
        "rounded-md": rounded === "md",
        "rounded-lg": rounded === "lg",
        "rounded-full": rounded === "full",
      },
    )

    // Size classes
    const sizeClasses = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    }

    // Variant classes
    const variantClasses = {
      primary: "bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 focus-visible:ring-neutral-950",
      secondary:
        "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-neutral-300",
      outline:
        "border border-neutral-300 text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-300",
      ghost: "text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-300",
      link: "text-neutral-900 underline-offset-4 hover:underline focus-visible:ring-neutral-300 p-0 h-auto",
    }

    // Combine all classes
    const buttonClasses = cn(baseClasses, sizeClasses[size], variantClasses[variant], className)

    // Loading state
    const loadingState = isLoading ? (
      <>
        {spinner || (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {loadingText || children}
      </>
    ) : (
      <>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    )

    // If href is provided, render as Link
    if (href) {
      return (
        <Link
          href={href}
          className={buttonClasses}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {loadingState}
        </Link>
      )
    }

    // Otherwise render as button
    return (
      <button ref={ref} className={buttonClasses} disabled={isLoading || props.disabled} {...props}>
        {loadingState}
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
