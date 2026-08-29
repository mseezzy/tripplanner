import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Map as MapIcon, Place } from '@mui/icons-material';
import L from 'leaflet';

// Fix for default Leaflet marker icon paths in React / Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ChangeMapView({ bounds, center }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], 11);
    }
  }, [bounds, center, map]);
  return null;
}

export default function MapView({ destination, stops = [] }) {
  const theme = useTheme();

  const allStops = stops.length > 0 ? stops.map(s => s.destination) : (destination ? [destination] : []);
  if (allStops.length === 0) return null;

  const validPoints = allStops
    .filter(d => d.coordinates && d.coordinates.lat && d.coordinates.lng)
    .map(d => [d.coordinates.lat, d.coordinates.lng]);

  const centerLat = allStops[0]?.coordinates?.lat || 28.5383;
  const centerLng = allStops[0]?.coordinates?.lng || -81.3792;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
            <MapIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Destination Area Map
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Powered by OpenStreetMap (100% Free Open Geospatial Data)
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            height: 340,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeMapView bounds={validPoints} center={{ lat: centerLat, lng: centerLng }} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {allStops.map((dest, idx) => {
              const dLat = dest.coordinates?.lat;
              const dLng = dest.coordinates?.lng;
              if (!dLat || !dLng) return null;
              return (
                <Marker key={dest.id || idx} position={[dLat, dLng]}>
                  <Popup>
                    <strong>Stop {idx + 1}: {dest.name}</strong>
                    <br />
                    {dest.short_description}
                  </Popup>
                </Marker>
              );
            })}
            {validPoints.length > 1 && (
              <Polyline
                positions={validPoints}
                color="#0284c7"
                dashArray="6, 8"
                weight={3}
              />
            )}
          </MapContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
