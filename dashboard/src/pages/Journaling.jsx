
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
  MenuItem,
  Divider,
  InputAdornment,
} from "@mui/material";

import {
  MenuBook,
  Add,
  Edit,
  Delete,
  Search,
  Save,
  Close,
} from "@mui/icons-material";

const STORAGE_KEY = "hera_demo_journals";

const moodOptions = [
  { value: "Sangat Senang", emoji: "😄" },
  { value: "Senang", emoji: "😊" },
  { value: "Biasa", emoji: "😐" },
  { value: "Sedih", emoji: "😢" },
  { value: "Stres", emoji: "😣" },
];

export default function Journaling() {
  const [journals, setJournals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
  }, [journals]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("");
    setEditingId(null);
    setMessage("");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setMessage("Judul dan isi jurnal wajib diisi.");
      return;
    }

    const now = new Date().toISOString();

    if (editingId !== null) {
      setJournals((prev) =>
        prev.map((journal) =>
          journal.id === editingId
            ? {
                ...journal,
                title: title.trim(),
                content: content.trim(),
                mood,
                updatedAt: now,
              }
            : journal
        )
      );
    } else {
      const newJournal = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        mood,
        createdAt: now,
        updatedAt: now,
      };

      setJournals((prev) => [newJournal, ...prev]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (journal) => {
    setTitle(journal.title);
    setContent(journal.content);
    setMood(journal.mood);
    setEditingId(journal.id);
    setShowForm(true);
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin ingin menghapus jurnal ini?")) {
      return;
    }

    setJournals((prev) =>
      prev.filter((journal) => journal.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredJournals = journals.filter((journal) => {
    const keyword = search.toLowerCase();

    return (
      journal.title.toLowerCase().includes(keyword) ||
      journal.content.toLowerCase().includes(keyword)
    );
  });

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Jurnal Harian 📖
          </Typography>

          <Typography color="text.secondary">
            Ruang pribadimu untuk menulis dan merefleksikan hari.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Tulis Jurnal
        </Button>
      </Stack>

      {showForm && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" fontWeight="bold">
                {editingId !== null
                  ? "Edit Jurnal"
                  : "Tulis Ceritamu"}
              </Typography>

              <IconButton
                aria-label="Tutup formulir"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                <Close />
              </IconButton>
            </Stack>

            <Stack spacing={3}>
              <TextField
                label="Judul Jurnal"
                placeholder="Contoh: Hari yang menyenangkan"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputProps={{ maxLength: 100 }}
              />

              <TextField
                select
                label="Suasana Hati (Opsional)"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  Tidak memilih
                </MenuItem>

                {moodOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.emoji} {option.value}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Ceritamu Hari Ini"
                placeholder="Apa yang ingin kamu ceritakan hari ini?"
                multiline
                minRows={6}
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                inputProps={{ maxLength: 5000 }}
                helperText={`${content.length}/5000 karakter`}
              />

              {message && (
                <Alert severity="warning">
                  {message}
                </Alert>
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  {editingId !== null
                    ? "Simpan Perubahan"
                    : "Simpan Jurnal"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={resetForm}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <MenuBook color="primary" />

              <Typography variant="h6" fontWeight="bold">
                Riwayat Jurnal
              </Typography>

              <Chip
                size="small"
                label={`${journals.length} jurnal`}
              />
            </Stack>

            <TextField
              size="small"
              placeholder="Cari jurnal..."
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
          </Stack>

          {filteredJournals.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <MenuBook
                sx={{ fontSize: 55, color: "primary.light", mb: 2 }}
              />

              <Typography color="text.secondary">
                {search
                  ? "Tidak ada jurnal yang cocok."
                  : "Belum ada jurnal. Yuk, mulai menulis!"}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredJournals.map((journal) => {
                const selectedMood = moodOptions.find(
                  (item) => item.value === journal.mood
                );

                return (
                  <Box key={journal.id}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                        >
                          {journal.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(journal.createdAt)}
                        </Typography>

                        {selectedMood && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              size="small"
                              label={`${selectedMood.emoji} ${selectedMood.value}`}
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        )}

                        <Typography
                          sx={{
                            mt: 2,
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {journal.content}
                        </Typography>
                      </Box>

                      <Stack direction="row">
                        <IconButton
                          color="primary"
                          aria-label="Edit jurnal"
                          onClick={() => handleEdit(journal)}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          aria-label="Hapus jurnal"
                          onClick={() => handleDelete(journal.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Divider sx={{ mt: 3 }} />
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
