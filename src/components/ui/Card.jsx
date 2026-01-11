import { motion } from 'framer-motion';

const cardVariants = {
  default: 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
  elevated: 'bg-white shadow-lg hover:shadow-xl',
  outlined: 'bg-white border-2 border-slate-200 hover:border-indigo-300',
  glass: 'bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-lg'
};

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  hoverable = true,
  onClick,
  ...props 
}) => {
  const MotionComponent = hoverable ? motion.div : 'div';
  const motionProps = hoverable ? {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    transition: { duration: 0.3 }
  } : {};

  return (
    <MotionComponent
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${cardVariants[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-slate-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-500 mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 flex items-center gap-3 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
