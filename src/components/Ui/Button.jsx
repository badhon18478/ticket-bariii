import { forwardRef, cloneElement } from 'react';

// cn utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Button variant styles
const getButtonVariantClass = (variant = 'default') => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  return variants[variant] || variants.default;
};

// Button size styles
const getButtonSizeClass = (size = 'default') => {
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };
  return sizes[size] || sizes.default;
};

const Button = forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClass =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

    const buttonClass = cn(
      baseClass,
      getButtonVariantClass(variant),
      getButtonSizeClass(size),
      className
    );

    if (asChild && children) {
      return cloneElement(children, {
        className: cn(buttonClass, children.props.className),
        ref,
        ...props,
      });
    }

    return (
      <button className={buttonClass} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
