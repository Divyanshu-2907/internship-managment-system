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
    <Typography variant="h6" gutterBottom>
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
    <Typography variant="h6" gutterBottom>
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
    <Typography variant="h6" gutterBottom>
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
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const formik = useFormik({
    initialValues: {
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: [
      emailSchema,
      verificationSchema,
      passwordSchema,
    ][activeStep],
    onSubmit: async (values) => {
      setLoading(true);
      setError('');

      try {
        switch (activeStep) {
          case 0:
            // Send verification code
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Verification code sent to your email');
            setCanResend(false);
            setCountdown(60);
            break;

          case 1:
            // Verify code
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (values.verificationCode !== '123456') {
              throw new Error('Invalid verification code');
            }
            break;

          case 2:
            // Reset password
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Password reset successful');
            navigate('/login');
            return;
        }

        setActiveStep(prevStep => prevStep + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    setError('');
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Verification code resent to your email');
      setCanResend(false);
      setCountdown(60);
    } catch (err) {
      toast.error('Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <EmailStep formik={formik} onNext={formik.handleSubmit} />;
      case 1:
        return (
          <VerificationStep
            formik={formik}
            onNext={formik.handleSubmit}
            resendCode={handleResendCode}
            canResend={canResend}
            countdown={countdown}
          />
        );
      case 2:
        return (
          <PasswordStep
            formik={formik}
            onNext={formik.handleSubmit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', py: 4, px: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Login
        </Button>

        <StyledPaper>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Reset Password
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
            Follow the steps below to reset your password
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <StepIcon>
                      <step.icon />
                    </StepIcon>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Fade in={true}>
            <Box>
              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  icon={<ErrorIcon />}
                >
                  {error}
                </Alert>
              )}

              {renderStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0 || loading}
                  startIcon={<ArrowBackIcon />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={formik.handleSubmit}
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {activeStep === steps.length - 1 ? 'Reset Password' : 'Continue'}
                </Button>
              </Box>
            </Box>
          </Fade>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default PasswordReset;