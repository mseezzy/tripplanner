import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  Collapse
} from '@mui/material';
import {
  SmartToy,
  Close,
  Send,
  Settings,
  AutoAwesome,
  Backpack,
  ChildCare,
  Restaurant,
  Celebration,
  AttachMoney,
  DeleteOutline,
  ExpandLess,
  ExpandMore,
  VpnKey,
  Accessible,
  InfoOutlined,
  CheckCircle,
  ErrorOutline
} from '@mui/icons-material';
import { sendChatMessage, testGeminiApiKey } from '../services/geminiService';

const QUICK_PROMPTS = [
  { label: '♿ Prep Children with Disabilities & Sensory Needs', prompt: 'How should we prepare and accommodate our children with disabilities, sensory sensitivities, or special needs on this trip?' },
  { label: '🎒 Packing List', prompt: 'What specific clothes, gear, and essentials should we pack for our family on this trip?' },
  { label: '👶 Toddler & Stroller Tips', prompt: 'What are the best toddler pacing, stroller accessibility, and nap-friendly tips for this itinerary?' },
  { label: '🍜 Family Restaurant Advice', prompt: 'Where are the best family-friendly food spots or meals suitable for kids near our destination?' },
  { label: '🎉 Festival & Event Guide', prompt: 'Tell me more about the local festivals or seasonal events happening during our visit and the best times to attend.' },
  { label: '💰 Budget Saving Hacks', prompt: 'How can our family save $300-$500 without sacrificing fun on this itinerary?' },
];

export default function ChatConcierge({ tripData }) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi there! I'm your **AI Travel Concierge**. I have complete context about your planned vacation, budget, family member ages, accessibility considerations, and local festivals. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('gemini_api_key') || '');
  const [hasCustomKey, setHasCustomKey] = useState(Boolean(localStorage.getItem('gemini_api_key')));
  const [minimized, setMinimized] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !minimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, minimized]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: text.trim(),
        history: messages,
        tripData,
        apiKey: localStorage.getItem('gemini_api_key') || ''
      });

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        source: response.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat message error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: "I ran into a temporary issue connecting to the AI service. Please try asking again!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [keyTestResult, setKeyTestResult] = useState({ testing: false, success: null, message: '' });

  const handleTestAndSaveKey = async () => {
    if (!apiKeyInput.trim()) {
      localStorage.removeItem('gemini_api_key');
      setHasCustomKey(false);
      setKeyTestResult({ testing: false, success: true, message: "Cleared API key. Using built-in contextual assistant." });
      setTimeout(() => setSettingsOpen(false), 800);
      return;
    }

    setKeyTestResult({ testing: true, success: null, message: "Verifying with Google Gemini servers..." });
    const res = await testGeminiApiKey(apiKeyInput.trim());
    if (res.success) {
      localStorage.setItem('gemini_api_key', apiKeyInput.trim());
      setHasCustomKey(true);
      setKeyTestResult({ testing: false, success: true, message: "✅ Key verified! Google Gemini Flash is active." });
      setTimeout(() => setSettingsOpen(false), 1200);
    } else {
      setKeyTestResult({ testing: false, success: false, message: `❌ ${res.message}` });
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Conversation cleared! I still have your complete trip context loaded. What would you like to explore next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const destName = tripData?.destination?.name ? tripData.destination.name.split(',')[0] : null;

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
          className="no-print"
        >
          <Fab
            variant="extended"
            color="primary"
            onClick={() => setIsOpen(true)}
            sx={{
              fontWeight: 800,
              px: 2.5,
              py: 1.5,
              borderRadius: 4,
              boxShadow: '0 8px 28px rgba(2, 132, 199, 0.45)',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              transition: 'all 0.25s ease',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 12px 32px rgba(2, 132, 199, 0.55)',
              }
            }}
          >
            <AutoAwesome sx={{ mr: 1, fontSize: 20 }} />
            Ask Travel AI
            {destName && (
              <Chip
                label={destName}
                size="small"
                sx={{
                  ml: 1.2,
                  bgcolor: 'rgba(255, 255, 255, 0.22)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  height: 22
                }}
              />
            )}
          </Fab>
        </Box>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <Paper
          elevation={12}
          className="no-print"
          sx={{
            position: 'fixed',
            bottom: { xs: 0, sm: 24 },
            right: { xs: 0, sm: 24 },
            width: { xs: '100vw', sm: 420 },
            maxWidth: '100vw',
            height: minimized ? 'auto' : { xs: '85vh', sm: 580 },
            maxHeight: { xs: '90vh', sm: '85vh' },
            borderRadius: { xs: '16px 16px 0 0', sm: 4 },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.25s ease'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  width: 36,
                  height: 36
                }}
              >
                <AutoAwesome fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  AI Travel Concierge
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.7rem' }}>
                  {destName ? `Aware of: ${destName} Trip` : 'Google Gemini AI'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title={hasCustomKey ? "Custom Gemini Key Active" : "Set Gemini API Key"}>
                <IconButton
                  size="small"
                  onClick={() => setSettingsOpen(true)}
                  sx={{ color: hasCustomKey ? '#facc15' : 'rgba(255,255,255,0.75)' }}
                >
                  <Settings fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear Chat History">
                <IconButton
                  size="small"
                  onClick={clearChat}
                  sx={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton
                size="small"
                onClick={() => setMinimized(!minimized)}
                sx={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {minimized ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: '#fff' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {!minimized && (
            <>
              {/* Quick Suggestion Chips */}
              <Box
                sx={{
                  p: 1.2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  gap: 1,
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { display: 'none' }
                }}
              >
                {QUICK_PROMPTS.map((qp, idx) => (
                  <Chip
                    key={idx}
                    label={qp.label}
                    size="small"
                    onClick={() => handleSendMessage(qp.prompt)}
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      bgcolor: 'background.paper',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: '#fff',
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                ))}
              </Box>

              {/* AI Key Mode Status Bar */}
              <Box
                sx={{
                  px: 2,
                  py: 0.6,
                  bgcolor: hasCustomKey
                    ? (theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.12)' : '#ecfdf5')
                    : (theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.08)' : '#f0f9ff'),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.68rem',
                    color: hasCustomKey ? '#059669' : '#0369a1',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.6
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 12 }} />
                  {hasCustomKey ? "Live Gemini Flash AI Connected" : "Contextual Travel Assistant Active"}
                </Typography>
                {!hasCustomKey && (
                  <Button
                    size="small"
                    onClick={() => setSettingsOpen(true)}
                    sx={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      p: 0,
                      minWidth: 'auto',
                      textTransform: 'none',
                      color: '#0284c7'
                    }}
                  >
                    + Add Free Gemini Key
                  </Button>
                )}
              </Box>

              {/* Chat Message Scrollable Container */}
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.8,
                  bgcolor: theme.palette.mode === 'dark' ? '#090d16' : '#fcfcfd'
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '88%',
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.8,
                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        bgcolor: msg.sender === 'user'
                          ? 'primary.main'
                          : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        color: msg.sender === 'user' ? '#fff' : 'text.primary',
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {msg.text}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.4,
                        px: 1,
                        fontSize: '0.68rem',
                        color: 'text.secondary',
                        opacity: 0.8
                      }}
                    >
                      {msg.timestamp}
                    </Typography>
                  </Box>
                ))}

                {loading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                    <CircularProgress size={18} color="primary" />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      AI Concierge is thinking with your trip context...
                    </Typography>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input Footer */}
              <Box
                sx={{
                  p: 1.5,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center'
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask about packing, toddlers, meals, budget..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '0.88rem'
                    }
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || loading}
                  sx={{
                    bgcolor: 'primary.main',
                    color: '#fff',
                    p: 1,
                    '&:hover': { bgcolor: 'primary.dark' },
                    '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' }
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              </Box>
            </>
          )}
        </Paper>
      )}

      {/* Gemini API Key Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <VpnKey color="primary" />
          Gemini AI Key Settings
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your <strong>free Google Gemini API Key</strong> (from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 700 }}>aistudio.google.com</a>) to unlock unconstrained live generative AI responses on <em>any question</em> with 1,500 free queries/day.
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Google Gemini API Key"
            placeholder="AIzaSy..."
            value={apiKeyInput}
            onChange={(e) => {
              setApiKeyInput(e.target.value);
              setKeyTestResult({ testing: false, success: null, message: '' });
            }}
            type="password"
            helperText="Stored locally in your browser. Leave empty to use the built-in travel intelligence engine."
          />

          {keyTestResult.message && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: keyTestResult.success === true ? 'rgba(16, 185, 129, 0.1)' : keyTestResult.success === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                border: `1px solid ${keyTestResult.success === true ? '#10b981' : keyTestResult.success === false ? '#ef4444' : '#0284c7'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {keyTestResult.testing && <CircularProgress size={16} />}
              {keyTestResult.success === true && <CheckCircle color="success" fontSize="small" />}
              {keyTestResult.success === false && <ErrorOutline color="error" fontSize="small" />}
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {keyTestResult.message}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleTestAndSaveKey}
            disabled={keyTestResult.testing}
            startIcon={keyTestResult.testing ? <CircularProgress size={16} color="inherit" /> : <VpnKey />}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            {keyTestResult.testing ? "Verifying..." : "Verify & Save Key"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
