import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  CircularProgress,
  useTheme,
  Alert
} from '@mui/material';
import {
  PersonAdd,
  Delete,
  FlightTakeoff,
  Place,
  DateRange,
  FamilyRestroom,
  AttachMoney,
  AutoAwesome,
  ThumbUp,
  ThumbDown,
  ChildCare,
  SportsEsports,
  Park,
  BeachAccess,
  Pets,
  Museum,
  Restaurant,
  Pool,
  Terrain,
  Spa
} from '@mui/icons-material';

const AVAILABLE_LIKES = [
  { id: 'theme_parks', label: 'Theme Parks', icon: <SportsEsports fontSize="small" /> },
  { id: 'nature', label: 'Nature & Hiking', icon: <Park fontSize="small" /> },
  { id: 'beaches', label: 'Beaches & Ocean', icon: <BeachAccess fontSize="small" /> },
  { id: 'animals_wildlife', label: 'Animals & Wildlife', icon: <Pets fontSize="small" /> },
  { id: 'science_museums', label: 'Science & Museums', icon: <Museum fontSize="small" /> },
  { id: 'food_culinary', label: 'Food & Culinary', icon: <Restaurant fontSize="small" /> },
  { id: 'water_parks', label: 'Water Parks & Pools', icon: <Pool fontSize="small" /> },
  { id: 'adventure', label: 'Outdoor Adventure', icon: <Terrain fontSize="small" /> },
  { id: 'relaxing', label: 'Relaxing & Spas', icon: <Spa fontSize="small" /> },
];

const AVAILABLE_DISLIKES = [
  { id: 'avoid_heat', label: 'Avoid Extreme Heat' },
  { id: 'avoid_crowds', label: 'Avoid Dense Crowds' },
  { id: 'avoid_strenuous_hiking', label: 'No Strenuous Hikes' },
  { id: 'stroller_friendly', label: 'Must Be Stroller Friendly' },
  { id: 'avoid_expensive_dining', label: 'Avoid High-Cost Dining' },
];

const PRESETS = [
  {
    name: 'Multi-Stop: Florida + Cancun (2 Stops, 7d)',
    members: [
      { name: 'Mom (Sarah)', age: 36, role: 'Adult', likes: ['relaxing', 'food_culinary', 'beaches'] },
      { name: 'Dad (David)', age: 37, role: 'Adult', likes: ['theme_parks', 'food_culinary'] },
      { name: 'Emma', age: 6, role: 'Child', likes: ['theme_parks', 'animals_wildlife', 'water_parks'] },
      { name: 'Leo', age: 2, role: 'Toddler', likes: ['water_parks', 'animals_wildlife'] }
    ],
    likes: ['beaches'],
    dislikes: ['stroller_friendly'],
    destinations: [
      { id: 'stop-1', destination: 'Orlando, Florida', duration_days: 4 },
      { id: 'stop-2', destination: 'Cancun & Riviera Maya, Mexico', duration_days: 3 }
    ]
  },
  {
    name: 'Family with Teens (Yellowstone)',
    members: [
      { name: 'Mom', age: 44, role: 'Adult', likes: ['nature', 'relaxing', 'food_culinary'] },
      { name: 'Dad', age: 46, role: 'Adult', likes: ['adventure', 'nature', 'hiking'] },
      { name: 'Jack', age: 16, role: 'Teen', likes: ['adventure', 'theme_parks', 'water_parks'] },
      { name: 'Maya', age: 13, role: 'Teen', likes: ['animals_wildlife', 'science_museums', 'adventure'] }
    ],
    likes: ['nature', 'adventure'],
    dislikes: ['avoid_crowds'],
    destinations: [
      { id: 'stop-1', destination: 'Yellowstone & Grand Teton, Wyoming', duration_days: 5 }
    ]
  },
  {
    name: 'Euro Trip: London + Barcelona (2 Stops, 8d)',
    members: [
      { name: 'Mom', age: 38, role: 'Adult', likes: ['beaches', 'food_culinary', 'science_museums'] },
      { name: 'Dad', age: 39, role: 'Adult', likes: ['science_museums', 'food_culinary'] },
      { name: 'Sophia', age: 11, role: 'Tween', likes: ['science_museums', 'animals_wildlife', 'theme_parks'] }
    ],
    likes: ['food_culinary'],
    dislikes: ['avoid_heat'],
    destinations: [
      { id: 'stop-1', destination: 'London, United Kingdom', duration_days: 4 },
      { id: 'stop-2', destination: 'Barcelona, Spain', duration_days: 4 }
    ]
  }
];

export default function FamilyForm({ onSubmit, loading, initialValues }) {
  const theme = useTheme();

  const [familyMembers, setFamilyMembers] = useState(
    initialValues?.family_members?.length > 0
      ? initialValues.family_members
      : [
          { name: 'Parent 1', age: 36, role: 'Adult', likes: ['relaxing', 'food_culinary'] },
          { name: 'Parent 2', age: 34, role: 'Adult', likes: ['theme_parks', 'food_culinary'] },
          { name: 'Child 1', age: 7, role: 'Child', likes: ['theme_parks', 'animals_wildlife', 'water_parks'] },
          { name: 'Toddler', age: 2, role: 'Toddler', likes: ['water_parks', 'animals_wildlife'] },
        ]
  );

  const [likes, setLikes] = useState(initialValues?.likes || ['beaches']);
  const [dislikes, setDislikes] = useState(initialValues?.dislikes || ['stroller_friendly']);
  const [startDate, setStartDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]);
  
  // Multi-destination stops state
  const [tripStops, setTripStops] = useState(
    initialValues?.destinations?.length > 0
      ? initialValues.destinations
      : initialValues?.preferred_destination
      ? [{ id: 'stop-1', destination: initialValues.preferred_destination, duration_days: initialValues.duration_days || 5 }]
      : [{ id: 'stop-1', destination: 'Orlando, Florida', duration_days: 4 }]
  );

  const [originCity, setOriginCity] = useState(initialValues?.origin_city || 'Chicago (ORD)');
  const [budgetTier, setBudgetTier] = useState(initialValues?.budget_tier || 'moderate');

  const addDestinationStop = () => {
    setTripStops([
      ...tripStops,
      { id: `stop-${Date.now()}`, destination: '', duration_days: 3 }
    ]);
  };

  const removeDestinationStop = (idx) => {
    if (tripStops.length > 1) {
      setTripStops(tripStops.filter((_, i) => i !== idx));
    }
  };

  const updateDestinationStop = (idx, field, val) => {
    const updated = [...tripStops];
    updated[idx][field] = val;
    setTripStops(updated);
  };

  const moveStopUp = (idx) => {
    if (idx === 0) return;
    const updated = [...tripStops];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setTripStops(updated);
  };

  const moveStopDown = (idx) => {
    if (idx === tripStops.length - 1) return;
    const updated = [...tripStops];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setTripStops(updated);
  };

  const totalDurationDays = tripStops.reduce((acc, s) => acc + (parseInt(s.duration_days, 10) || 1), 0);

  const addMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: `Member ${familyMembers.length + 1}`, age: 10, role: 'Tween', likes: ['theme_parks', 'adventure'] }
    ]);
  };

  const removeMember = (index) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    if (field === 'age') {
      const ageNum = parseInt(value, 10) || 0;
      if (ageNum <= 3) updated[index].role = 'Toddler (0-3)';
      else if (ageNum <= 8) updated[index].role = 'Child (4-8)';
      else if (ageNum <= 12) updated[index].role = 'Tween (9-12)';
      else if (ageNum <= 17) updated[index].role = 'Teen (13-17)';
      else updated[index].role = 'Adult (18+)';
    }
    setFamilyMembers(updated);
  };

  const toggleMemberLike = (memberIndex, likeId) => {
    const updated = [...familyMembers];
    const memberLikes = updated[memberIndex].likes || [];
    if (memberLikes.includes(likeId)) {
      updated[memberIndex].likes = memberLikes.filter(l => l !== likeId);
    } else {
      updated[memberIndex].likes = [...memberLikes, likeId];
    }
    setFamilyMembers(updated);
  };

  const toggleLike = (id) => {
    if (likes.includes(id)) {
      setLikes(likes.filter((l) => l !== id));
    } else {
      setLikes([...likes, id]);
    }
  };

  const toggleDislike = (id) => {
    if (dislikes.includes(id)) {
      setDislikes(dislikes.filter((d) => d !== id));
    } else {
      setDislikes([...dislikes, id]);
    }
  };

  const applyPreset = (preset) => {
    setFamilyMembers(preset.members);
    setLikes(preset.likes);
    setDislikes(preset.dislikes);
    if (preset.destinations) {
      setTripStops(preset.destinations);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      family_members: familyMembers,
      likes,
      dislikes,
      start_date: startDate,
      end_date: endDate,
      duration_days: totalDurationDays,
      destinations: tripStops,
      preferred_destination: tripStops[0]?.destination || '',
      origin_city: originCity,
      budget_tier: budgetTier
    });
  };

  return (
    <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'background.paper', position: 'relative' }}>
      {/* Header & Presets */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Family Trip Profile & Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tell us who is traveling, their ages, and interests to generate matching destinations, flights, lodgings, and activities.
            </Typography>
          </Box>
        </Box>

        {/* Quick presets pills */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Quick Presets:
          </Typography>
          {PRESETS.map((p, idx) => (
            <Chip
              key={idx}
              label={p.name}
              size="small"
              variant="outlined"
              onClick={() => applyPreset(p)}
              sx={{ cursor: 'pointer', borderColor: 'primary.light', '&:hover': { bgcolor: 'primary.subtle' } }}
            />
          ))}
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* SECTION 1: FAMILY MEMBERS */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FamilyRestroom color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Family Travelers ({familyMembers.length} People)
                  </Typography>
                </Box>
                <Button
                  startIcon={<PersonAdd />}
                  size="small"
                  variant="contained"
                  onClick={addMember}
                  sx={{ borderRadius: 2 }}
                >
                  Add Person
                </Button>
              </Box>

              <Grid container spacing={2}>
                {familyMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Chip
                            label={member.role || (member.age <= 3 ? 'Toddler' : member.age <= 12 ? 'Child' : member.age <= 17 ? 'Teen' : 'Adult')}
                            size="small"
                            color={member.age <= 3 ? 'secondary' : member.age <= 12 ? 'info' : member.age <= 17 ? 'warning' : 'primary'}
                            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                          />
                          {familyMembers.length > 1 && (
                            <IconButton size="small" onClick={() => removeMember(index)} color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                        <TextField
                          fullWidth
                          size="small"
                          label="Name / Label"
                          value={member.name}
                          onChange={(e) => updateMember(index, 'name', e.target.value)}
                          sx={{ mb: 1.5 }}
                        />
                        <Box sx={{ px: 0.5, mb: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Age:
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>
                              {member.age} yrs
                            </Typography>
                          </Box>
                          <Slider
                            value={member.age}
                            min={0}
                            max={80}
                            size="small"
                            onChange={(_, val) => updateMember(index, 'age', val)}
                            valueLabelDisplay="auto"
                          />
                        </Box>

                        {/* Individual Member Interests */}
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.8, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                          🎯 {member.name.split(' ')[0]}'s Top Interests:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                          {AVAILABLE_LIKES.map((like) => {
                            const isSelected = (member.likes || []).includes(like.id);
                            return (
                              <Chip
                                key={like.id}
                                label={like.label.split(' ')[0]} // Compact label
                                size="small"
                                onClick={() => toggleMemberLike(index, like.id)}
                                color={isSelected ? 'primary' : 'default'}
                                variant={isSelected ? 'filled' : 'outlined'}
                                sx={{
                                  fontSize: '0.68rem',
                                  height: 22,
                                  cursor: 'pointer',
                                  fontWeight: isSelected ? 700 : 500,
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* SECTION 2: LIKES & INTERESTS */}
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <ThumbUp fontSize="small" color="primary" />
              Family Likes & Activities of Interest
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {AVAILABLE_LIKES.map((like) => {
                const isSelected = likes.includes(like.id);
                return (
                  <Chip
                    key={like.id}
                    icon={like.icon}
                    label={like.label}
                    onClick={() => toggleLike(like.id)}
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      py: 2,
                      px: 0.5,
                      fontWeight: isSelected ? 700 : 500,
                      transition: 'all 0.15s ease',
                      '&:hover': { transform: 'translateY(-1px)' },
                    }}
                  />
                );
              })}
            </Box>
          </Grid>

          {/* SECTION 3: DISLIKES & CONSTRAINTS */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <ThumbDown fontSize="small" color="secondary" />
              Dislikes & Travel Constraints
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {AVAILABLE_DISLIKES.map((dislike) => {
                const isSelected = dislikes.includes(dislike.id);
                return (
                  <Chip
                    key={dislike.id}
                    label={dislike.label}
                    onClick={() => toggleDislike(dislike.id)}
                    color={isSelected ? 'secondary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  />
                );
              })}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* SECTION 4: MULTI-DESTINATION TRIP ROUTE BUILDER */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Place color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Trip Destinations & Route Order
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`Total: ${totalDurationDays} Days (${tripStops.length} ${tripStops.length === 1 ? 'Stop' : 'Stops'})`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                  <Button
                    startIcon={<Place />}
                    size="small"
                    variant="outlined"
                    onClick={addDestinationStop}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Add Stop
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {tripStops.map((stop, idx) => (
                  <Grid item xs={12} key={stop.id || idx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { md: 'center' },
                        gap: 2,
                      }}
                    >
                      {/* Stop Sequence Indicator & Order Buttons */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { md: 150 } }}>
                        <Chip
                          label={`Stop ${idx + 1}`}
                          color={idx === 0 ? "primary" : "secondary"}
                          sx={{ fontWeight: 800 }}
                        />
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Move Stop Earlier (Up)">
                            <span>
                              <IconButton
                                size="small"
                                disabled={idx === 0}
                                onClick={() => moveStopUp(idx)}
                              >
                                ▲
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Move Stop Later (Down)">
                            <span>
                              <IconButton
                                size="small"
                                disabled={idx === tripStops.length - 1}
                                onClick={() => moveStopDown(idx)}
                              >
                                ▼
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Destination Name Input */}
                      <TextField
                        fullWidth
                        size="small"
                        label={`Destination #${idx + 1}`}
                        placeholder="e.g. Orlando, FL, Yellowstone, London, Cancun, Tokyo"
                        value={stop.destination}
                        onChange={(e) => updateDestinationStop(idx, 'destination', e.target.value)}
                        InputProps={{
                          startAdornment: <Place sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                        }}
                      />

                      {/* Duration Input for this specific stop */}
                      <Box sx={{ minWidth: { md: 170 } }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Stay Duration (Days)"
                          value={stop.duration_days}
                          inputProps={{ min: 1, max: 30 }}
                          onChange={(e) => updateDestinationStop(idx, 'duration_days', parseInt(e.target.value, 10) || 1)}
                          InputProps={{
                            startAdornment: <DateRange sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                          }}
                        />
                      </Box>

                      {/* Remove Stop Button */}
                      {tripStops.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeDestinationStop(idx)}
                          sx={{ alignSelf: { xs: 'flex-end', md: 'center' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* SECTION 5: ORIGIN & BUDGET TIER */}
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              label="Departure City / Airport (Roundtrip Origin)"
              placeholder="e.g. Chicago (ORD), New York (JFK)"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              InputProps={{
                startAdornment: <FlightTakeoff sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <InputLabel>Budget Tier</InputLabel>
              <Select
                value={budgetTier}
                label="Budget Tier"
                onChange={(e) => setBudgetTier(e.target.value)}
              >
                <MenuItem value="budget">$ Economy / Budget</MenuItem>
                <MenuItem value="moderate">$$ Moderate (Family Standard)</MenuItem>
                <MenuItem value="upscale">$$$ Upscale Comfort</MenuItem>
                <MenuItem value="luxury">$$$$ Luxury Resorts</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* SUBMIT BUTTON */}
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
              sx={{
                py: 1.8,
                fontSize: '1.05rem',
                fontWeight: 800,
                borderRadius: 3,
                background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0369a1 0%, #075985 100%)',
                }
              }}
            >
              {loading ? "Analyzing Family Profile & Estimating Prices..." : "Generate Family Travel Recommendations & Price Ranges"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}
