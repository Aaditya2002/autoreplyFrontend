import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { updateSettings } from '../store/slices/authSlice';
import { settings } from '../services/api';

function Settings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    manual_review: true,
    response_tone: 'professional',
    response_length: 'medium',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await settings.get();
        setFormData({
          manual_review: data.manual_review,
          response_tone: data.response_tone || 'professional',
          response_length: data.response_length || 'medium',
        });
      } catch (err) {
        setError('Failed to load settings. Please try again.');
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'manual_review' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await settings.update(formData);
      dispatch(updateSettings(formData));
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Settings saved successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Auto-Response Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.manual_review}
                  onChange={handleChange}
                  name="manual_review"
                />
              }
              label="Manual Review"
            />
            <Typography variant="body2" color="text.secondary">
              Review and approve AI-generated responses before sending
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Response Settings
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Response Tone</InputLabel>
              <Select
                name="response_tone"
                value={formData.response_tone}
                onChange={handleChange}
                label="Response Tone"
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Response Length</InputLabel>
              <Select
                name="response_length"
                value={formData.response_length}
                onChange={handleChange}
                label="Response Length"
              >
                <MenuItem value="short">Short</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="long">Long</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            size="large"
          >
            Save Settings
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Settings; 