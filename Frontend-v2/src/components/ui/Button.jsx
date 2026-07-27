const VARIANTS = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
  cream: 'bg-white text-primary-700 hover:bg-cream-50 shadow-md shadow-ink-900/10',
  ghost: 'bg-white text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50',
  danger: 'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const Button = ({ as, variant = 'primary', size = 'md', className = '', children, ...rest }) => {
  const Tag = as || 'button';
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Button;
