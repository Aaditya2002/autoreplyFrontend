import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { auth } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await auth.getGoogleAuthUrl();
      window.location.href = data.auth_url;
    } catch (error) {
      setError(error.message || 'Failed to initiate Google login');
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setError('Google authentication failed. Please try again.');
        setLoading(false);
        return;
      }

      if (code) {
        try {
          setLoading(true);
          const { data } = await auth.handleGoogleCallback({ code });
          
          if (data.user) {
            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to dashboard
            navigate('/dashboard');
          } else {
            throw new Error('No user data received');
          }
        } catch (error) {
          setError(error.message || 'Failed to complete authentication');
          // Clear the URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } finally {
          setLoading(false);
        }
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome to Email Auto-Responder
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Automate your email responses with AI-powered replies
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {loading ? (
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={24} />
              <Typography>Processing...</Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              size="large"
              fullWidth
            >
              Sign in with Google
            </Button>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 