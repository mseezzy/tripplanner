import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Paper,
  Divider,
  Alert,
  useTheme
} from '@mui/material';
import {
  AccountBalanceWallet,
  Flight,
  Hotel,
  Attractions,
  Restaurant,
  DirectionsCar,
  Savings,
  Security
} from '@mui/icons-material';

export default function BudgetBreakdown({ budgetSummary, destinationName }) {
  const theme = useTheme();

  if (!budgetSummary) return null;

  const { total_budget_range, per_person_range, breakdown_realistic, duration_days, family_size } = budgetSummary;

  const totalRealistic = total_budget_range?.realistic || 3000;

  const categories = [
    { label: 'Flights (Roundtrip)', amount: breakdown_realistic?.flights || 1200, icon: <Flight fontSize="small" />, color: '#0284c7' },
    { label: 'Lodging & Stays', amount: breakdown_realistic?.lodging || 950, icon: <Hotel fontSize="small" />, color: '#f97316' },
    { label: 'Food & Dining', amount: breakdown_realistic?.food_and_dining || 600, icon: <Restaurant fontSize="small" />, color: '#10b981' },
    { label: 'Activities & Tickets', amount: breakdown_realistic?.activities || 350, icon: <Attractions fontSize="small" />, color: '#8b5cf6' },
    { label: 'Local Transport / Rental', amount: breakdown_realistic?.local_transport || 200, icon: <DirectionsCar fontSize="small" />, color: '#06b6d4' },
    { label: 'Emergency / Misc Buffer', amount: breakdown_realistic?.emergency_buffer || 240, icon: <Security fontSize="small" />, color: '#64748b' },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
            <AccountBalanceWallet />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Total Trip Budget & Price Range Breakdown
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Estimated complete trip cost for {family_size} travelers over {duration_days} days in {destinationName}
            </Typography>
          </Box>
        </Box>

        {/* 3 Range Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          {/* Budget Saver */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Budget Saver Tier
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', my: 0.5 }}>
                ${total_budget_range?.low?.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ~${per_person_range?.low} / person total
              </Typography>
            </Paper>
          </Grid>

          {/* Realistic Standard */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.15)' : '#e0f2fe',
                border: `2px solid ${theme.palette.primary.main}`,
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.15)',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.dark', textTransform: 'uppercase' }}>
                Realistic Standard (Recommended)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', my: 0.5 }}>
                ${total_budget_range?.realistic?.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                ~${per_person_range?.realistic} / person total
              </Typography>
            </Paper>
          </Grid>

          {/* Peak / Luxury */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Peak Season / Luxury
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main', my: 0.5 }}>
                ${total_budget_range?.peak?.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ~${per_person_range?.peak} / person total
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Itemized Category Breakdown Progress Bars */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Itemized Budget Category Distribution (Realistic Standard):
        </Typography>

        <Grid container spacing={2}>
          {categories.map((cat, idx) => {
            const percentage = Math.round((cat.amount / totalRealistic) * 100);
            return (
              <Grid item xs={12} sm={6} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: cat.color }}>{cat.icon}</Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {cat.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      ${cat.amount?.toLocaleString()} <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({percentage}%)</span>
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, percentage * 2)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: cat.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Money Saving Family Strategy */}
        <Alert severity="success" icon={<Savings />} sx={{ mt: 3, borderRadius: 2.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            <strong>Family Budget Pro Tip:</strong> Packing light breakfast snacks and booking accommodations with laundry facilities cuts packing baggage fees and incidental dining expenses by up to 20%.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}
