import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Send as SendIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { emails } from '../services/api';

function Dashboard() {
  const [emailsList, setEmailsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const { data } = await emails.getUnread();
      setEmailsList(data.emails);
      setError(null);
    } catch (err) {
      setError('Failed to fetch emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleGenerateResponse = async (emailId) => {
    try {
      const { data } = await emails.generateResponse(emailId);
      setEmailsList((prev) =>
        prev.map((email) =>
          email.id === emailId ? { ...email, ai_response: data.ai_response } : email
        )
      );
    } catch (err) {
      setError('Failed to generate response. Please try again.');
    }
  };

  const handleSendResponse = async (emailId, response) => {
    try {
      await emails.sendResponse(emailId, response);
      setEmailsList((prev) => prev.filter((email) => email.id !== emailId));
    } catch (err) {
      setError('Failed to send response. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Recent Emails
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchEmails}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {emailsList.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No unread emails found.</Typography>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {emailsList.map((email) => (
            <Card key={email.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  From: {email.from}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Subject: {email.subject}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {email.body}
                </Typography>
                {email.ai_response && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      AI-Generated Response:
                    </Typography>
                    <Typography variant="body2">{email.ai_response}</Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                {!email.ai_response ? (
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={() => handleGenerateResponse(email.id)}
                  >
                    Generate Response
                  </Button>
                ) : (
                  <Button
                    startIcon={<SendIcon />}
                    variant="contained"
                    onClick={() => handleSendResponse(email.id, email.ai_response)}
                    disabled={user.manual_review}
                  >
                    Send Response
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Dashboard; 