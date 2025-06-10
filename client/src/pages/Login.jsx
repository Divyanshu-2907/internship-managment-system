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
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  maxWidth: theme.breakpoints.values.lg,
  margin: 'auto',
}));

const SplitContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '80vh',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[24],
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: 'auto',
  },
  mx: 'auto',
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
    opacity: 0.1,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4),
    minHeight: '300px',
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4),
  },
}));

const StyledLockIcon = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  '& svg': {
    fontSize: 48,
    color: theme.palette.common.white,
  },
}));

const SocialButton = styled(Button)(({ theme, provider }) => ({
  width: '100%',
  marginBottom: theme.spacing(1.5),
  textTransform: 'none',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: provider === 'google' 
    ? '#DB4437' 
    : provider === 'github' 
    ? '#333' 
    : '#0077B5',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: provider === 'google' 
      ? alpha('#DB4437', 0.9) 
      : provider === 'github' 
      ? alpha('#333', 0.9) 
      : alpha('#0077B5', 0.9),
    transform: 'translateY(-2px)',
    transition: 'all 0.2s',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
  },
}));

const PasswordRequirement = styled(Typography)(({ theme, met }) => ({
  display: 'flex',
  alignItems: 'center',
  color: met ? theme.palette.success.main : theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(0.5),
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: met ? theme.palette.success.main : theme.palette.text.secondary,
    marginRight: theme.spacing(1),
  },
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
    <StyledContainer maxWidth="lg">
      <SplitContainer>
        <LeftPanel>
          <StyledLockIcon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <LockIcon />
          </StyledLockIcon>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Welcome Back!
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Sign in to continue your internship journey
            </Typography>
          </motion.div>
          <Grid container spacing={3} sx={{ mt: 'auto' }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <FeatureCard>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <feature.icon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">{feature.title}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </LeftPanel>

        <RightPanel>
          <Box sx={{ maxWidth: 400, width: '100%', mx: 'auto' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Sign In
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Enter your credentials to access your account
              </Typography>

              <form onSubmit={formik.handleSubmit}>
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
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

                {formik.values.password && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {passwordRequirements.map((req, index) => (
                      <PasswordRequirement key={index} met={req.met}>
                        {req.label}
                      </PasswordRequirement>
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <Link component={RouterLink} to="/forgot-password" color="primary">
                    Forgot password?
                  </Link>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || isLocked}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    position: 'relative',
                    '&:disabled': {
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0.7,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isLocked ? (
                    `Try again in ${lockoutTime}s`
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Or continue with
                  </Typography>
                </Divider>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <SocialButton
                      provider="google"
                      onClick={() => handleSocialLogin('Google')}
                      startIcon={<GoogleIcon />}
                    >
                      Google
                    </SocialButton>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SocialButton
                      provider="github"
                      onClick={() => handleSocialLogin('GitHub')}
                      startIcon={<GitHubIcon />}
                    >
                      GitHub
                    </SocialButton>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SocialButton
                      provider="linkedin"
                      onClick={() => handleSocialLogin('LinkedIn')}
                      startIcon={<LinkedInIcon />}
                    >
                      LinkedIn
                    </SocialButton>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/signup" color="primary">
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </form>
            </motion.div>
          </Box>
        </RightPanel>
      </SplitContainer>
    </StyledContainer>
  );
};

export default Login;