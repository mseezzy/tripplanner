import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  useTheme,
  Alert
} from '@mui/material';
import {
  Celebration,
  EventAvailable,
  LocalOffer,
  ChildFriendly,
  TipsAndUpdates,
  Star,
  AccessTime
} from '@mui/icons-material';

export default function EventsCard({ events, destinationName }) {
  const theme = useTheme();

  if (!events || events.length === 0) {
    return null;
  }

  const destCity = destinationName ? destinationName.split(',')[0] : 'Your Destination';

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        mb: 3
      }}
    >
      <Box
        sx={{
          p: 2.5,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(249, 115, 22, 0.05) 100%)'
            : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Celebration sx={{ color: '#ea580c', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Local Events & Seasonal Festivals
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Family-friendly festivals, parades, and cultural celebrations during your stay in {destCity}
            </Typography>
          </Box>
        </Box>
        <Chip
          icon={<EventAvailable fontSize="small" sx={{ color: '#ea580c !important' }} />}
          label={`${events.length} Seasonal ${events.length === 1 ? 'Event' : 'Events'} Active`}
          sx={{
            fontWeight: 800,
            bgcolor: 'background.paper',
            borderColor: '#ea580c',
            color: '#c2410c'
          }}
          variant="outlined"
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          {events.map((ev, idx) => (
            <Grid item xs={12} md={events.length === 1 ? 12 : 6} key={ev.id || idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#ea580c',
                    boxShadow: '0 6px 20px rgba(234, 88, 12, 0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box>
                  {/* Category & Price Badges */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      label={ev.category || 'Festival'}
                      sx={{
                        fontWeight: 700,
                        bgcolor: 'rgba(234, 88, 12, 0.1)',
                        color: '#c2410c'
                      }}
                    />
                    <Chip
                      size="small"
                      icon={<LocalOffer fontSize="small" />}
                      label={ev.price_tier || (ev.price_per_person_usd === 0 ? 'Free Entry' : `$${ev.price_per_person_usd}/person`)}
                      color={ev.price_per_person_usd === 0 || ev.price_tier?.includes('Free') ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  {/* Event Title */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    {ev.name}
                  </Typography>

                  {/* Time Window */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <AccessTime fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#ea580c' }}>
                      {ev.display_dates}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {ev.description}
                  </Typography>
                </Box>

                <Box>
                  {/* Family Tag */}
                  {ev.family_tag && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Star fontSize="small" sx={{ color: '#f59e0b', fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {ev.family_tag}
                      </Typography>
                    </Box>
                  )}

                  {/* Pro-Tip Alert Box */}
                  {ev.tips && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1
                      }}
                    >
                      <TipsAndUpdates sx={{ color: '#0284c7', fontSize: 18, mt: 0.2 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        <strong>Family Tip:</strong> {ev.tips}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
