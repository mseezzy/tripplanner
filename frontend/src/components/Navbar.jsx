import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Luggage,
  Brightness4,
  Brightness7,
  Print,
  Share,
  GitHub,
  CheckCircle,
  CloudOff
} from '@mui/icons-material';

export default function Navbar({
  darkMode,
  setDarkMode,
  hasResults,
  onPrint,
  onShare,
  onReset,
  backendConnected
}) {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
        zIndex: 1100,
        backdropFilter: 'blur(8px)',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      }}
      className="no-print"
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Brand Logo & Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={onReset}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2.5,
              p: 0.8,
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            }}
          >
            <Luggage sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
                background: 'linear-gradient(90deg, #0284c7 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FamilyTripPlanner
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              Smart Itineraries & Realistic Budget Estimator
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Backend Status Chip */}
          <Tooltip title={backendConnected ? "Python FastAPI backend connected & healthy" : "Running in client-side standalone mode"}>
            <Chip
              size="small"
              icon={backendConnected ? <CheckCircle sx={{ fontSize: '14px !important' }} /> : <CloudOff sx={{ fontSize: '14px !important' }} />}
              label={backendConnected ? "Live API" : "Offline / Web"}
              color={backendConnected ? "success" : "default"}
              variant="outlined"
              sx={{ display: { xs: 'none', md: 'inline-flex' }, fontWeight: 600, fontSize: '0.75rem' }}
            />
          </Tooltip>

          {hasResults && (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Share />}
                onClick={onShare}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<Print />}
                onClick={onPrint}
                sx={{ borderRadius: 2, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Print / PDF
              </Button>
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={onReset}
                sx={{ fontWeight: 600 }}
              >
                New Plan
              </Button>
            </>
          )}

          {/* Dark / Light Mode Toggle */}
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
            >
              {darkMode ? <Brightness7 sx={{ color: '#fbbf24' }} /> : <Brightness4 sx={{ color: '#0284c7' }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
