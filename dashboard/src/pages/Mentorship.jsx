
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
  InputAdornment,
} from "@mui/material";

import {
  School,
  Search,
  Person,
  CalendarMonth,
  Delete,
  Info,
} from "@mui/icons-material";

const STORAGE_KEY = "hera_demo_mentorship";

const mentors = [
  {
    id: 1,
    name: "Mentor Demo A",
    field: "Pengembangan Karier",
    experience: "8 tahun pengalaman",
    description:
      "Membantu peserta menyusun rencana karier, mengembangkan keterampilan profesional, dan mempersiapkan dunia kerja.",
    expertise: [
      "Career Planning",
      "Interview",
      "Personal Branding",
    ],
    initials: "MA",
  },
  {
    id: 2,
    name: "Mentor Demo B",
    field: "Entrepreneurship",
    experience: "6 tahun pengalaman",
    description:
      "Membantu peserta mengembangkan ide bisnis, memahami strategi pemasaran, dan membangun usaha.",
    expertise: [
      "Business Planning",
      "Marketing",
      "Startup",
    ],
    initials: "MB",
  },
  {
    id: 3,
    name: "Mentor Demo C",
    field: "Teknologi & Digital",
    experience: "7 tahun pengalaman",
    description:
      "Membantu peserta mengembangkan kemampuan teknologi dan keterampilan digital.",
    expertise: [
      "Web Development",
      "UI/UX",
      "Digital Skills",
    ],
    initials: "MC",
  },
  {
    id: 4,
    name: "Mentor Demo D",
    field: "Public Speaking",
    experience: "5 tahun pengalaman",
    description:
      "Membantu peserta meningkatkan komunikasi, kepercayaan diri, dan kemampuan presentasi.",
    expertise: [
      "Public Speaking",
      "Communication",
      "Leadership",
    ],
    initials: "MD",
  },
];

const categories = [
  "Semua Bidang",
  "Pengembangan Karier",
  "Entrepreneurship",
  "Teknologi & Digital",
  "Public Speaking",
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

export default function Mentorship() {
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua Bidang");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [dialogMode, setDialogMode] = useState("detail");
  const [date, setDate] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const today = localDateKey(new Date());

  const filteredMentors = mentors.filter((mentor) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      mentor.name.toLowerCase().includes(keyword) ||
      mentor.field.toLowerCase().includes(keyword) ||
      mentor.expertise.some((item) =>
        item.toLowerCase().includes(keyword)
      );

    const matchCategory =
      category === "Semua Bidang" ||
      mentor.field === category;

    return matchSearch && matchCategory;
  });

  const openDetail = (mentor) => {
    setSelectedMentor(mentor);
    setDialogMode("detail");
    setMessage("");
  };

  const openRequest = (mentor) => {
    setSelectedMentor(mentor);
    setDialogMode("request");
    setDate("");
    setGoal("");
    setMessage("");
  };

  const closeDialog = () => {
    setSelectedMentor(null);
    setMessage("");
  };

  const handleRequest = () => {
    if (!selectedMentor || !date || !goal.trim()) {
      setMessage("Tanggal dan tujuan mentorship wajib diisi.");
      return;
    }

    if (date < today) {
      setMessage("Tanggal tidak boleh berada di masa lalu.");
      return;
    }

    if (
      requests.some(
        (request) =>
          request.mentorId === selectedMentor.id &&
          request.date === date
      )
    ) {
      setMessage(
        "Kamu sudah membuat pengajuan untuk mentor ini pada tanggal tersebut."
      );
      return;
    }

    const newRequest = {
      id: crypto.randomUUID(),
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      field: selectedMentor.field,
      date,
      goal: goal.trim(),
      status: "Menunggu (Demo)",
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    setSuccess("Pengajuan mentorship simulasi berhasil dibuat.");
    closeDialog();
  };

  const handleCancel = (id) => {
    if (!window.confirm("Batalkan pengajuan mentorship ini?")) {
      return;
    }

    setRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );

    setSuccess("Pengajuan mentorship dibatalkan.");
  };

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mentorship HERa 🌷
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Temukan mentor yang sesuai dengan tujuan pengembangan dirimu.
      </Typography>

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        Mentor dan pengajuan pada halaman ini merupakan
        simulasi frontend. Tidak ada permintaan yang
        dikirimkan kepada mentor sungguhan.
      </Alert>

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          placeholder="Cari mentor atau keahlian..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Bidang Keahlian"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: { sm: 240 } }}
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 3,
          mb: 5,
        }}
      >
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardContent sx={{ p: 3, height: "100%" }}>
              <Stack spacing={2} height="100%">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "primary.light",
                      color: "primary.dark",
                    }}
                  >
                    {mentor.initials}
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {mentor.name}
                    </Typography>

                    <Typography color="text.secondary">
                      {mentor.field}
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label={mentor.experience}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {mentor.description}
                </Typography>

                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {mentor.expertise.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                    />
                  ))}
                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => openDetail(mentor)}
                  >
                    Detail
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => openRequest(mentor)}
                  >
                    Ajukan
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {filteredMentors.length === 0 && (
        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Mentor tidak ditemukan.
        </Typography>
      )}

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Riwayat Pengajuan
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {requests.length === 0 ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
              <School
                sx={{ fontSize: 55, color: "primary.light" }}
              />

              <Typography color="text.secondary">
                Belum ada pengajuan mentorship.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {[...requests]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((request) => (
                  <Box key={request.id}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={2}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {request.mentorName}
                        </Typography>

                        <Typography color="text.secondary">
                          {request.field}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 1 }}
                        >
                          <Chip
                            icon={<CalendarMonth />}
                            label={formatDate(request.date)}
                            size="small"
                          />

                          <Chip
                            label={request.status}
                            size="small"
                            color="warning"
                          />
                        </Stack>

                        <Typography sx={{ mt: 2 }}>
                          <strong>Tujuan:</strong> {request.goal}
                        </Typography>
                      </Box>

                      <Button
                        color="error"
                        variant="outlined"
                        startIcon={<Delete />}
                        onClick={() => handleCancel(request.id)}
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
        open={Boolean(selectedMentor)}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {dialogMode === "detail"
            ? "Detail Mentor"
            : "Ajukan Mentorship"}
        </DialogTitle>

        <DialogContent dividers>
          {selectedMentor && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Person />
                </Avatar>

                <Box>
                  <Typography variant="h6">
                    {selectedMentor.name}
                  </Typography>
                  <Typography color="text.secondary">
                    {selectedMentor.field}
                  </Typography>
                </Box>
              </Stack>

              {dialogMode === "detail" ? (
                <>
                  <Typography>
                    {selectedMentor.description}
                  </Typography>

                  <Typography fontWeight="bold">
                    Pengalaman
                  </Typography>
                  <Typography>
                    {selectedMentor.experience}
                  </Typography>

                  <Typography fontWeight="bold">
                    Keahlian
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {selectedMentor.expertise.map((skill) => (
                      <Chip key={skill} label={skill} />
                    ))}
                  </Stack>
                </>
              ) : (
                <>
                  <TextField
                    label="Tanggal yang Diinginkan"
                    type="date"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { min: today },
                    }}
                  />

                  <TextField
                    label="Tujuan Mentorship"
                    placeholder="Contoh: Ingin meningkatkan kemampuan public speaking"
                    multiline
                    minRows={4}
                    fullWidth
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    slotProps={{
                      htmlInput: { maxLength: 500 },
                    }}
                    helperText={`${goal.length}/500 karakter`}
                  />

                  {message && (
                    <Alert severity="warning">
                      {message}
                    </Alert>
                  )}
                </>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialog}>
            Tutup
          </Button>

          {dialogMode === "detail" ? (
            <Button
              variant="contained"
              onClick={() => openRequest(selectedMentor)}
            >
              Ajukan Mentorship
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleRequest}
            >
              Kirim Pengajuan
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
