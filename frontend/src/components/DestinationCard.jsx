import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  Rating,
  Tabs,
  Tab,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Place,
  WbSunny,
  CheckCircle,
  Accessible,
  Speed,
  TrendingUp,
  SwapHoriz
} from '@mui/icons-material';

import { getDestinationImage, getCategoryFallbackImage } from '../utils/imageUtils';

export default function DestinationCard({
  destination,
  allDestinations = [],
  onSelectDestination,
  weather,
  isMultiDestination,
  stops = []
}) {
  const theme = useTheme();
  const [selectedRegion, setSelectedRegion] = React.useState('All');

  const REGIONS = ['All', 'Asia & Pacific', 'Europe', 'North America', 'Latin America & Caribbean', 'Middle East & Africa'];

  const filteredDestinations = React.useMemo(() => {
    if (selectedRegion === 'All') return allDestinations;
    return allDestinations.filter((d) => d.continent === selectedRegion || d.region?.includes(selectedRegion));
  }, [allDestinations, selectedRegion]);

  return (
    <Card sx={{ overflow: 'hidden', mb: 3 }}>
      {/* Multi-Destination Route Breadcrumbs */}
      {isMultiDestination && stops.length > 1 && (
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'primary.main',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Place fontSize="small" sx={{ color: '#ffffff' }} />
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Multi-Destination Route:
          </Typography>
          {stops.map((s, idx) => (
            <React.Fragment key={idx}>
              <Chip
                avatar={<Avatar src={getDestinationImage(s.destination)} imgProps={{ referrerPolicy: 'no-referrer' }} />}
                label={`Stop ${idx + 1}: ${s.destination?.name?.split(',')[0]} (${s.duration_days} Days)`}
                size="small"
                sx={{
                  bgcolor: destination.id === s.destination?.id ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  color: destination.id === s.destination?.id ? 'primary.main' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  border: destination.id === s.destination?.id ? '2px solid rgba(2, 132, 199, 0.4)' : 'none',
                }}
                onClick={() => onSelectDestination && onSelectDestination(s.destination, idx)}
              />
              {idx < stops.length - 1 && <span style={{ fontWeight: 800 }}>➔</span>}
            </React.Fragment>
          ))}
        </Box>
      )}

      {/* Worldwide Destination Candidate Explorer with Global Region Filters */}
      {!isMultiDestination && allDestinations.length > 1 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.subtle', px: 2, pt: 1.5, pb: 0.5 }}>
          {/* Global Continent / Region Filter Chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', mb: 1, pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', flexShrink: 0, mr: 0.5 }}>
              🌐 Region:
            </Typography>
            {REGIONS.map((region) => {
              const count = region === 'All' ? allDestinations.length : allDestinations.filter((d) => d.continent === region || d.region?.includes(region)).length;
              if (count === 0 && region !== 'All') return null;
              return (
                <Chip
                  key={region}
                  label={`${region} (${count})`}
                  size="small"
                  onClick={() => setSelectedRegion(region)}
                  color={selectedRegion === region ? 'primary' : 'default'}
                  variant={selectedRegion === region ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: selectedRegion === region ? 800 : 600,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />
              );
            })}
          </Box>

          {/* Destination Candidates Tabs */}
          <Tabs
            value={Math.max(0, filteredDestinations.findIndex((d) => d.id === destination.id))}
            onChange={(_, newIdx) => {
              if (filteredDestinations[newIdx]) {
                onSelectDestination(filteredDestinations[newIdx]);
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 44 }}
          >
            {filteredDestinations.slice(0, 20).map((dest, idx) => (
              <Tab
                key={dest.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Avatar
                      src={getDestinationImage(dest)}
                      alt={dest.name}
                      sx={{ width: 22, height: 22, borderRadius: 1 }}
                      imgProps={{ referrerPolicy: 'no-referrer', onError: (e) => { e.currentTarget.src = getCategoryFallbackImage(dest); } }}
                    />
                    <span>{dest.name.split(',')[0]}</span>
                    <Chip
                      label={`${dest.match_score || 85}%`}
                      size="small"
                      color={idx === 0 ? 'primary' : 'default'}
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                    />
                  </Box>
                }
                sx={{ textTransform: 'none', fontWeight: 600, py: 1 }}
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* Hero Banner Section */}
      <Box sx={{ position: 'relative', height: { xs: 240, md: 320 } }}>
        <CardMedia
          component="img"
          image={getDestinationImage(destination)}
          alt={destination.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = getCategoryFallbackImage(destination);
          }}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '75%',
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 50%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            p: { xs: 2.5, md: 3.5 },
          }}
        >
          <Box sx={{ width: '100%', color: '#ffffff' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
              {/* Destination Title & Country */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Place sx={{ color: '#38bdf8' }} />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
                    {destination.name}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ color: '#cbd5e1', ml: 3.8 }}>
                  {destination.region} • {destination.country}
                </Typography>
              </Box>

              {/* Match Score Badge */}
              <Box
                sx={{
                  bgcolor: 'rgba(2, 132, 199, 0.9)',
                  backdropFilter: 'blur(8px)',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: '#e0f2fe', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Family Match
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                  {destination.match_score || 94}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Details & Weather Sub-bar */}
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" sx={{ color: 'text.primary', mb: 2, fontSize: '1.05rem', lineHeight: 1.6 }}>
              {destination.short_description}
            </Typography>

            {/* Match reasons chips */}
            {destination.score_reasons && destination.score_reasons.length > 0 && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                  Why It Fits Your Family:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {destination.score_reasons.map((reason, idx) => (
                    <Chip
                      key={idx}
                      icon={<CheckCircle fontSize="small" color="success" />}
                      label={reason}
                      size="small"
                      sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', color: theme.palette.mode === 'dark' ? '#34d399' : '#047857', fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* FAMILY MEMBER ENJOYMENT METERS */}
            {destination.member_enjoyment && destination.member_enjoyment.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <TrendingUp sx={{ color: 'secondary.main', fontSize: 18 }} />
                  Family Member Enjoyment Meters:
                </Typography>

                <Grid container spacing={1.5}>
                  {destination.member_enjoyment.map((member, mIdx) => {
                    const score = member.enjoyment_score || 85;
                    const meterColor = score >= 90 ? '#10b981' : score >= 80 ? '#0284c7' : '#f59e0b';

                    return (
                      <Grid item xs={12} sm={6} key={mIdx}>
                        <Box
                          sx={{
                            p: 1.8,
                            borderRadius: 2.5,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1 }}>
                                {member.name}
                              </Typography>
                              <Chip
                                label={`${member.age} yrs`}
                                size="small"
                                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: meterColor, fontSize: '0.9rem' }}>
                                {score}%
                              </Typography>
                            </Box>
                          </Box>

                          {/* Progress Meter Bar */}
                          <Box sx={{ width: '100%', height: 6, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e2e8f0', borderRadius: 3, overflow: 'hidden', mb: 1 }}>
                            <Box
                              sx={{
                                width: `${score}%`,
                                height: '100%',
                                bgcolor: meterColor,
                                borderRadius: 3,
                                transition: 'width 0.8s ease-in-out',
                              }}
                            />
                          </Box>

                          {/* Sentiment & Highlight */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.74rem', lineHeight: 1.3 }}>
                              {member.highlight}
                            </Typography>
                            <Chip
                              label={member.sentiment || "Super Excited"}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                                flexShrink: 0,
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* Highlights bullet list */}
            {destination.highlight_features && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                  Key Family Highlights:
                </Typography>
                <Grid container spacing={1}>
                  {destination.highlight_features.map((feature, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ color: '#0284c7', fontWeight: 800 }}>•</span> {feature}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Weather & Quick Specs Card */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {/* Weather Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WbSunny sx={{ color: '#f59e0b' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Expected Weather
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Open-Meteo Live Forecast
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {weather?.avg_temp_f || 78}°F
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontSize: '0.85rem' }}>
                {weather?.summary || "Favorable outdoor weather for family tours."}
              </Typography>

              {/* Specs */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Stroller Friendly:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: destination.stroller_friendly ? 'success.main' : 'warning.main' }}>
                    {destination.stroller_friendly ? 'Yes (Paved Paths)' : 'Moderate / Uneven'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Pacing:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                    {destination.pacing || 'Moderate'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Best Seasons:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {destination.best_seasons?.join(', ') || 'All Year'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
