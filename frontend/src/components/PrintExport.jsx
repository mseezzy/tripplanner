import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import { Download, Print, Close, Share as ShareIcon } from '@mui/icons-material';

export default function PrintExport({ open, onClose, tripData, onOpenShare }) {
  if (!tripData) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tripData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `family-trip-${tripData.destination?.id || 'plan'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Export / Share Family Travel Plan
        <Button size="small" onClick={onClose} color="inherit">
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You can print this plan directly to a formatted PDF guide, share via Email/SMS, or download the structured JSON file.
        </Typography>

        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {tripData.destination?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {tripData.family_profile_summary?.total_travelers} Travelers • {tripData.itinerary?.length} Days
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mt: 0.5 }}>
            Estimated Total Budget: ${tripData.budget_summary?.total_budget_range?.realistic?.toLocaleString()} (Realistic Standard)
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={() => {
            onClose();
            if (onOpenShare) onOpenShare();
          }}
        >
          Share (SMS/Email)
        </Button>
        <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadJSON}>
          Download JSON
        </Button>
        <Button variant="contained" startIcon={<Print />} onClick={handlePrint}>
          Print to PDF / Paper
        </Button>
      </DialogActions>
    </Dialog>
  );
}
