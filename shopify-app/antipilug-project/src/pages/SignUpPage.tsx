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
  IconButton,
  InputAdornment,
  Paper,
  Link,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import './styles/SignUpPage.scss';
import GoogleIcon from '@mui/icons-material/Google';
import Divider from '@mui/material/Divider';

// Initialize Google OAuth - add this before component
const loadGoogleScript = () => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
};

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // Add this line
  password: string;
  confirmPassword: string;
  age: string;
}

interface PasswordCriteria {
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', // Add this line
    password: '',
    confirmPassword: '',
    age: '',
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

    const strengthScore = Object.values(criteria).filter(Boolean).length;

    if (strengthScore <= 2) return 'weak';
    if (strengthScore <= 4) return 'medium';
    return 'strong';
  };

  // Form validation remains similar
  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    // Add phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    // ... rest of validation logic

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && termsAccepted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
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
      // Here you would typically send the token to your backend
      const token = response.credential;
      console.log('Google Sign In successful', token);
      // Navigate to questionnaire after successful sign in
      navigate('/political-questionnaire');
    } catch (error) {
      console.error('Google Sign In failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoogleScript();
    // Initialize Google Sign In
    window.google?.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
      callback: handleGoogleSignIn,
    });
    window.google?.accounts.id.renderButton(
      document.getElementById('google-signin'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }, []);

  const renderPasswordStrength = () => (
    <Box className="password-criteria">
      <Typography 
        variant="caption" 
        className={`password-strength ${passwordStrength}`}
      >
        Password Strength: {passwordStrength?.toUpperCase() || 'NONE'}
      </Typography>
      <ul>
        <li className={passwordCriteria.hasLength ? 'met' : 'unmet'}>
          At least 8 characters
        </li>
        <li className={passwordCriteria.hasUpper ? 'met' : 'unmet'}>
          Contains uppercase letter
        </li>
        <li className={passwordCriteria.hasLower ? 'met' : 'unmet'}>
          Contains lowercase letter
        </li>
        <li className={passwordCriteria.hasNumber ? 'met' : 'unmet'}>
          Contains number
        </li>
        <li className={passwordCriteria.hasSpecial ? 'met' : 'unmet'}>
          Contains special character
        </li>
      </ul>
    </Box>
  );

  return (
    <Container component="main" maxWidth="sm" className="signup-page">
      <Paper elevation={3} className="signup-paper">
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Bridge!
        </Typography>
        
        {/* Google Sign In Button */}
        <Button
          fullWidth
          variant="outlined"
          className="google-button"
          startIcon={<GoogleIcon />}
          sx={{ mb: 2 }}
        >
          Sign up with Google
        </Button>
        <div id="google-signin"></div>

        <Divider sx={{ my: 2 }}>
          <Typography color="textSecondary">or</Typography>
        </Divider>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                required
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
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Phone Number"
            margin="normal"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />

          <TextField
            fullWidth
            label="Password"
            margin="normal"
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
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {formData.password && renderPasswordStrength()}

          <TextField
            fullWidth
            label="Confirm Password"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <TextField
            fullWidth
            label="Age"
            margin="normal"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            error={!!errors.age}
            helperText={errors.age}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the <Link href="#" underline="hover">Terms and Conditions</Link>
              </Typography>
            }
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/login" 
              underline="hover"
              sx={{ 
                color: '#1976d2',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage;