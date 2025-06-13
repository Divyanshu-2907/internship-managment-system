import React from 'react';
import { motion } from 'framer-motion';

const AnimatedIcon = ({ children, delay = 0, size = 'medium', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay,
        type: 'spring',
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2 }
      }}
      style={{ display: 'inline-flex' }}
    >
      {React.cloneElement(children, {
        ...props,
        sx: {
          fontSize: size === 'small' ? '1rem' : size === 'large' ? '2rem' : '1.5rem',
          ...props.sx
        }
      })}
    </motion.div>
  );
};

export default AnimatedIcon; 