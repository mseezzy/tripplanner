import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Stack,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  LockOutlined,
  Google,
  Facebook,
  GitHub,
  VerifiedUserOutlined,
  Close
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ open, onClose }) {
  const { loginWithToken } = useAuth();
  const [tabIndex, setTabIndex] = useState(0); // 0: Sign In, 1: Register, 2: MFA, 3: Verify Email
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [tempMfaToken, setTempMfaToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed.');

      if (data.mfa_required) {
        setTempMfaToken(data.temp_token);
        setTabIndex(2); // Switch to MFA tab
      } else {
        loginWithToken(data.access_token, data.user);
        if (onClose) onClose();
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed.');

      setVerifyToken(data.verification_token);
      setSuccessMsg('Account created! Please verify your email below.');
      setTabIndex(3); // Switch to email verification
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: verifyToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Verification failed.');

      setSuccessMsg('Email verified successfully! You can now sign in.');
      setTabIndex(0); // Switch to sign in
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/mfa/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp_token: tempMfaToken, code: mfaCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid MFA code.');

      loginWithToken(data.access_token, data.user);
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = async (provider) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/sso/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: `${provider}_user@familytravel.com`,
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Traveler`,
          sso_token: `mock_${provider}_token_` + Date.now()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'SSO Login failed.');

      loginWithToken(data.access_token, data.user);
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
      <Box sx={{ background: 'linear-gradient(135deg, #0284c7 0%, #4338ca 100%)', color: '#fff', p: 3, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <LockOutlined sx={{ fontSize: 26, color: '#fff' }} />
        </Box>
        <Typography variant="h6" fontWeight="bold">Family Travel Planner</Typography>
        <Typography variant="body2" sx={{ color: '#e0f2fe' }}>Secure access to family itineraries & budget tools</Typography>
      </Box>

      {tabIndex <= 1 && (
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Sign In" sx={{ fontWeight: 600 }} />
          <Tab label="Create Account" sx={{ fontWeight: 600 }} />
        </Tabs>
      )}

      <DialogContent sx={{ p: 3 }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        {/* Tab 0: Sign In */}
        {tabIndex === 0 && (
          <Box component="form" onSubmit={handleSignIn} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, textAlign: 'center' }}>
              Instant Social SSO
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button fullWidth variant="outlined" startIcon={<Google />} onClick={() => handleSSO('google')} sx={{ textTransform: 'none', fontSize: '0.8rem' }}>
                Google
              </Button>
              <Button fullWidth variant="outlined" startIcon={<Facebook />} onClick={() => handleSSO('facebook')} sx={{ textTransform: 'none', fontSize: '0.8rem' }}>
                Facebook
              </Button>
              <Button fullWidth variant="outlined" startIcon={<GitHub />} onClick={() => handleSSO('github')} sx={{ textTransform: 'none', fontSize: '0.8rem' }}>
                GitHub
              </Button>
            </Stack>

            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>OR WITH EMAIL</Typography>
            </Divider>

            <TextField label="Email Address" type="email" required fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" required fullWidth size="small" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 700 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        )}

        {/* Tab 1: Create Account */}
        {tabIndex === 1 && (
          <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Family / Traveler Name" required fullWidth size="small" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Smiths" />
            <TextField label="Email Address" type="email" required fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Create Password" type="password" required fullWidth size="small" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 700 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Free Account'}
            </Button>
          </Box>
        )}

        {/* Tab 2: MFA 2FA Challenge */}
        {tabIndex === 2 && (
          <Box component="form" onSubmit={handleMfaSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'center' }}>
            <VerifiedUserOutlined sx={{ fontSize: 40, color: 'primary.main', mx: 'auto' }} />
            <Typography variant="subtitle1" fontWeight="bold">Two-Factor Authentication</Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the 6-digit verification code from your Google Authenticator or Authy app.
            </Typography>
            <TextField label="6-Digit TOTP Code" required fullWidth size="small" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: 4 } }} />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 700 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code & Sign In'}
            </Button>
          </Box>
        )}

        {/* Tab 3: Email Verification */}
        {tabIndex === 3 && (
          <Box component="form" onSubmit={handleVerifyEmail} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">Verify Your Email Address</Typography>
            <Typography variant="body2" color="text.secondary">
              We generated a secure verification token for <strong>{email}</strong>.
            </Typography>
            <TextField label="Verification Token" required fullWidth size="small" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 700 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm & Activate Account'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
