import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  useTheme
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Luggage,
  FamilyRestroom,
  CheckCircleOutline,
  InfoOutlined,
  AccessTime
} from '@mui/icons-material';

export default function FlightCard({ flights, familySize = 4 }) {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState('total'); // 'total' or 'per_person'

  if (!flights) return null;

  const priceRange = flights.price_range || {
    low_per_person: 190,
    avg_per_person: 320,
    peak_per_person: 550,
    total_family_low: 760,
    total_family_avg: 1280,
    total_family_peak: 2200
  };

  const isTotal = viewMode === 'total';

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* Header & View Mode Switch */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FlightTakeoff />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Flight Recommendations & Price Ranges
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {flights.origin_code || 'ORIGIN'} ➔ {flights.destination_code || 'DEST'} • Estimated Roundtrip for {familySize} Travelers
              </Typography>
            </Box>
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            size="small"
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            <ToggleButton value="total" sx={{ fontWeight: 700, px: 2 }}>
              Total Family ({familySize})
            </ToggleButton>
            <ToggleButton value="per_person" sx={{ fontWeight: 700, px: 2 }}>
              Per Person
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* High-Level Price Range Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)'
              : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.2)' : '#bae6fd'}`,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark', textTransform: 'uppercase', display: 'block', mb: 1 }}>
            Estimated Roundtrip Price Range:
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Budget Deal (Saver)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                ${isTotal ? priceRange.total_family_low : priceRange.low_per_person}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Realistic Standard (Avg)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                ${isTotal ? priceRange.total_family_avg : priceRange.avg_per_person}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Peak Season / Flex
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                ${isTotal ? priceRange.total_family_peak : priceRange.peak_per_person}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Flight Options Tier Cards */}
        <Grid container spacing={2.5}>
          {flights.options?.map((opt, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
                  border: `1px solid ${idx === 1 ? theme.palette.primary.main : theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: idx === 1 ? '0 4px 16px rgba(2, 132, 199, 0.15)' : 'none',
                }}
              >
                {idx === 1 && (
                  <Chip
                    label="Most Popular for Families"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: -12, right: 16, fontWeight: 700, fontSize: '0.7rem' }}
                  />
                )}

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: idx === 1 ? 'primary.main' : 'text.primary', mb: 0.5 }}>
                    {opt.tier}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1.5 }}>
                    {opt.airline}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      ${isTotal ? opt.total_family_price : opt.price_per_person}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isTotal ? `total (${familySize} people)` : '/ person'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Flight Specs */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {opt.duration} ({opt.type})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Luggage fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {opt.baggage_policy}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Family Tip */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                  }}
                >
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8, color: 'text.secondary', fontSize: '0.75rem' }}>
                    <FamilyRestroom sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0, mt: 0.2 }} />
                    {opt.family_seating_tip}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* General Pro Tip Banner */}
        {flights.family_travel_tip && (
          <Alert severity="info" icon={<InfoOutlined />} sx={{ mt: 3, borderRadius: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              <strong>Family Flight Tip:</strong> {flights.family_travel_tip}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
