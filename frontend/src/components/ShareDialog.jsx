import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Email,
  Sms,
  ContentCopy,
  Send,
  Close,
  Check,
  Share as ShareIcon,
  PhoneAndroid,
  Link as LinkIcon,
  InfoOutlined,
  OpenInNew
} from '@mui/icons-material';
import { sendDirectEmail, sendDirectSms, generateShareableUrl } from '../services/api';

export default function ShareDialog({ open, onClose, tripData, rawParams }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0); // 0: Direct Email, 1: Direct SMS, 2: Vacation Link
  const [emailTo, setEmailTo] = useState('');
  const [phoneTo, setPhoneTo] = useState('');
  const [customNote, setCustomNote] = useState('Check out our family trip plan with flights, lodging, and activities!');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!tripData) return null;

  const dest = tripData.destination?.name || 'Vacation Destination';
  const duration = tripData.budget_summary?.duration_days || 5;
  const numTravelers = tripData.family_profile_summary?.total_travelers || 4;
  const budgetRealistic = tripData.budget_summary?.total_budget_range?.realistic || 3000;
  const flightAvg = tripData.flights?.price_range?.total_family_avg || 1200;
  const lodgingAvg = tripData.lodging?.price_range?.total_trip_avg || 950;

  // Generate direct shareable URL
  const vacationLink = generateShareableUrl(rawParams || {
    family_members: Array(numTravelers).fill({ name: "Traveler", age: 10 }),
    preferred_destination: dest,
    duration_days: duration
  });

  // Formatted Email Body with Direct Vacation Link
  const generateEmailBody = () => {
    let body = `${customNote}\n\n`;
    body += `=========================================\n`;
    body += `✈️ FAMILY TRIP PLAN: ${dest.toUpperCase()}\n`;
    body += `=========================================\n`;
    body += `• Travelers: ${numTravelers} family members\n`;
    body += `• Duration: ${duration} Days\n`;
    body += `• Estimated Total Budget: $${budgetRealistic.toLocaleString()} (Realistic Standard)\n\n`;

    body += `🔗 DIRECT VACATION LINK:\n`;
    body += `${vacationLink}\n\n`;

    body += `🛫 FLIGHT ESTIMATES:\n`;
    body += `• Route: ${tripData.flights?.origin_code || 'ORIGIN'} ➔ ${tripData.flights?.destination_code || 'DEST'}\n`;
    body += `• Estimated: ~$${tripData.flights?.price_range?.avg_per_person || 300}/person ($${flightAvg.toLocaleString()} family)\n`;
    body += `• Recommended: ${tripData.flights?.options?.[1]?.airline || 'Standard Main Cabin'}\n\n`;

    body += `🏨 LODGING ESTIMATES:\n`;
    body += `• Stay: ${tripData.lodging?.options?.[0]?.name || 'Family Vacation Home'}\n`;
    body += `• Total: $${lodgingAvg.toLocaleString()} (~$${tripData.lodging?.price_range?.avg_per_night || 200}/night)\n\n`;

    body += `📅 DAILY HIGHLIGHTS:\n`;
    tripData.itinerary?.slice(0, 4).forEach((day) => {
      body += `• Day ${day.day}: ${day.morning?.activity} ➔ ${day.afternoon?.activity}\n`;
    });

    body += `\n-----------------------------------------\n`;
    body += `Click the vacation link above to view the interactive itinerary and live weather!\n`;

    return body;
  };

  // Compact SMS message with Direct Vacation Link
  const generateSmsBody = () => {
    let text = `${customNote} Trip to ${dest} (${duration}d, ${numTravelers} ppl)! Est: ~$${budgetRealistic.toLocaleString()}. `;
    text += `View full itinerary & budget: ${vacationLink}`;
    return text;
  };

  const handleSendDirectEmail = async () => {
    if (!emailTo.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter at least one recipient email address.' });
      return;
    }
    setSending(true);
    setStatusMessage(null);

    const emailSubject = `Family Trip Itinerary: ${dest} (${duration} Days)`;
    const emailBody = generateEmailBody();

    try {
      const res = await sendDirectEmail({
        to_email: emailTo.trim(),
        subject: emailSubject,
        message: emailBody,
        trip_url: vacationLink,
        trip_summary: { destination: dest, budget: budgetRealistic }
      });

      if (res && res.status === 'sent') {
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        // Fallback to launching user's email client directly
        const subjectEnc = encodeURIComponent(emailSubject);
        const bodyEnc = encodeURIComponent(emailBody);
        const recipientEnc = encodeURIComponent(emailTo.trim());
        window.location.href = `mailto:${recipientEnc}?subject=${subjectEnc}&body=${bodyEnc}`;
        setStatusMessage({ type: 'info', text: 'Opened your email app with the pre-filled vacation link.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Could not send email. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleSendDirectSms = async () => {
    if (!phoneTo.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a recipient phone number.' });
      return;
    }
    setSending(true);
    setStatusMessage(null);

    const smsBody = generateSmsBody();
    const phone = phoneTo.trim().replace(/[^\d+]/g, '');

    // If Web Share API is available (e.g. on mobile/tablets), use it for 1-touch sending
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Family Vacation to ${dest}`,
          text: smsBody,
          url: vacationLink
        });
        setStatusMessage({ type: 'success', text: 'Shared successfully via your device!' });
        setSending(false);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to direct sms URI
      }
    }

    // Launch native SMS app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const bodyEnc = encodeURIComponent(smsBody);
    const smsUrl = isIOS ? `sms:${phone}&body=${bodyEnc}` : `sms:${phone}?body=${bodyEnc}`;
    window.location.href = smsUrl;
    setStatusMessage({ type: 'info', text: 'Opened your messaging app with the vacation link.' });
    setSending(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon color="primary" />
          <span>Share Itinerary & Direct Vacation Link</span>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => { setActiveTab(val); setStatusMessage(null); }}>
          <Tab icon={<Email fontSize="small" />} iconPosition="start" label="Send Email" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab icon={<Sms fontSize="small" />} iconPosition="start" label="Send Text / SMS" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab icon={<LinkIcon fontSize="small" />} iconPosition="start" label="Vacation Link" sx={{ textTransform: 'none', fontWeight: 700 }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {statusMessage && (
          <Alert severity={statusMessage.type} sx={{ mb: 2, borderRadius: 2 }}>
            {statusMessage.text}
          </Alert>
        )}

        {/* TAB 0: EMAIL DIRECT */}
        {activeTab === 0 && (
          <Box>
            <TextField
              fullWidth
              size="small"
              label="Recipient Email Address(es)"
              placeholder="e.g. partner@example.com, grandparents@example.com"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              sx={{ mb: 2 }}
              helperText="Separate multiple emails with commas"
            />
            <TextField
              fullWidth
              size="small"
              label="Personal Note"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Direct Link Banner */}
            <Paper elevation={0} sx={{ p: 1.5, mb: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.12)' : '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.dark', display: 'block', mb: 0.5 }}>
                🔗 Direct Interactive Vacation Link Included:
              </Typography>
              <Typography variant="caption" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', color: 'primary.main', display: 'block' }}>
                {vacationLink.slice(0, 80)}...
              </Typography>
            </Paper>

            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1, textTransform: 'uppercase' }}>
              Email Preview:
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                maxHeight: 160,
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                whiteSpace: 'pre-wrap',
                color: 'text.secondary',
              }}
            >
              {generateEmailBody()}
            </Paper>
          </Box>
        )}

        {/* TAB 1: SMS / TEXT DIRECT */}
        {activeTab === 1 && (
          <Box>
            <TextField
              fullWidth
              size="small"
              label="Recipient Mobile Phone Number"
              placeholder="e.g. +1 555-019-2834"
              value={phoneTo}
              onChange={(e) => setPhoneTo(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Personal Note"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Direct Link Banner */}
            <Paper elevation={0} sx={{ p: 1.5, mb: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(249, 115, 22, 0.12)' : '#fff7ed', borderRadius: 2, border: '1px solid #fed7aa' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.dark', display: 'block', mb: 0.5 }}>
                📱 Text includes direct interactive vacation link:
              </Typography>
              <Typography variant="caption" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', color: 'secondary.main', display: 'block' }}>
                {vacationLink.slice(0, 80)}...
              </Typography>
            </Paper>

            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1, textTransform: 'uppercase' }}>
              SMS Preview:
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                whiteSpace: 'pre-wrap',
                color: 'text.secondary',
              }}
            >
              {generateSmsBody()}
            </Paper>
          </Box>
        )}

        {/* TAB 2: VACATION LINK */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Anyone with this direct link can view and interact with the planned vacation immediately—no login or signup required.
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={vacationLink}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => handleCopy(vacationLink)}>
                      {copied ? <Check color="success" /> : <ContentCopy />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<OpenInNew />}
              onClick={() => window.open(vacationLink, '_blank')}
            >
              Test Link in New Tab
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        {activeTab === 0 && (
          <>
            <Button
              variant="outlined"
              startIcon={copied ? <Check color="success" /> : <ContentCopy />}
              onClick={() => handleCopy(generateEmailBody())}
            >
              {copied ? "Copied!" : "Copy Email"}
            </Button>
            <Button
              variant="contained"
              startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <Send />}
              disabled={sending}
              onClick={handleSendDirectEmail}
              sx={{ fontWeight: 700 }}
            >
              Send Email
            </Button>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Button
              variant="outlined"
              startIcon={copied ? <Check color="success" /> : <ContentCopy />}
              onClick={() => handleCopy(generateSmsBody())}
            >
              {copied ? "Copied!" : "Copy SMS"}
            </Button>
            <Button
              variant="contained"
              startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <PhoneAndroid />}
              disabled={sending}
              onClick={handleSendDirectSms}
              sx={{ fontWeight: 700 }}
            >
              Send Text / SMS
            </Button>
          </>
        )}

        {activeTab === 2 && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={copied ? <Check /> : <ContentCopy />}
            onClick={() => handleCopy(vacationLink)}
            sx={{ fontWeight: 700 }}
          >
            {copied ? "Vacation Link Copied! 🎉" : "Copy Direct Vacation Link"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
