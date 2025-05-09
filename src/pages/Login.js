import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { auth } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await auth.getGoogleAuthUrl();
      window.location.href = data.auth_url;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      const handleCallback = async () => {
        try {
          setLoading(true);
          const { data } = await auth.handleGoogleCallback(code);
          // Store user in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      handleCallback();
    }
  }, [navigate]);

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
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign in with Google'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 