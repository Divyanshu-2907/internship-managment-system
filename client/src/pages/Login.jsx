import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Divider,
  useTheme,
  IconButton,
  InputAdornment,
  Tooltip,
  Fade,
  Zoom,
  Card,
  CardContent,
  Grid,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LockOutlined as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedIcon from '../components/AnimatedIcon';
import PageTransition from '../components/PageTransition';

// Validation schema
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
});

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
}));

const SplitContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  minHeight: '600px',
  maxWidth: '1000px',
  width: '100%',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: 'auto',
    maxWidth: '500px',
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1.2,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/pattern.svg")',
    opacity: 0.05,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
    minHeight: '200px',
    flex: 'none',
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

const StyledLockIcon = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  '& svg': {
    fontSize: 48,
    color: theme.palette.common.white,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
}));

const SocialButton = styled(Button)(({ theme, provider }) => {
  const colors = {
    google: '#DB4437',
    github: '#333333',
    linkedin: '#0077B5',
  };
  
  return {
    width: '100%',
    marginBottom: theme.spacing(1.5),
    textTransform: 'none',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    backgroundColor: colors[provider] || theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(colors[provider] || theme.palette.primary.main, 0.9),
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha(colors[provider] || theme.palette.primary.main, 0.4)}`,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  };
});

const FeatureCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
}));

const PasswordRequirement = styled(Typography)(({ theme, met }) => ({
  display: 'flex',
  alignItems: 'center',
  color: met ? theme.palette.success.main : theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(0.5),
  transition: 'color 0.3s ease',
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: met ? theme.palette.success.main : theme.palette.text.secondary,
    marginRight: theme.spacing(1),
    transition: 'background-color 0.3s ease',
  },
}));

const FloatingShape = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  maxWidth: '400px',
  width: '100%',
  margin: '0 auto',
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
}));

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { loading, error } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for stored lockout time on component mount
  useEffect(() => {
    const storedLockoutTime = localStorage.getItem('loginLockoutTime');
    if (storedLockoutTime) {
      const remainingTime = Math.ceil((parseInt(storedLockoutTime) - Date.now()) / 1000);
      if (remainingTime > 0) {
        setIsLocked(true);
        setLockoutTime(remainingTime);
        const timer = setInterval(() => {
          setLockoutTime(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsLocked(false);
              localStorage.removeItem('loginLockoutTime');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      } else {
        localStorage.removeItem('loginLockoutTime');
      }
    }
  }, []);

  const handleLoginFailure = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    if (newAttempts >= 3) {
      const lockoutDuration = 300; // 5 minutes in seconds
      setIsLocked(true);
      setLockoutTime(lockoutDuration);
      localStorage.setItem('loginLockoutTime', Date.now() + lockoutDuration * 1000);
      
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLocked(false);
            localStorage.removeItem('loginLockoutTime');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (isLocked) {
        toast.error(`Account is locked. Please try again in ${lockoutTime} seconds.`);
        return;
      }

      try {
        dispatch(loginStart());
        // TODO: Replace with actual API call
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (values.email === 'test@example.com' && values.password === 'Test@123') {
              resolve({
                user: {
                  id: '1',
                  email: values.email,
                  name: 'Test User',
                  role: 'intern',
                },
                token: 'dummy-token',
              });
            } else {
              reject(new Error('Invalid credentials'));
            }
          }, 1000);
        });

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', values.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        dispatch(loginSuccess(response));
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (err) {
        dispatch(loginFailure('Invalid email or password'));
        handleLoginFailure();
        toast.error('Invalid email or password');
      }
    },
  });

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  const features = [
    {
      icon: SchoolIcon,
      title: 'Internship Management',
      description: 'Track your progress, submit reports, and manage your internship journey.',
    },
    {
      icon: WorkIcon,
      title: 'Task Management',
      description: 'Organize and track your tasks, deadlines, and achievements.',
    },
    {
      icon: SecurityIcon,
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard security measures.',
    },
  ];

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formik.values.password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formik.values.password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(formik.values.password) },
    { label: 'One number', met: /\d/.test(formik.values.password) },
    { label: 'One special character', met: /[@$!%*?&]/.test(formik.values.password) },
  ];

  return (
    <PageTransition>
      <MainContainer>
        <SplitContainer
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        >
          <LeftPanel>
            {/* Floating shapes for visual appeal */}
            <FloatingShape
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 120,
                height: 120,
                top: '10%',
                left: '10%',
                opacity: 0.6,
              }}
            />
            <FloatingShape
              animate={{ 
                x: [0, -20, 0],
                y: [0, 30, 0],
                rotate: [0, -180, -360]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 80,
                height: 80,
                top: '60%',
                right: '15%',
                opacity: 0.4,
              }}
            />

            <WelcomeSection>
              <StyledLockIcon
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
              >
                <AnimatedIcon size="large">
                  <LockIcon />
                </AnimatedIcon>
              </StyledLockIcon>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Welcome Back!
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  Sign in to continue your internship journey
                </Typography>
              </motion.div>
            </WelcomeSection>

            <FeaturesSection>
              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={12} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -2 }}
                    >
                      <FeatureCard>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AnimatedIcon delay={0.1}>
                              <feature.icon sx={{ mr: 2, fontSize: '1.5rem', color: 'inherit' }} />
                            </AnimatedIcon>
                            <Typography variant="h6" sx={{ color: 'inherit', fontWeight: 600 }}>
                              {feature.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </FeatureCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </FeaturesSection>
          </LeftPanel>

          <RightPanel>
            <FormContainer>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      margin="normal"
                      size="large"
                      sx={
                        {
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AnimatedIcon>
                              <EmailIcon color="action" />
                            </AnimatedIcon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      margin="normal"
                      size="large"
                      sx={
                        {
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AnimatedIcon>
                              <LockIcon color="action" />
                            </AnimatedIcon>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  {/* Password requirements */}
                  {formik.values.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ mt: 1, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom fontWeight={600} color="text.primary">
                          Password Requirements:
                        </Typography>
                        {passwordRequirements.map((req, index) => (
                          <PasswordRequirement key={index} met={req.met}>
                            {req.label}
                          </PasswordRequirement>
                        ))}
                      </Box>
                    </motion.div>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          name="rememberMe"
                          color="primary"
                        />
                      }
                      label="Remember me"
                    />
                    <Link component={RouterLink} to="/forgot-password" variant="body2" color="primary">
                      Forgot password?
                    </Link>
                  </Box>

                  {error && (
                    <Fade in={!!error}>
                      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <AnimatedButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || isLocked}
                    delay={0.8}
                    sx={
                      {
                        mb: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }
                    }
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isLocked ? (
                      `Locked (${lockoutTime}s)`
                    ) : (
                      'Sign In'
                    )}
                  </AnimatedButton>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR CONTINUE WITH
                    </Typography>
                  </Divider>

                  <Box sx={{ mb: 3 }}>
                    <SocialButton
                      provider="google"
                      startIcon={<GoogleIcon />}
                      onClick={() => handleSocialLogin('Google')}
                      delay={0.9}
                    >
                      Continue with Google
                    </SocialButton>
                    <SocialButton
                      provider="github"
                      startIcon={<GitHubIcon />}
                      onClick={() => handleSocialLogin('GitHub')}
                      delay={1.0}
                    >
                      Continue with GitHub
                    </SocialButton>
                    <SocialButton
                      provider="linkedin"
                      startIcon={<LinkedInIcon />}
                      onClick={() => handleSocialLogin('LinkedIn')}
                      delay={1.1}
                    >
                      Continue with LinkedIn
                    </SocialButton>
                  </Box>

                  <Typography variant="body1" align="center" color="text.secondary">
                    Don't have an account?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/register" 
                      variant="body1" 
                      color="primary"
                      sx={{ fontWeight: 600, textDecoration: 'none' }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </form>
              </motion.div>
            </FormContainer>
          </RightPanel>
        </SplitContainer>
      </MainContainer>
    </PageTransition>
  );
};

export default Login;