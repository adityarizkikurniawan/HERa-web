
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material";

const STORAGE_KEY = "hera_admin_settings";

const defaultSettings = {
  adminName: "Administrator HERa",
  adminEmail: "admin@hera.demo",
  platformName: "HERa",
  description:
    "Her Empowerment & Resilience Assistant",
};

const paperStyle = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 3,
  border: "1px solid #EEEAF5",
  boxShadow: "0 4px 20px rgba(60,35,100,0.04)",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Gagal membaca pengaturan:", error);
    }

    return defaultSettings;
  });

  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isChanged =
    JSON.stringify(form) !== JSON.stringify(settings);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSave = () => {
    if (
      !form.adminName.trim() ||
      !form.adminEmail.trim() ||
      !form.platformName.trim()
    ) {
      setError("Nama admin, email, dan nama platform wajib diisi.");
      return;
    }

    const emailValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail);

    if (!emailValid) {
      setError("Format email tidak valid.");
      return;
    }

    const updated = {
      adminName: form.adminName.trim(),
      adminEmail: form.adminEmail.trim(),
      platformName: form.platformName.trim(),
      description: form.description.trim(),
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      setSettings(updated);
      setForm(updated);
      setMessage("Pengaturan demo berhasil disimpan.");
    } catch (err) {
      setError("Gagal menyimpan pengaturan di browser.");
    }
  };

  const handleReset = () => {
    setForm({ ...settings });
    setError("");
  };

  return (
    <Box sx={{ maxWidth: 1250, mx: "auto", pb: 5 }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#9575CD",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Admin / Konfigurasi
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#25213B",
              fontSize: { xs: 26, md: 32 },
              mb: 1,
            }}
          >
            Pengaturan Admin
          </Typography>

          <Typography color="text.secondary">
            Kelola informasi administratif dan
            preferensi tampilan HERa.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isChanged}
          sx={{
            bgcolor: "#7E57C2",
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1.4,
            fontWeight: 700,
            "&:hover": { bgcolor: "#673AB7" },
          }}
        >
          Simpan Perubahan
        </Button>
      </Stack>

      <Alert
        severity="info"
        sx={{ mb: 3, borderRadius: 2 }}
      >
        Mode demo: perubahan disimpan di browser.
        Data ini belum mengubah akun login, database,
        atau konfigurasi platform secara global.
      </Alert>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* PROFIL ADMIN */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={paperStyle}>
            <Typography variant="h6" fontWeight={700}>
              Profil Admin
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Informasi tampilan administrator.
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#7E57C2",
                  fontSize: 25,
                  fontWeight: 700,
                }}
              >
                {form.adminName
                  .trim()
                  .charAt(0)
                  .toUpperCase() || "A"}
              </Avatar>

              <Box>
                <Typography fontWeight={700}>
                  {form.adminName || "Administrator"}
                </Typography>
                <Chip
                  label="Administrator"
                  color="secondary"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Nama Admin"
                name="adminName"
                value={form.adminName}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Email Admin"
                name="adminEmail"
                type="email"
                value={form.adminEmail}
                onChange={handleChange}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* INFORMASI SISTEM */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ ...paperStyle, height: "100%" }}>
            <Typography variant="h6" fontWeight={700}>
              Informasi Sistem
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Status pengembangan aplikasi HERa.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {[
              ["Nama Sistem", "HERa"],
              ["Versi", "Frontend Demo"],
              ["Framework", "React.js"],
              ["UI Library", "Material UI"],
              ["Backend", "Belum terhubung"],
              ["Penyimpanan", "Local Storage"],
            ].map(([label, value]) => (
              <Stack
                key={label}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ py: 1.4 }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {label}
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  textAlign="right"
                >
                  {value}
                </Typography>
              </Stack>
            ))}
          </Paper>
        </Grid>

        {/* PREFERENSI PLATFORM */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={paperStyle}>
            <Typography variant="h6" fontWeight={700}>
              Informasi Tampilan Platform
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Pengaturan informasi platform untuk
              kebutuhan demonstrasi frontend.
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  label="Nama Platform"
                  name="platformName"
                  value={form.platformName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <TextField
                  fullWidth
                  label="Deskripsi Platform"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Alert
              severity="warning"
              sx={{ mt: 3, borderRadius: 2 }}
            >
              Nama dan deskripsi di sini belum
              otomatis diterapkan ke sidebar
              atau halaman pengguna.
            </Alert>
          </Paper>
        </Grid>

        {/* ROLE */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={paperStyle}>
            <Typography variant="h6" fontWeight={700}>
              Role Sistem HERa
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Role yang digunakan dalam pengembangan
              HERa saat ini.
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                label="Admin"
                color="secondary"
                variant="outlined"
              />
              <Chip
                label="User Perempuan"
                color="primary"
                variant="outlined"
              />
              <Chip
                label="Mentor"
                color="success"
                variant="outlined"
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* TOMBOL BAWAH */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={!isChanged}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Batalkan Perubahan
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isChanged}
          sx={{
            bgcolor: "#7E57C2",
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            "&:hover": { bgcolor: "#673AB7" },
          }}
        >
          Simpan Pengaturan
        </Button>
      </Stack>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
