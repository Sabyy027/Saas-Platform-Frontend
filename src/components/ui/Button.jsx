import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const buttonVariants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:shadow-indigo-200',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200',
  outline: 'bg-transparent text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:shadow-red-200'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg'
};

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon,
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 
        font-semibold rounded-xl 
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${buttonVariants[variant]} 
        ${buttonSizes[size]} 
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
