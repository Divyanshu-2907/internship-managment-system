import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedButton = React.forwardRef(({ children, delay = 0, ...props }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        ref={ref}
        {...props}
        sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          ...props.sx
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton; 