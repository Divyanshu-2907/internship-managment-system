import React from 'react';
import { Card } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      style={{ height: '100%' }}
    >
      <Card
        {...props}
        sx={{
          height: '100%',
          cursor: props.onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: props.onClick ? '0 8px 25px rgba(0,0,0,0.15)' : undefined,
          },
          ...props.sx
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard; 