import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export const SkeletonLine = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg h-4 ${className}`} />
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
    <div className="animate-pulse space-y-4">
      <div className="h-12 w-12 bg-slate-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className="h-4 bg-slate-200 rounded" 
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export default LoadingSpinner;
