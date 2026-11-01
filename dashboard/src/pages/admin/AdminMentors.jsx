
import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  Avatar,
} from "@mui/material";

import {
  Search,
  Visibility,
  Add,
  Psychology,
  VerifiedUser,
  PendingActions,
} from "@mui/icons-material";

import { getMentors, saveMentors } from "../../data/dummyMentors";

const emptyForm = {
  name: "",
  email: "",
  category: "Pengembangan Diri",
  specialization: "",
  experience: 0,
};

export default function AdminMentors() {
  const [mentors, setMentors] = useState(getMentors);
  const [search, setSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const updateMentors = (updated) => {
    setMentors(updated);
    saveMentors(updated);
  };

  const filteredMentors = useMemo(() => {
    const keyword = search.toLowerCase();

    return mentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(keyword) ||
        mentor.email.toLowerCase().includes(keyword) ||
        mentor.specialization.toLowerCase().includes(keyword)
    );
  }, [mentors, search]);

  const verifiedCount = mentors.filter(
    (mentor) => mentor.verification === "verified"
  ).length;

  const pendingCount = mentors.filter(
    (mentor) => mentor.verification === "pending"
  ).length;

  const handleAddMentor = (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();

    if (
      mentors.some(
        (mentor) => mentor.email.toLowerCase() === email
      )
    ) {
      alert("Email mentor sudah terdaftar.");
      return;
    }

    const newMentor = {
      ...form,
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email,
      experience: Number(form.experience),
      verification: "pending",
      status: "inactive",
    };

    updateMentors([...mentors, newMentor]);
    setFormOpen(false);
    setForm(emptyForm);
  };

  const handleVerify = (mentor) => {
    const updated = mentors.map((item) =>
      item.id === mentor.id
        ? { ...item, verification: "verified" }
        : item
    );

    updateMentors(updated);
    setSelectedMentor(null);
  };

  const handleToggleStatus = (mentor) => {
    if (
      mentor.status !== "active" &&
      mentor.verification !== "verified"
    ) {
      alert("Mentor harus diverifikasi terlebih dahulu.");
      return;
    }

    const updated = mentors.map((item) =>
      item.id === mentor.id
        ? {
            ...item,
            status:
              item.status === "active"
                ? "inactive"
                : "active",
          }
        : item
    );

    updateMentors(updated);
    setSelectedMentor(null);
  };

  const stats = [
    {
      title: "Total Mentor",
      value: mentors.length,
      icon: <Psychology color="primary" />,
    },
    {
      title: "Terverifikasi",
      value: verifiedCount,
      icon: <VerifiedUser color="success" />,
    },
    {
      title: "Menunggu Verifikasi",
      value: pendingCount,
      icon: <PendingActions color="warning" />,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700}>
        Manajemen Mentor 🌷
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Kelola mentor pengembangan diri dan psikolog HERa.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Mode demo: verifikasi dan status mentor hanya simulasi.
        Tidak menunjukkan kredensial profesional yang telah diperiksa.
      </Alert>

      {/* Statistik */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {stats.map((item) => (
          <Card key={item.title} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                {item.icon}

                <Typography color="text.secondary">
                  {item.title}
                </Typography>

                <Typography variant="h4" fontWeight={700}>
                  {item.value}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tabel Mentor */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" fontWeight={700}>
              Daftar Mentor
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <TextField
                size="small"
                placeholder="Cari mentor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setFormOpen(true)}
              >
                Tambah Mentor
              </Button>
            </Stack>
          </Stack>

          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F3EDF9" }}>
                  <TableCell>Mentor</TableCell>
                  <TableCell>Kategori</TableCell>
                  <TableCell>Keahlian</TableCell>
                  <TableCell>Verifikasi</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredMentors.map((mentor) => (
                  <TableRow hover key={mentor.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          {mentor.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>
                            {mentor.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {mentor.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{mentor.category}</TableCell>
                    <TableCell>{mentor.specialization}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          mentor.verification === "verified"
                            ? "Terverifikasi"
                            : "Menunggu"
                        }
                        color={
                          mentor.verification === "verified"
                            ? "success"
                            : "warning"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          mentor.status === "active"
                            ? "Aktif"
                            : "Nonaktif"
                        }
                        color={
                          mentor.status === "active"
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => setSelectedMentor(mentor)}
                        aria-label={`Lihat detail ${mentor.name}`}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredMentors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Tidak ada mentor ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detail Mentor */}
      <Dialog
        open={Boolean(selectedMentor)}
        onClose={() => setSelectedMentor(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detail Mentor</DialogTitle>

        <DialogContent dividers>
          {selectedMentor && (
            <Stack spacing={2}>
              <Typography>
                <strong>Nama:</strong> {selectedMentor.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedMentor.email}
              </Typography>
              <Typography>
                <strong>Kategori:</strong> {selectedMentor.category}
              </Typography>
              <Typography>
                <strong>Keahlian:</strong> {selectedMentor.specialization}
              </Typography>
              <Typography>
                <strong>Pengalaman:</strong>{" "}
                {selectedMentor.experience} tahun
              </Typography>
              <Typography>
                <strong>Verifikasi:</strong>{" "}
                {selectedMentor.verification === "verified"
                  ? "Terverifikasi (Demo)"
                  : "Menunggu"}
              </Typography>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, flexWrap: "wrap" }}>
          <Button onClick={() => setSelectedMentor(null)}>
            Tutup
          </Button>

          {selectedMentor?.verification === "pending" && (
            <Button
              variant="outlined"
              onClick={() => handleVerify(selectedMentor)}
            >
              Verifikasi Demo
            </Button>
          )}

          {selectedMentor && (
            <Button
              variant="contained"
              color={
                selectedMentor.status === "active"
                  ? "error"
                  : "success"
              }
              onClick={() => handleToggleStatus(selectedMentor)}
            >
              {selectedMentor.status === "active"
                ? "Nonaktifkan"
                : "Aktifkan"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Tambah Mentor */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleAddMentor}>
          <DialogTitle>Tambah Mentor</DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Nama Lengkap"
                required
                fullWidth
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <TextField
                select
                label="Kategori Mentor"
                fullWidth
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <MenuItem value="Pengembangan Diri">
                  Pengembangan Diri
                </MenuItem>
                <MenuItem value="Psikolog">
                  Psikolog
                </MenuItem>
              </TextField>

              <TextField
                label="Bidang Keahlian"
                required
                fullWidth
                value={form.specialization}
                onChange={(e) =>
                  setForm({
                    ...form,
                    specialization: e.target.value,
                  })
                }
              />

              <TextField
                label="Pengalaman (Tahun)"
                type="number"
                fullWidth
                slotProps={{
                  htmlInput: { min: 0, max: 60 },
                }}
                value={form.experience}
                onChange={(e) =>
                  setForm({
                    ...form,
                    experience: e.target.value,
                  })
                }
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setFormOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="contained">
              Simpan Mentor
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
