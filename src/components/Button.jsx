import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
    children,
    className,
    variant = 'secondary',
    size = 'regular',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
        primary: 'bg-pink-200 text-neutrals-0 hover:bg-pink-300 border border-transparent focus:ring-pink-200',
        secondary: 'bg-neutrals-0 text-neutrals-500 border border-neutrals-200 hover:bg-neutrals-50 focus:ring-neutrals-200',
        ghost: 'bg-transparent text-neutrals-500 hover:bg-neutrals-50 focus:ring-neutrals-200',
    };

    // Logic: 
    // "buttons with height of bellow 32px should be 'Small'" -> Size Small (h-7 = 28px)
    // "buttons with height of bellow 24px should be 'Mini'" -> Size Mini (h-5 = 20px)

    const sizes = {
        large: 'btn-large text-base font-medium',
        regular: 'btn-regular text-sm font-medium',
        small: 'btn-small text-sm font-medium',
        mini: 'btn-mini text-xs font-medium',
    };

    return (
        <button
            type="button"
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};
