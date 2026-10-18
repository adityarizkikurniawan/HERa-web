
import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Chip,
  Alert,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";

import {
  CalendarMonth,
  Favorite,
  Delete,
  ChevronLeft,
  ChevronRight,
  Info,
} from "@mui/icons-material";

const STORAGE_KEY = "hera_demo_period_history";

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function PeriodTracker() {
  const [startDate, setStartDate] = useState("");
  const [periodLength, setPeriodLength] = useState(5);
  const [cycleLength, setCycleLength] = useState(28);
  const [message, setMessage] = useState("");

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const sortedHistory = [...history].sort(
    (a, b) => b.startDate.localeCompare(a.startDate)
  );

  const latest = sortedHistory[0];

  const nextPeriod = latest
    ? addDays(parseDate(latest.startDate), latest.cycleLength)
    : null;

  // Perkiraan sederhana: ovulasi sekitar 14 hari
  // sebelum menstruasi berikutnya.
  const ovulation = nextPeriod
    ? addDays(nextPeriod, -14)
    : null;

  // Rentang perkiraan sekitar ovulasi, bukan jaminan
  // masa subur atau masa tidak subur.
  const fertileStart = ovulation
    ? addDays(ovulation, -5)
    : null;

  const fertileEnd = ovulation
    ? addDays(ovulation, 1)
    : null;

  const handleSave = () => {
    if (!startDate) {
      setMessage("Pilih tanggal mulai menstruasi.");
      return;
    }

    const duration = Number(periodLength);
    const cycle = Number(cycleLength);

    if (
      !Number.isInteger(duration) ||
      !Number.isInteger(cycle) ||
      duration < 1 ||
      duration > 15 ||
      cycle < 15 ||
      cycle > 60
    ) {
      setMessage("Periksa kembali lama menstruasi dan panjang siklus.");
      return;
    }

    if (parseDate(startDate) > new Date()) {
      setMessage("Tanggal mulai tidak boleh berada di masa depan.");
      return;
    }

    if (history.some((item) => item.startDate === startDate)) {
      setMessage("Tanggal mulai ini sudah pernah dicatat.");
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      startDate,
      periodLength: duration,
      cycleLength: cycle,
    };

    setHistory((prev) => [entry, ...prev]);
    setCurrentMonth(
      new Date(
        parseDate(startDate).getFullYear(),
        parseDate(startDate).getMonth(),
        1
      )
    );
    setStartDate("");
    setMessage("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Hapus catatan menstruasi ini?")) return;

    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const changeMonth = (offset) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getDayType = (date) => {
    const key = dateKey(date);

    const recorded = history.some((entry) => {
      const start = parseDate(entry.startDate);
      const end = addDays(start, entry.periodLength - 1);
      return key >= dateKey(start) && key <= dateKey(end);
    });

    if (recorded) return "recorded";

    if (nextPeriod) {
      const predictedEnd = addDays(
        nextPeriod,
        latest.periodLength - 1
      );

      if (
        key >= dateKey(nextPeriod) &&
        key <= dateKey(predictedEnd)
      ) {
        return "predicted";
      }
    }

    if (
      fertileStart &&
      fertileEnd &&
      key >= dateKey(fertileStart) &&
      key <= dateKey(fertileEnd)
    ) {
      return "fertile";
    }

    return "normal";
  };

  const dayColors = {
    recorded: "#F48FB1",
    predicted: "#FCE4EC",
    fertile: "#E1BEE7",
    normal: "transparent",
  };

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Period Tracker 🌸
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Catat siklus menstruasimu dan lihat perkiraan periode berikutnya.
      </Typography>

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        Hasil prediksi hanya estimasi berdasarkan kalender.
        Ovulasi dapat berubah, terutama jika siklus tidak teratur.
        Jangan gunakan prediksi ini sebagai alat kontrasepsi.
      </Alert>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <Favorite color="secondary" />
              <Typography variant="h6" fontWeight="bold">
                Catat Menstruasi
              </Typography>
            </Stack>

            <Stack spacing={3}>
              <TextField
                label="Tanggal Mulai Menstruasi"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: dateKey(new Date()) },
                }}
              />

              <TextField
                label="Lama Menstruasi (Hari)"
                type="number"
                fullWidth
                value={periodLength}
                onChange={(e) => setPeriodLength(e.target.value)}
                slotProps={{
                  htmlInput: { min: 1, max: 15 },
                }}
                helperText="Contoh: 5 hari"
              />

              <TextField
                label="Panjang Siklus (Hari)"
                type="number"
                fullWidth
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                slotProps={{
                  htmlInput: { min: 15, max: 60 },
                }}
                helperText="Dihitung dari hari pertama menstruasi ke hari pertama menstruasi berikutnya."
              />

              {message && (
                <Alert severity="warning">{message}</Alert>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSave}
              >
                Simpan Catatan
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Perkiraan Siklus
            </Typography>

            {!latest ? (
              <Typography color="text.secondary">
                Belum ada catatan menstruasi. Isi formulir terlebih dahulu.
              </Typography>
            ) : (
              <Stack spacing={3}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Menstruasi Terakhir
                  </Typography>
                  <Typography variant="h6">
                    {formatDate(parseDate(latest.startDate))}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Perkiraan Menstruasi Berikutnya
                  </Typography>
                  <Typography variant="h6" color="secondary.main">
                    {formatDate(nextPeriod)}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Perkiraan Ovulasi
                  </Typography>
                  <Typography variant="h6">
                    {formatDate(ovulation)}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Perkiraan Masa Subur
                  </Typography>
                  <Typography>
                    {formatDate(fertileStart)} – {formatDate(fertileEnd)}
                  </Typography>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <IconButton onClick={() => changeMonth(-1)}>
              <ChevronLeft />
            </IconButton>

            <Typography variant="h6" fontWeight="bold">
              {currentMonth.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </Typography>

            <IconButton onClick={() => changeMonth(1)}>
              <ChevronRight />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            {weekdays.map((day) => (
              <Typography
                key={day}
                textAlign="center"
                fontWeight="bold"
                variant="body2"
                sx={{ py: 1 }}
              >
                {day}
              </Typography>
            ))}

            {calendarCells.map((day, index) => {
              if (!day) {
                return <Box key={`empty-${index}`} />;
              }

              const date = new Date(year, month, day, 12);
              const type = getDayType(date);
              const isToday = dateKey(date) === dateKey(new Date());

              return (
                <Paper
                  key={dateKey(date)}
                  elevation={0}
                  sx={{
                    minHeight: { xs: 43, sm: 65 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: dayColors[type],
                    border: isToday
                      ? "2px solid #9575CD"
                      : "1px solid #EEEEEE",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    fontWeight={isToday ? "bold" : "normal"}
                    variant="body2"
                  >
                    {day}
                  </Typography>
                </Paper>
              );
            })}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 3 }}
          >
            <Chip
              size="small"
              label="Menstruasi Tercatat"
              sx={{ bgcolor: "#F48FB1" }}
            />
            <Chip
              size="small"
              label="Prediksi Menstruasi"
              sx={{ bgcolor: "#FCE4EC" }}
            />
            <Chip
              size="small"
              label="Perkiraan Masa Subur"
              sx={{ bgcolor: "#E1BEE7" }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <CalendarMonth color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Riwayat Menstruasi
            </Typography>
            <Chip label={`${history.length} catatan`} size="small" />
          </Stack>

          {sortedHistory.length === 0 ? (
            <Typography color="text.secondary">
              Belum ada riwayat menstruasi.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {sortedHistory.map((entry) => (
                <Box key={entry.id}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography fontWeight="bold">
                        {formatDate(parseDate(entry.startDate))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lama: {entry.periodLength} hari •
                        Siklus: {entry.cycleLength} hari
                      </Typography>
                    </Box>

                    <IconButton
                      color="error"
                      aria-label="Hapus catatan menstruasi"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
