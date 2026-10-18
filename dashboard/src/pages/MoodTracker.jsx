
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Chip,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";

import { Favorite, History, Delete } from "@mui/icons-material";

const moodOptions = [
  { label: "Sangat Senang", emoji: "😄", color: "#E8F5E9" },
  { label: "Senang", emoji: "😊", color: "#FFF8E1" },
  { label: "Biasa", emoji: "😐", color: "#E3F2FD" },
  { label: "Sedih", emoji: "😢", color: "#F3E5F5" },
  { label: "Stres", emoji: "😣", color: "#FFEBEE" },
];

const STORAGE_KEY = "hera_demo_mood_history";

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleSave = () => {
    if (!selectedMood) {
      setMessage("Pilih suasana hati terlebih dahulu.");
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      mood: selectedMood,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    setHistory((prev) => [newEntry, ...prev]);
    setSelectedMood("");
    setNote("");
    setMessage("Mood berhasil disimpan!");
  };

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setMessage("Catatan mood berhasil dihapus.");
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mood Tracker 💜
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Kenali dan catat suasana hatimu setiap hari.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Favorite color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Bagaimana perasaanmu sekarang?
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(5, 1fr)",
              },
              gap: 2,
              mb: 3,
            }}
          >
            {moodOptions.map((mood) => (
              <Box
                key={mood.label}
                onClick={() => {
                  setSelectedMood(mood.label);
                  setMessage("");
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedMood(mood.label);
                    setMessage("");
                  }
                }}
                aria-pressed={selectedMood === mood.label}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  cursor: "pointer",
                  bgcolor: mood.color,
                  border: selectedMood === mood.label
                    ? "2px solid #9575CD"
                    : "2px solid transparent",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Typography sx={{ fontSize: 36 }}>
                  {mood.emoji}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {mood.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Ceritakan perasaanmu (opsional)
          </Typography>

          <TextField
            multiline
            minRows={4}
            fullWidth
            placeholder="Apa yang membuatmu merasa seperti ini?"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={`${note.length}/500 karakter`}
            sx={{ mb: 2 }}
          />

          {message && (
            <Alert
              severity={message.includes("berhasil") ? "success" : "warning"}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSave}
            disabled={!selectedMood}
          >
            Simpan Mood
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <History color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Riwayat Mood
            </Typography>
            <Chip label={`${history.length} catatan`} size="small" />
          </Stack>

          {history.length === 0 ? (
            <Typography color="text.secondary">
              Belum ada catatan mood. Yuk, mulai catat perasaanmu!
            </Typography>
          ) : (
            <Stack spacing={2}>
              {history.map((entry) => {
                const mood = moodOptions.find(
                  (item) => item.label === entry.mood
                );

                return (
                  <Box key={entry.id}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography fontWeight="bold">
                          {mood?.emoji || "💜"} {entry.mood}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(entry.date)}
                        </Typography>

                        {entry.note && (
                          <Typography
                            sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                          >
                            {entry.note}
                          </Typography>
                        )}
                      </Box>

                      <IconButton
                        color="error"
                        aria-label="Hapus catatan mood"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <span>🗑️</span>
                      </IconButton>
                    </Stack>

                    <Divider sx={{ mt: 2 }} />
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
