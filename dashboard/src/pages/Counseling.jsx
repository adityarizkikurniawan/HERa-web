
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from "@mui/material";

import {
  SupportAgent,
  CalendarMonth,
  AccessTime,
  Delete,
  EventAvailable,
} from "@mui/icons-material";

const STORAGE_KEY = "hera_demo_counseling";

const counselors = [
  {
    id: 1,
    name: "Konselor Demo A",
    specialty: "Manajemen Stres",
    description:
      "Sesi pendampingan mengenai pengelolaan stres dan keseimbangan aktivitas.",
    initials: "KA",
  },
  {
    id: 2,
    name: "Konselor Demo B",
    specialty: "Pengembangan Diri",
    description:
      "Sesi pendampingan untuk mengenali potensi diri dan membangun kepercayaan diri.",
    initials: "KB",
  },
  {
    id: 3,
    name: "Konselor Demo C",
    specialty: "Akademik & Karier",
    description:
      "Sesi diskusi mengenai tantangan akademik dan perencanaan karier.",
    initials: "KC",
  },
];

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
];

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function Counseling() {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const today = localDateKey(new Date());

  const openBooking = (counselor) => {
    setSelectedCounselor(counselor);
    setDate("");
    setTime("");
    setTopic("");
    setMessage("");
  };

  const closeBooking = () => {
    setSelectedCounselor(null);
    setMessage("");
  };

  const handleBooking = () => {
    if (!selectedCounselor || !date || !time || !topic.trim()) {
      setMessage("Lengkapi tanggal, waktu, dan topik konseling.");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}:00`);

    if (
      date < today ||
      Number.isNaN(selectedDateTime.getTime()) ||
      selectedDateTime <= new Date()
    ) {
      setMessage("Pilih jadwal yang belum berlalu.");
      return;
    }

    const alreadyBooked = bookings.some(
      (booking) =>
        booking.counselorId === selectedCounselor.id &&
        booking.date === date &&
        booking.time === time
    );

    if (alreadyBooked) {
      setMessage("Jadwal tersebut sudah dipilih dalam demo ini.");
      return;
    }

    const newBooking = {
      id: crypto.randomUUID(),
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      specialty: selectedCounselor.specialty,
      date,
      time,
      topic: topic.trim(),
      status: "Simulasi",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setSuccess("Pemesanan simulasi berhasil dibuat.");
    closeBooking();
  };

  const handleCancel = (id) => {
    if (!window.confirm("Batalkan pemesanan simulasi ini?")) {
      return;
    }

    setBookings((prev) =>
      prev.filter((booking) => booking.id !== id)
    );
    setSuccess("Pemesanan simulasi dibatalkan.");
  };

  const sortedBookings = [...bookings].sort(
    (a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Konseling HERa 💜
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Temukan pendampingan dan jadwalkan sesi konseling.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Halaman ini merupakan prototipe frontend.
        Konselor dan jadwal di bawah adalah contoh, bukan
        layanan konseling sungguhan. Jangan memasukkan
        informasi pribadi atau kesehatan yang sensitif.
      </Alert>

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Pilih Konselor
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 5,
        }}
      >
        {counselors.map((counselor) => (
          <Card key={counselor.id}>
            <CardContent sx={{ p: 3, height: "100%" }}>
              <Stack spacing={2} height="100%">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "primary.light",
                    color: "primary.dark",
                  }}
                >
                  {counselor.initials}
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {counselor.name}
                  </Typography>
                  <Chip
                    label={counselor.specialty}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Typography color="text.secondary" variant="body2">
                  {counselor.description}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CalendarMonth />}
                  onClick={() => openBooking(counselor)}
                >
                  Pilih Jadwal
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Riwayat Pemesanan
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {sortedBookings.length === 0 ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
              <EventAvailable
                sx={{ fontSize: 55, color: "primary.light" }}
              />
              <Typography color="text.secondary">
                Belum ada pemesanan konseling.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {sortedBookings.map((booking) => (
                <Box key={booking.id}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {booking.counselorName}
                      </Typography>

                      <Typography color="text.secondary">
                        {booking.specialty}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mt: 1 }}
                      >
                        <Chip
                          icon={<CalendarMonth />}
                          label={formatDate(booking.date)}
                          size="small"
                        />
                        <Chip
                          icon={<AccessTime />}
                          label={booking.time}
                          size="small"
                        />
                        <Chip
                          label={booking.status}
                          size="small"
                          color="info"
                        />
                      </Stack>

                      <Typography sx={{ mt: 2 }}>
                        <strong>Topik:</strong> {booking.topic}
                      </Typography>
                    </Box>

                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<Delete />}
                      onClick={() => handleCancel(booking.id)}
                    >
                      Batalkan
                    </Button>
                  </Stack>

                  <Divider sx={{ mt: 3 }} />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedCounselor)}
        onClose={closeBooking}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Jadwalkan Konseling
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box>
              <Typography fontWeight="bold">
                {selectedCounselor?.name}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {selectedCounselor?.specialty}
              </Typography>
            </Box>

            <TextField
              label="Tanggal Konseling"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
                setMessage("");
              }}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: today },
              }}
            />

            <TextField
              select
              label="Jam Konseling"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setMessage("");
              }}
              fullWidth
              disabled={!date}
            >
              {timeSlots.map((slot) => {
                const booked = bookings.some(
                  (booking) =>
                    booking.counselorId === selectedCounselor?.id &&
                    booking.date === date &&
                    booking.time === slot
                );

                const past =
                  date === today &&
                  new Date(`${date}T${slot}:00`) <= new Date();

                return (
                  <MenuItem
                    key={slot}
                    value={slot}
                    disabled={booked || past}
                  >
                    {slot}
                    {booked ? " — Terpilih dalam demo" : ""}
                  </MenuItem>
                );
              })}
            </TextField>

            <TextField
              label="Topik Konseling"
              placeholder="Contoh: Manajemen waktu dan stres"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              multiline
              minRows={3}
              fullWidth
              slotProps={{
                htmlInput: { maxLength: 200 },
              }}
              helperText="Gunakan topik fiktif untuk pengujian."
            />

            {message && (
              <Alert severity="warning">{message}</Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeBooking}>
            Batal
          </Button>
          <Button
            variant="contained"
            startIcon={<SupportAgent />}
            onClick={handleBooking}
          >
            Buat Pemesanan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
