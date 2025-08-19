import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [testEmailUrl, setTestEmailUrl] = useState('');

  const handleSendOtp = async () => {
    setError('');
    setMessage('');
    setTestEmailUrl('');
    try {
      const response = await api.post('/auth/register/code', { email });
      setMessage('OTP sent to your email.');
      if (response.data._test_email_url) {
        setTestEmailUrl(response.data._test_email_url);
      }
    } catch (err) {
      setError('Failed to send OTP.');
      console.error(err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { email, password, code });
      navigate('/');
    } catch (err) {
      setError('Failed to register.');
      console.error(err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Code"
        type="text"
        fullWidth
        margin="normal"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {message && (
        <Typography color="primary" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      {testEmailUrl && (
        <Typography sx={{ mb: 2 }}>
          Test email URL:{' '}
          <Link href={testEmailUrl} target="_blank" rel="noopener">
            {testEmailUrl}
          </Link>
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mb: 2 }}
        onClick={handleSendOtp}
      >
        Send OTP
      </Button>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Box>
  );
}