import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label, 
  error, 
  helperText,
  className = '', 
  containerClassName = '',
  icon,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value || props.defaultValue;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border-2 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-slate-200 focus:border-indigo-500'
            }
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      
      {(error || helperText) && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-1.5 text-xs ${error ? 'text-red-600' : 'text-slate-500'} ml-1`}
        >
          {error || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
