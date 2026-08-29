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
  useTheme
} from '@mui/material';
import {
  Attractions,
  AccessTime,
  WbSunny,
  AttachMoney,
  CheckCircle,
  TipsAndUpdates,
  ChildCare,
  SportsEsports,
  Park,
  Museum,
  BeachAccess
} from '@mui/icons-material';

export default function ActivityCard({ activities = [], familySize = 4 }) {
  const theme = useTheme();

  if (!activities || activities.length === 0) return null;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'theme_parks':
        return <SportsEsports fontSize="small" />;
      case 'nature':
        return <Park fontSize="small" />;
      case 'science_museums':
        return <Museum fontSize="small" />;
      case 'beaches':
        return <BeachAccess fontSize="small" />;
      default:
        return <Attractions fontSize="small" />;
    }
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
              bgcolor: 'success.main',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Attractions />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Curated Family Activities & Attractions
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hand-picked and scored for your family members' ages and interests with itemized price labels
            </Typography>
          </Box>
        </Box>

        {/* Activity Grid */}
        <Grid container spacing={2.5}>
          {activities.map((act, idx) => {
            const isFree = !act.price_per_person_usd || act.price_per_person_usd === 0;
            const familyTotalCost = act.price_per_person_usd ? act.price_per_person_usd * familySize : 0;

            return (
              <Grid item xs={12} md={6} key={act.id || idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    height: '100%',
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                    }
                  }}
                >
                  <Box>
                    {/* Top Age & Category Badges */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                      {/* Family Age Tag */}
                      <Chip
                        icon={<ChildCare sx={{ fontSize: '15px !important' }} />}
                        label={act.family_tag || "Family Recommended"}
                        size="small"
                        color={
                          act.family_tag?.includes('Toddler') ? 'secondary'
                          : act.family_tag?.includes('Teen') ? 'warning'
                          : act.family_tag?.includes('All Ages') ? 'success'
                          : 'primary'
                        }
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />

                      {/* Price Tag */}
                      <Chip
                        label={isFree ? "100% Free Entry" : `$${act.price_per_person_usd}/person ($${familyTotalCost} family)`}
                        size="small"
                        variant={isFree ? "filled" : "outlined"}
                        color={isFree ? "success" : "default"}
                        sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                      />
                    </Box>

                    {/* Activity Title */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>
                      {act.name}
                    </Typography>

                    {/* Matched Family Members Badge */}
                    {act.matched_members && act.matched_members.length > 0 && (
                      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.72rem' }}>
                          🎯 Matches:
                        </Typography>
                        {act.matched_members.map((memName, mIdx) => (
                          <Chip
                            key={mIdx}
                            label={memName}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.15)' : '#e0f2fe' }}
                          />
                        ))}
                      </Box>
                    )}

                    {/* Category Labels */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                      {act.labels?.map((label, lIdx) => (
                        <Chip
                          key={lIdx}
                          label={label}
                          size="small"
                          sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }}
                        />
                      ))}
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.5 }}>
                      {act.description}
                    </Typography>

                    {/* Time & Duration Specs */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          ~{act.duration_hours || 3} Hours
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <WbSunny sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Best: {act.best_time_of_day || 'Morning'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Family Insider Tip Box */}
                  {act.tips && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                        borderLeft: `3px solid ${theme.palette.success.main}`,
                      }}
                    >
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8, color: 'text.primary', fontSize: '0.75rem' }}>
                        <TipsAndUpdates sx={{ fontSize: 16, color: 'success.main', flexShrink: 0, mt: 0.1 }} />
                        <span><strong>Family Tip:</strong> {act.tips}</span>
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
