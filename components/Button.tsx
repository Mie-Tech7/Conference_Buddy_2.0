import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transform transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-secondary-500 to-secondary-600
      hover:from-secondary-400 hover:to-secondary-500
      text-white shadow-lg hover:shadow-secondary-500/30
      hover:scale-105
    `,
        secondary: `
      bg-gradient-to-r from-primary-700 to-primary-800
      hover:from-primary-600 hover:to-primary-700
      text-white shadow-lg hover:shadow-primary-500/30
      hover:scale-105
    `,
        outline: `
      border-2 border-white/20 text-white
      hover:border-white/40 hover:bg-white/10
      hover:scale-105
    `,
        ghost: `
      text-white/70 hover:text-white hover:bg-white/10
    `,
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-5 w-5"
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
            )}
            {icon && !loading && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
}
