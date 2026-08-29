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
  Tooltip,
  Alert,
  Snackbar,
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
  MarkEmailRead,
  InfoOutlined
} from '@mui/icons-material';

export default function ShareDialog({ open, onClose, tripData }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0); // 0: Email, 1: SMS, 2: Quick Copy
  const [emailTo, setEmailTo] = useState('');
  const [phoneTo, setPhoneTo] = useState('');
  const [customNote, setCustomNote] = useState('Hey! Check out our upcoming family trip itinerary and estimated budget:');
  const [copied, setCopied] = useState(false);

  if (!tripData) return null;

  const dest = tripData.destination?.name || 'Vacation Destination';
  const duration = tripData.budget_summary?.duration_days || 5;
  const numTravelers = tripData.family_profile_summary?.total_travelers || 4;
  const budgetRealistic = tripData.budget_summary?.total_budget_range?.realistic || 3000;
  const flightAvg = tripData.flights?.price_range?.total_family_avg || 1200;
  const lodgingAvg = tripData.lodging?.price_range?.total_trip_avg || 950;

  // Generate formatted Email Body
  const generateEmailBody = () => {
    let body = `${customNote}\n\n`;
    body += `=========================================\n`;
    body += `✈️ FAMILY TRIP PLAN: ${dest.toUpperCase()}\n`;
    body += `=========================================\n`;
    body += `• Travelers: ${numTravelers} family members\n`;
    body += `• Duration: ${duration} Days\n`;
    body += `• Estimated Total Budget: $${budgetRealistic.toLocaleString()} (Realistic Standard)\n\n`;

    body += `🛫 FLIGHT ESTIMATES:\n`;
    body += `• Route: ${tripData.flights?.origin_code || 'ORIGIN'} ➔ ${tripData.flights?.destination_code || 'DEST'}\n`;
    body += `• Roundtrip Cost: ~$${tripData.flights?.price_range?.avg_per_person || 300}/person ($${flightAvg.toLocaleString()} total family)\n`;
    body += `• Recommended: ${tripData.flights?.options?.[1]?.airline || 'Standard Main Cabin'}\n\n`;

    body += `🏨 LODGING ESTIMATES:\n`;
    body += `• Stay Option: ${tripData.lodging?.options?.[0]?.name || 'Family Vacation Home'}\n`;
    body += `• Estimated Total: $${lodgingAvg.toLocaleString()} (~$${tripData.lodging?.price_range?.avg_per_night || 200}/night)\n`;
    body += `• Amenities: ${tripData.lodging?.options?.[0]?.family_amenities?.slice(0, 3).join(', ') || 'Kitchen, Pool, Laundry'}\n\n`;

    body += `📅 SUGGESTED DAY-BY-DAY ITINERARY:\n`;
    tripData.itinerary?.forEach((day) => {
      body += `• Day ${day.day}: ${day.morning?.activity} (Morning) ➔ ${day.afternoon?.activity} (Afternoon)\n`;
    });

    body += `\n-----------------------------------------\n`;
    body += `Planned with Family Travel Planner\n`;

    return body;
  };

  // Generate compact SMS text
  const generateSmsBody = () => {
    let text = `${customNote} Family trip to ${dest} (${duration} days, ${numTravelers} people)! `;
    text += `Est. budget: ~$${budgetRealistic.toLocaleString()}. `;
    text += `Flights: ~$${tripData.flights?.price_range?.avg_per_person || 300}/ea. `;
    text += `Lodging: ~$${tripData.lodging?.price_range?.avg_per_night || 200}/nt. `;
    if (tripData.activities && tripData.activities.length > 0) {
      text += `Highlights: ${tripData.activities.slice(0, 2).map((a) => a.name).join(', ')}. `;
    }
    text += `Let me know what you think!`;
    return text;
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Family Trip Itinerary: ${dest} (${duration} Days)`);
    const body = encodeURIComponent(generateEmailBody());
    const recipient = encodeURIComponent(emailTo.trim());
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  const handleSendSms = () => {
    const body = encodeURIComponent(generateSmsBody());
    const phone = phoneTo.trim().replace(/[^\d+]/g, '');
    // iOS and Android cross-compatible SMS URI
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsUrl = isIOS
      ? `sms:${phone}&body=${body}`
      : `sms:${phone}?body=${body}`;
    window.location.href = smsUrl;
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon color="primary" />
          <span>Share Travel Itinerary</span>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Share Method Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab icon={<Email fontSize="small" />} iconPosition="start" label="Email" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab icon={<Sms fontSize="small" />} iconPosition="start" label="SMS / Text" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab icon={<ContentCopy fontSize="small" />} iconPosition="start" label="Copy Summary" sx={{ textTransform: 'none', fontWeight: 700 }} />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {/* TAB 0: EMAIL */}
        {activeTab === 0 && (
          <Box>
            <TextField
              fullWidth
              size="small"
              label="Recipient Email Address(es)"
              placeholder="e.g. family@example.com, spouse@example.com"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              sx={{ mb: 2 }}
              helperText="Separate multiple emails with commas"
            />
            <TextField
              fullWidth
              size="small"
              label="Personal Note (Optional)"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              sx={{ mb: 2 }}
            />

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
                maxHeight: 180,
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                whiteSpace: 'pre-wrap',
                color: 'text.secondary',
              }}
            >
              {generateEmailBody()}
            </Paper>

            <Alert severity="info" icon={<InfoOutlined />} sx={{ mt: 2, borderRadius: 2 }}>
              <Typography variant="caption">
                Clicking <strong>Send via Email App</strong> will open your default email program (Gmail, Outlook, Apple Mail) with the pre-filled itinerary.
              </Typography>
            </Alert>
          </Box>
        )}

        {/* TAB 1: SMS / TEXT */}
        {activeTab === 1 && (
          <Box>
            <TextField
              fullWidth
              size="small"
              label="Recipient Phone Number"
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

            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1, textTransform: 'uppercase' }}>
              SMS Message Preview ({generateSmsBody().length} chars):
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                whiteSpace: 'pre-wrap',
                color: 'text.secondary',
              }}
            >
              {generateSmsBody()}
            </Paper>

            <Alert severity="info" icon={<PhoneAndroid />} sx={{ mt: 2, borderRadius: 2 }}>
              <Typography variant="caption">
                On mobile devices or laptops with messaging enabled, clicking <strong>Open in Messages</strong> will launch your SMS app with the text pre-typed.
              </Typography>
            </Alert>
          </Box>
        )}

        {/* TAB 2: QUICK COPY */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Copy the full formatted itinerary to your clipboard to paste into WhatsApp, Slack, Messenger, or any notes app.
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                maxHeight: 220,
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                whiteSpace: 'pre-wrap',
                color: 'text.secondary',
                mb: 2,
              }}
            >
              {generateEmailBody()}
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        {activeTab === 0 && (
          <>
            <Button
              variant="outlined"
              startIcon={copied ? <Check color="success" /> : <ContentCopy />}
              onClick={() => handleCopyText(generateEmailBody())}
            >
              {copied ? "Copied!" : "Copy Email Text"}
            </Button>
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSendEmail}
              sx={{ fontWeight: 700 }}
            >
              Open in Email App
            </Button>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Button
              variant="outlined"
              startIcon={copied ? <Check color="success" /> : <ContentCopy />}
              onClick={() => handleCopyText(generateSmsBody())}
            >
              {copied ? "Copied!" : "Copy SMS Text"}
            </Button>
            <Button
              variant="contained"
              startIcon={<PhoneAndroid />}
              onClick={handleSendSms}
              sx={{ fontWeight: 700 }}
            >
              Open in Messages / SMS
            </Button>
          </>
        )}

        {activeTab === 2 && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={copied ? <Check /> : <ContentCopy />}
            onClick={() => handleCopyText(generateEmailBody())}
            sx={{ fontWeight: 700 }}
          >
            {copied ? "Itinerary Copied to Clipboard! 🎉" : "Copy Full Summary to Clipboard"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
