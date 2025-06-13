import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="80vh"
            textAlign="center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                fontWeight={700}
                sx={{ 
                  fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                404
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                fontWeight={600}
              >
                Page Not Found
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph 
                sx={{ mb: 4, maxWidth: 500 }}
              >
                The page you are looking for does not exist or has been moved.
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <AnimatedButton 
                variant="contained" 
                onClick={() => navigate('/')}
                delay={0.9}
                size="large"
              >
                Go to Home
              </AnimatedButton>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </PageTransition>
  );
};

export default NotFound;