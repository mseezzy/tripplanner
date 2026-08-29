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
  Rating,
  Alert,
  useTheme
} from '@mui/material';
import {
  Hotel,
  HomeWork,
  Pool,
  Kitchen,
  LocalLaundryService,
  ChildFriendly,
  FreeBreakfast,
  CheckCircle,
  Lightbulb
} from '@mui/icons-material';

export default function LodgingCard({ lodging, durationNights = 4, familySize = 4 }) {
  const theme = useTheme();

  if (!lodging) return null;

  const priceRange = lodging.price_range || {
    low_per_night: 110,
    avg_per_night: 240,
    peak_per_night: 480,
    total_trip_low: 440,
    total_trip_avg: 960,
    total_trip_peak: 1920
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'secondary.main',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Hotel />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Lodging Recommendations & Price Ranges
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Family-Optimized Accommodations for {durationNights} Nights ({familySize} Guests)
            </Typography>
          </Box>
        </Box>

        {/* Price Range Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)'
              : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(251, 146, 60, 0.2)' : '#fed7aa'}`,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondary.dark', textTransform: 'uppercase', display: 'block', mb: 1 }}>
            Estimated Total Lodging Cost ({durationNights} Nights):
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Budget Option (${priceRange.low_per_night}/nt)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                ${priceRange.total_trip_low}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Standard Family (${priceRange.avg_per_night}/nt)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                ${priceRange.total_trip_avg}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Upscale / Luxury (${priceRange.peak_per_night}/nt)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                ${priceRange.total_trip_peak}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Lodging Option Cards */}
        <Grid container spacing={2.5}>
          {lodging.options?.map((opt, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
                  border: `1px solid ${idx === 0 ? theme.palette.secondary.main : theme.palette.divider}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                {idx === 0 && (
                  <Chip
                    label="Top Value for Families"
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: -12, right: 16, fontWeight: 700, fontSize: '0.7rem' }}
                  />
                )}

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                        {opt.category}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                        {opt.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Rating & Reviews */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Rating value={opt.rating || 4.8} precision={0.1} size="small" readOnly />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {opt.rating} ({opt.reviews_count} reviews)
                    </Typography>
                  </Box>

                  {/* Price display */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      ${opt.nightly_rate_usd}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / night (${opt.total_trip_usd} for {durationNights} nights)
                    </Typography>
                  </Box>

                  {/* Bed layout */}
                  <Box sx={{ mb: 2, p: 1.2, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: 'text.primary' }}>
                      🛏️ Bed Setup: {opt.bed_layout}
                    </Typography>
                  </Box>

                  {/* Family Amenities Checklist */}
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                    Family Amenities:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                    {opt.family_amenities?.map((amenity, aIdx) => (
                      <Chip
                        key={aIdx}
                        label={amenity}
                        size="small"
                        icon={<CheckCircle fontSize="small" color="success" />}
                        sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Best for footer */}
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', pt: 1, borderTop: `1px dashed ${theme.palette.divider}` }}>
                  💡 {opt.best_for}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tip */}
        {lodging.family_lodging_tip && (
          <Alert severity="warning" icon={<Lightbulb />} sx={{ mt: 3, borderRadius: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              <strong>Family Lodging Insight:</strong> {lodging.family_lodging_tip}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
