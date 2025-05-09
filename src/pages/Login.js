import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { auth } from '../services/api';

function Login() {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      dispatch(loginStart());
      const { data } = await auth.getGoogleAuthUrl();
      window.location.href = data.auth_url;
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      const handleCallback = async () => {
        try {
          const { data } = await auth.handleGoogleCallback(code);
          dispatch(loginSuccess(data.user));
        } catch (error) {
          dispatch(loginFailure(error.message));
        }
      };
      handleCallback();
    }
  }, [dispatch]);

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
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            size="large"
            fullWidth
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 