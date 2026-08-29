import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Collapse,
  Button,
  Grid
} from '@mui/material';
import { Tune, ArrowDownward, Refresh } from '@mui/icons-material';

import { getAppTheme } from './theme/theme';
import { fetchRecommendations, checkBackendHealth, parseShareableUrl } from './services/api';

import Navbar from './components/Navbar';
import FamilyForm from './components/FamilyForm';
import DestinationCard from './components/DestinationCard';
import FlightCard from './components/FlightCard';
import LodgingCard from './components/LodgingCard';
import ActivityCard from './components/ActivityCard';
import BudgetBreakdown from './components/BudgetBreakdown';
import ItineraryView from './components/ItineraryView';
import MapView from './components/MapView';
import PrintExport from './components/PrintExport';
import ShareDialog from './components/ShareDialog';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [rawParams, setRawParams] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const theme = getAppTheme(darkMode ? 'dark' : 'light');

  // Check backend health & parse URL shared plan on mount
  useEffect(() => {
    checkBackendHealth().then((isHealthy) => {
      setBackendConnected(isHealthy);
    });

    const shared = parseShareableUrl();
    if (shared) {
      setRawParams(shared);
      setLoading(true);
      fetchRecommendations(shared)
        .then((data) => {
          setTripData(data);
          setToast({
            open: true,
            message: `Loaded shared vacation plan for ${data.destination?.name}!`,
            severity: 'success'
          });
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setRawParams(formData);
    try {
      const data = await fetchRecommendations(formData);
      setTripData(data);
      setShowEditForm(false);
      setToast({
        open: true,
        message: `Generated custom recommendations for ${data.destination?.name}!`,
        severity: 'success'
      });
      // Scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: 'Could not generate recommendations. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAlternativeDestination = (selectedDest, stopIdx) => {
    if (!tripData) return;

    // In a multi-destination trip, switch view to the clicked stop while keeping the entire trip state intact
    if (tripData.is_multi_destination && tripData.stops && tripData.stops.length > 1) {
      const targetStop = (typeof stopIdx === 'number' && tripData.stops[stopIdx])
        ? tripData.stops[stopIdx]
        : tripData.stops.find(s => s.destination?.id === selectedDest.id) || tripData.stops[0];

      setTripData(prev => ({
        ...prev,
        destination: targetStop.destination,
        lodging: targetStop.lodging,
        activities: targetStop.activities,
        weather: targetStop.weather,
      }));
      return;
    }

    setLoading(true);
    // Re-run for single destination mode
    fetchRecommendations({
      ...rawParams,
      preferred_destination: selectedDest.name,
      destinations: [{ destination: selectedDest.name, duration_days: tripData.budget_summary?.duration_days || 5 }]
    }).then((newData) => {
      setTripData(newData);
      setLoading(false);
    });
  };

  const handleReset = () => {
    setTripData(null);
    setShowEditForm(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation Bar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          hasResults={Boolean(tripData)}
          onPrint={() => setExportOpen(true)}
          onShare={() => setShareOpen(true)}
          onReset={handleReset}
          backendConnected={backendConnected}
        />

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, flex: 1 }}>
          {/* Initial State: Form */}
          {!tripData ? (
            <Box sx={{ maxWidth: 960, mx: 'auto' }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-1px',
                    mb: 1.5,
                    background: 'linear-gradient(90deg, #0284c7 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Plan the Perfect Family Vacation
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', fontSize: '1.05rem' }}>
                  Input your family members' ages, likes & dislikes, and date range to receive tailored destination recommendations, realistic flight & lodging prices, and curated activities.
                </Typography>
              </Box>

              <FamilyForm onSubmit={handleFormSubmit} loading={loading} initialValues={rawParams} />
            </Box>
          ) : (
            /* Results State */
            <Box>
              {/* Edit preferences button & collapsible form */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }} className="no-print">
                <Button
                  startIcon={<Tune />}
                  variant="outlined"
                  size="small"
                  onClick={() => setShowEditForm(!showEditForm)}
                  sx={{ borderRadius: 2 }}
                >
                  {showEditForm ? "Hide Family Preferences" : "Adjust Family Preferences & Dates"}
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Showing results for {tripData.family_profile_summary?.total_travelers} Travelers
                </Typography>
              </Box>

              <Collapse in={showEditForm} sx={{ mb: 3 }} className="no-print">
                <FamilyForm onSubmit={handleFormSubmit} loading={loading} initialValues={rawParams} />
              </Collapse>

              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                  <CircularProgress size={48} />
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 700 }}>
                    Updating travel recommendations & prices...
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Destination Overview Card */}
                  <DestinationCard
                    destination={tripData.destination}
                    allDestinations={tripData.all_ranked_destinations}
                    onSelectDestination={handleSelectAlternativeDestination}
                    weather={tripData.weather}
                    isMultiDestination={tripData.is_multi_destination}
                    stops={tripData.stops}
                  />

                  {/* High-Level Budget & Price Ranges */}
                  <BudgetBreakdown
                    budgetSummary={tripData.budget_summary}
                    destinationName={tripData.destination?.name}
                  />

                  {/* Flight Recommendations */}
                  <FlightCard
                    flights={tripData.flights}
                    familySize={tripData.family_profile_summary?.total_travelers || 4}
                  />

                  {/* Lodging Recommendations */}
                  <LodgingCard
                    lodging={tripData.lodging}
                    durationNights={tripData.budget_summary?.duration_days || 4}
                    familySize={tripData.family_profile_summary?.total_travelers || 4}
                  />

                  {/* Activities with Labels & Age badges */}
                  <ActivityCard
                    activities={tripData.activities}
                    familySize={tripData.family_profile_summary?.total_travelers || 4}
                  />

                  {/* Day-by-Day Suggested Itinerary */}
                  <ItineraryView
                    itinerary={tripData.itinerary}
                    destinationName={tripData.destination?.name}
                  />

                  {/* OpenStreetMap Area Map */}
                  <MapView destination={tripData.destination} stops={tripData.stops} />
                </Box>
              )}
            </Box>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            textAlign: 'center',
          }}
          className="no-print"
        >
          <Typography variant="body2" color="text.secondary">
            Family Travel Planner • Free Open Source Travel Intelligence Powered by React, Electron & Python
          </Typography>
        </Box>

        {/* Export / Print Modal */}
        <PrintExport
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          tripData={tripData}
          onOpenShare={() => setShareOpen(true)}
        />

        {/* Share via SMS / Email Dialog */}
        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          tripData={tripData}
          rawParams={rawParams}
        />

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={toast.severity} sx={{ borderRadius: 2 }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
