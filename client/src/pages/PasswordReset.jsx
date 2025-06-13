import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  useTheme,
  Fade,
  Zoom,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';

// Validation schemas for each step
const emailSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const verificationSchema = yup.object({
  verificationCode: yup
    .string()
    .matches(/^\d{6}$/, 'Verification code must be 6 digits')
    .required('Verification code is required'),
});

const passwordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const steps = [
  { label: 'Enter Email', icon: EmailIcon },
  { label: 'Verify Code', icon: SecurityIcon },
  { label: 'New Password', icon: LockIcon },
];

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 450,
  margin: 'auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const StepIcon = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
}));

// Form Step Components
const EmailStep = ({ formik, onNext }) => (
  <Box>
    <Typography variant="h6" gutterBottom fontWeight={600}>
      Enter Your Email
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      We'll send a verification code to your email address.
    </Typography>
    <TextField
      fullWidth
      id="email"
      name="email"
      label="Email Address"
      type="email"
      value={formik.values.email}
      onChange={formik.handleChange}
      error={formik.touched.email && Boolean(formik.errors.email)}
      helperText={formik.touched.email && formik.errors.email}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EmailIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

const VerificationStep = ({ formik, onNext, resendCode, canResend, countdown }) => (
  <Box>
    <Typography variant="h6" gutterBottom fontWeight={600}>
      Enter Verification Code
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      Please enter the 6-digit code sent to your email.
    </Typography>
    <TextField
      fullWidth
      id="verificationCode"
      name="verificationCode"
      label="Verification Code"
      value={formik.values.verificationCode}
      onChange={formik.handleChange}
      error={formik.touched.verificationCode && Boolean(formik.errors.verificationCode)}
      helperText={formik.touched.verificationCode && formik.errors.verificationCode}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SecurityIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        Didn't receive the code?{' '}
        {canResend ? (
          <Link
            component="button"
            variant="body2"
            onClick={resendCode}
            sx={{ cursor: 'pointer' }}
          >
            Resend Code
          </Link>
        ) : (
          <Typography component="span" variant="body2" color="text.secondary">
            Resend code in {countdown}s
          </Typography>
        )}
      </Typography>
    </Box>
  </Box>
);

const PasswordStep = ({ formik, onNext, showPassword, setShowPassword }) => (
  <Box>
    <Typography variant="h6" gutterBottom fontWeight={600}>
      Create New Password
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      Please create a strong password for your account.
    </Typography>
    <TextField
      fullWidth
      id="newPassword"
      name="newPassword"
      label="New Password"
      type={showPassword ? 'text' : 'password'}
      value={formik.values.newPassword}
      onChange={formik.handleChange}
      error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
      helperText={formik.touched.newPassword && formik.errors.newPassword}
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
    <TextField
      fullWidth
      id="confirmPassword"
      name="confirmPassword"
      label="Confirm Password"
      type={showPassword ? 'text' : 'password'}
      value={formik.values.confirmPassword}
      onChange={formik.handleChange}
      error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
      helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
      sx={{ mt: 2 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

const PasswordReset = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: activeStep === 0 ? emailSchema : activeStep === 1 ? verificationSchema : passwordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Password reset successfully!');
        navigate('/login');
      } catch (error) {
        toast.error('Failed to reset password');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await formik.handleSubmit();
    } else {
      setActiveStep(prevStep => prevStep + 1);
      if (activeStep === 0) {
        setCanResend(false);
        setCountdown(60);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleResendCode = async () => {
    try {
      setCanResend(false);
      setCountdown(60);
      toast.info('Verification code sent to your email');
    } catch (error) {
      toast.error('Failed to send verification code');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <EmailStep formik={formik} onNext={handleNext} />;
      case 1:
        return (
          <VerificationStep
            formik={formik}
            onNext={handleNext}
            resendCode={handleResendCode}
            canResend={canResend}
            countdown={countdown}
          />
        );
      case 2:
        return (
          <PasswordStep
            formik={formik}
            onNext={handleNext}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <StyledPaper
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom align="center" fontWeight={700}>
                  Password Reset
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Follow the steps to reset your password
                </Typography>
              </Box>

              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      icon={
                        <StepIcon>
                          <step.icon />
                        </StepIcon>
                      }
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mb: 4 }}>
                {renderStepContent(activeStep)}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <AnimatedButton
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  delay={0.3}
                >
                  Back
                </AnimatedButton>
                <AnimatedButton
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || !formik.isValid}
                  delay={0.4}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    'Reset Password'
                  ) : (
                    'Next'
                  )}
                </AnimatedButton>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Back to Login
                </Link>
              </Box>
            </StyledPaper>
          </Box>
        </motion.div>
      </Container>
    </PageTransition>
  );
};

export default PasswordReset;