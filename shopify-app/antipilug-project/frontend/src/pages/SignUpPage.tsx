import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Paper,
  Link,
  Grid,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import './styles/SignUpPage.scss';
import { getBackgroundStyle } from '../utils/backgroundUtils';

// Initialize Google OAuth - add this before component
const loadGoogleScript = () => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
};

// Add type definition for window.google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, options: any) => void;
        };
      };
    };
  }
}

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  city: string;
  education?: string;
  educationCustom?: string;
  militaryService?: string;
  militaryServiceCustom?: string;
}

interface PasswordCriteria {
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

const educationLevels = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate',
  'Other',
];

const militaryServiceOptions = [
  'Currently Serving',
  'Veteran',
  'Reserve Duty',
  'National Service',
  'None',
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];
const years = Array.from(
  { length: new Date().getFullYear() - 1900 + 1 },
  (_, i) => (new Date().getFullYear() - i).toString()
);

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    city: '',
    education: '',
    educationCustom: '',
    militaryService: '',
    militaryServiceCustom: '',
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | null => {
    const criteria = {
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordCriteria(criteria);

    const metCriteria = Object.values(criteria).filter(Boolean).length;
    if (metCriteria === 5) return 'strong';
    if (metCriteria >= 3) return 'medium';
    if (metCriteria >= 1) return 'weak';
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.confirmPassword.trim() !== formData.password.trim()) {
      newErrors.confirmPassword = "Doesn't match the password above";
    }
    if (!formData.birthMonth) {
      newErrors.birthMonth = 'Month is required';
    }
    if (!formData.birthDay) {
      newErrors.birthDay = 'Day is required';
    }
    if (!formData.birthYear) {
      newErrors.birthYear = 'Year is required';
    }

    // Validate age is at least 18
    if (formData.birthYear && formData.birthMonth && formData.birthDay) {
      const birthDate = new Date(
        parseInt(formData.birthYear),
        parseInt(formData.birthMonth) - 1,
        parseInt(formData.birthDay)
      );
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.birthYear = 'You must be at least 18 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && termsAccepted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate('/questionnaire'); // Navigate to questionnaire after signup
      } catch (error) {
        console.error('Signup error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    try {
      setLoading(true);
      const token = response.credential;
      console.log('Google Sign In successful', token);
      navigate('/political-questionnaire');
    } catch (error) {
      console.error('Google Sign In failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoogleScript();
    const initGoogle = () => {
      if (window.google?.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
          callback: handleGoogleSignIn,
        });
      }
    };
    
    // Initialize after script loads
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
      script.addEventListener('load', initGoogle);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initGoogle);
      }
    };
  }, []);

  const renderPasswordStrength = () => (
    <Box>
      <Typography variant="body2">Password Strength: {passwordStrength?.toUpperCase() || 'NONE'}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="caption" color={passwordCriteria.hasLength ? 'success.main' : 'error'}>
          At least 8 characters
        </Typography>
        <Typography variant="caption" color={passwordCriteria.hasUpper ? 'success.main' : 'error'}>
          Contains uppercase letter
        </Typography>
        <Typography variant="caption" color={passwordCriteria.hasLower ? 'success.main' : 'error'}>
          Contains lowercase letter
        </Typography>
        <Typography variant="caption" color={passwordCriteria.hasNumber ? 'success.main' : 'error'}>
          Contains number
        </Typography>
        <Typography variant="caption" color={passwordCriteria.hasSpecial ? 'success.main' : 'error'}>
          Contains special character
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box 
      className="signup-page" 
      sx={{
        ...getBackgroundStyle(),
        // Remove any background-related styles from here
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: { xs: 2, sm: 6 } }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome!
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => window.google?.accounts.id.prompt()}
            sx={{ mb: 2 }}
          >
            Sign up with Google
          </Button>
          <Divider sx={{ my: 2 }}>or</Divider>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setFormData({ ...formData, password: newPassword });
                    setPasswordStrength(checkPasswordStrength(newPassword));
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {formData.password && renderPasswordStrength()}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    const confirmPassword = e.target.value;
                    setFormData({ ...formData, confirmPassword });
                    if (confirmPassword !== formData.password) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "Doesn't match the password above" }));
                    } else {
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
              {/* Birthday Fields */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  select
                  label="Month"
                  value={formData.birthMonth}
                  onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                  error={!!errors.birthMonth}
                  helperText={errors.birthMonth}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Month
                  </MenuItem>
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  select
                  label="Day"
                  value={formData.birthDay}
                  onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                  error={!!errors.birthDay}
                  helperText={errors.birthDay}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Day
                  </MenuItem>
                  {days.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  select
                  label="Year"
                  value={formData.birthYear}
                  onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                  error={!!errors.birthYear}
                  helperText={errors.birthYear}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Year
                  </MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              {/* Education Fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Education Level"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      education: e.target.value,
                      educationCustom: '', // Reset custom field when changing selection
                    })
                  }
                >
                  {educationLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {formData.education && formData.education === 'Other' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specify Education"
                    value={formData.educationCustom}
                    onChange={(e) => setFormData({ ...formData, educationCustom: e.target.value })}
                    placeholder="Add more details about your education"
                  />
                </Grid>
              )}
              {/* Military Service Fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Military Service"
                  value={formData.militaryService}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      militaryService: e.target.value,
                      militaryServiceCustom: '', // Reset custom field when changing selection
                    })
                  }
                >
                  {militaryServiceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {formData.militaryService && formData.militaryService !== 'None' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specify Military Service"
                    value={formData.militaryServiceCustom}
                    onChange={(e) => setFormData({ ...formData, militaryServiceCustom: e.target.value })}
                    placeholder="Add more details about your service"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <span>
                      I agree to the <Link href="#">Terms and Conditions</Link>
                    </span>
                  }
                  sx={{ my: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography className="login-text" align="center">
                  Already have an account?{' '}
                  <Link className="login" component={RouterLink} to="/login">
                    Login here
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpPage;