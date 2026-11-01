import { useMemo, useState } from "react";
import {
  Box, Typography, Paper, Grid, Stack, Chip, TextField, InputAdornment,
  MenuItem, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Button, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Avatar
} from "@mui/material";
import {
  Search, EventAvailable, CheckCircle, HourglassEmpty,
  Visibility, TaskAlt
} from "@mui/icons-material";

const initialConsultations = [
  { id: 1, user: "Aulia Rahma", mentor: "Nadia Rahma", topic: "Manajemen Waktu", date: "2026-11-05", time: "10:00", status: "Menunggu" },
  { id: 2, user: "Salsabila Putri", mentor: "Dina Maharani", topic: "Pengembangan Diri", date: "2026-11-06", time: "13:00", status: "Menunggu" },
  { id: 3, user: "Rani Oktaviani", mentor: "Nadia Rahma", topic: "Karier", date: "2026-11-07", time: "09:00", status: "Terjadwal" },
  { id: 4, user: "Dewi Ananda", mentor: "Dina Maharani", topic: "Public Speaking", date: "2026-10-29", time: "14:00", status: "Selesai" },
  { id: 5, user: "Fitri Lestari", mentor: "Nadia Rahma", topic: "Kepemimpinan", date: "2026-10-30", time: "10:00", status: "Dibatalkan" },
];

const statusColors = {
  Menunggu: "warning", Terjadwal: "info", Selesai: "success", Dibatalkan: "error"
};

export default function AdminConsultations() {
  const consultations = initialConsultations;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => consultations.filter((item) => {
    const keyword = `${item.user} ${item.mentor} ${item.topic}`.toLowerCase();
    return keyword.includes(search.toLowerCase()) &&
      (statusFilter === "Semua" || item.status === statusFilter);
  }), [consultations, search, statusFilter]);

  const count = (status) => consultations.filter((item) => item.status === status).length;
  const stats = [
    { title: "Total Konsultasi", value: consultations.length, icon: <EventAvailable color="primary" /> },
    { title: "Menunggu", value: count("Menunggu"), icon: <HourglassEmpty color="warning" /> },
    { title: "Terjadwal", value: count("Terjadwal"), icon: <CheckCircle color="info" /> },
    { title: "Selesai", value: count("Selesai"), icon: <TaskAlt color="success" /> },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Monitoring Konsultasi</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Pantau permintaan dan jadwal konsultasi antara pengguna dan mentor.
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Mode demo: data konsultasi adalah contoh. Admin hanya dapat memantau; persetujuan, penolakan, dan penyelesaian sesi menjadi tanggung jawab mentor.
      </Alert>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper sx={{ p: 2.5, borderRadius: 3, height: "100%" }} elevation={2}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                {stat.icon}<Typography color="text.secondary">{stat.title}</Typography>
              </Stack>
              <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }} elevation={2}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Daftar Konsultasi</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
          <TextField fullWidth size="small" label="Cari pengguna, mentor, atau topik"
            value={search} onChange={(event) => setSearch(event.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
          <TextField select size="small" label="Status" value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)} sx={{ minWidth: 180 }}>
            {["Semua", "Menunggu", "Terjadwal", "Selesai", "Dibatalkan"].map((value) =>
              <MenuItem key={value} value={value}>{value}</MenuItem>)}
          </TextField>
        </Stack>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ bgcolor: "#F2EBFF" }}>
              <TableRow>
                {['Pengguna', 'Mentor', 'Topik', 'Tanggal', 'Jam', 'Status', 'Aksi'].map((name) =>
                  <TableCell key={name} sx={{ fontWeight: 700 }}>{name}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell><Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 30, height: 30, bgcolor: "#B39DDB", fontSize: 14 }}>{item.user[0]}</Avatar>
                    <Typography variant="body2">{item.user}</Typography>
                  </Stack></TableCell>
                  <TableCell>{item.mentor}</TableCell>
                  <TableCell>{item.topic}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell><Chip label={item.status} size="small" color={statusColors[item.status]} variant="outlined" /></TableCell>
                  <TableCell>
                    <Tooltip title="Lihat detail"><IconButton color="primary" onClick={() => setSelected(item)}><Visibility /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} align="center">Tidak ada konsultasi yang cocok.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Detail Konsultasi</DialogTitle>
        <DialogContent dividers>
          {selected && <Stack spacing={1.5}>
            <Typography><strong>Pengguna:</strong> {selected.user}</Typography>
            <Typography><strong>Mentor:</strong> {selected.mentor}</Typography>
            <Typography><strong>Topik:</strong> {selected.topic}</Typography>
            <Typography><strong>Tanggal:</strong> {selected.date}</Typography>
            <Typography><strong>Jam:</strong> {selected.time}</Typography>
            <Box><Chip label={selected.status} color={statusColors[selected.status]} size="small" /></Box>
          </Stack>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
