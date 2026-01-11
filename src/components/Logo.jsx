import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src="/logo.png" 
      alt="ExtraHands Logo" 
      className={`${className} object-contain mix-blend-multiply brightness-110 contrast-125`} 
    />
  );
};

export default Logo;
