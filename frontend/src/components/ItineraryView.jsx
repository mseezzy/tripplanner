import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Paper,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  CalendarMonth,
  WbSunny,
  WbTwilight,
  NightsStay,
  AttachMoney,
  AccessTime,
  DirectionsWalk
} from '@mui/icons-material';

export default function ItineraryView({ itinerary = [], destinationName }) {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState(0);

  if (!itinerary || itinerary.length === 0) return null;

  const currentDay = itinerary[selectedDay] || itinerary[0];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'info.main',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CalendarMonth />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Suggested Day-by-Day Family Itinerary
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Optimized pacing designed with kid downtime, realistic travel times, and meal breaks
            </Typography>
          </Box>
        </Box>

        {/* Day Selector Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedDay}
            onChange={(_, val) => setSelectedDay(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 44 }}
          >
            {itinerary.map((dayItem, idx) => (
              <Tab
                key={idx}
                label={`Day ${dayItem.day}`}
                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Selected Day Overview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
            {currentDay.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Estimated exploration in {destinationName}
          </Typography>
        </Box>

        {/* Day Timeline Blocks (Morning, Afternoon, Evening) */}
        <Grid container spacing={2.5}>
          {/* MORNING */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                borderTop: '4px solid #f59e0b',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WbSunny sx={{ color: '#f59e0b' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Morning Adventure
                    </Typography>
                  </Box>
                  <Chip label={currentDay.morning?.time || "9:00 AM"} size="small" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  {currentDay.morning?.activity}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                  {currentDay.morning?.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
                <Chip label={currentDay.morning?.tag || "Family Fun"} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {currentDay.morning?.price}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* AFTERNOON */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                borderTop: '4px solid #0284c7',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WbTwilight sx={{ color: '#0284c7' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Afternoon Discovery
                    </Typography>
                  </Box>
                  <Chip label={currentDay.afternoon?.time || "2:00 PM"} size="small" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  {currentDay.afternoon?.activity}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                  {currentDay.afternoon?.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
                <Chip label={currentDay.afternoon?.tag || "All Ages"} size="small" color="secondary" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {currentDay.afternoon?.price}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* EVENING */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                borderTop: '4px solid #8b5cf6',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NightsStay sx={{ color: '#8b5cf6' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Evening Dining & Rest
                    </Typography>
                  </Box>
                  <Chip label={currentDay.evening?.time || "6:30 PM"} size="small" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                  {currentDay.evening?.activity}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                  {currentDay.evening?.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
                <Chip label={currentDay.evening?.tag || "Dinner"} size="small" color="info" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {currentDay.evening?.price}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
