import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Autocomplete,
  CircularProgress,
  Container,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';

const steps = ['Personal Information', 'Skills & Education', 'Internship Details'];

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

const Onboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      skills: [],
      education: '',
      institution: '',
      department: '',
      startDate: '',
      endDate: '',
    },
    validationSchema: yup.object({
      firstName: yup.string().required('Required'),
      lastName: yup.string().required('Required'),
      email: yup.string().email('Invalid email').required('Required'),
      phone: yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Onboarding completed successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to complete onboarding');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ py: 4 }}>
            <StyledPaper
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h4" gutterBottom align="center" fontWeight={700}>
                Internship Onboarding
              </Typography>
              
              <Stepper activeStep={activeStep} sx={{ my: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  {activeStep === 0 && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="firstName"
                          name="firstName"
                          label="First Name"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                          helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="lastName"
                          name="lastName"
                          label="Last Name"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                          helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="email"
                          name="email"
                          label="Email"
                          type="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          error={formik.touched.email && Boolean(formik.errors.email)}
                          helperText={formik.touched.email && formik.errors.email}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="phone"
                          name="phone"
                          label="Phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          error={formik.touched.phone && Boolean(formik.errors.phone)}
                          helperText={formik.touched.phone && formik.errors.phone}
                        />
                      </Grid>
                    </>
                  )}

                  {activeStep === 1 && (
                    <>
                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          id="skills"
                          options={['React', 'JavaScript', 'Python', 'Java']}
                          value={formik.values.skills}
                          onChange={(_, newValue) => formik.setFieldValue('skills', newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Skills"
                              placeholder="Select your skills"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="education"
                          name="education"
                          label="Education Level"
                          value={formik.values.education}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="institution"
                          name="institution"
                          label="Institution"
                          value={formik.values.institution}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </>
                  )}

                  {activeStep === 2 && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="department"
                          name="department"
                          label="Department"
                          value={formik.values.department}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="startDate"
                          name="startDate"
                          label="Start Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={formik.values.startDate}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="endDate"
                          name="endDate"
                          label="End Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={formik.values.endDate}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <AnimatedButton
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    delay={0.3}
                  >
                    Back
                  </AnimatedButton>
                  <AnimatedButton
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    delay={0.4}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : activeStep === steps.length - 1 ? (
                      'Complete'
                    ) : (
                      'Next'
                    )}
                  </AnimatedButton>
                </Box>
              </form>
            </StyledPaper>
          </Box>
        </motion.div>
      </Container>
    </PageTransition>
  );
};

export default Onboarding; 