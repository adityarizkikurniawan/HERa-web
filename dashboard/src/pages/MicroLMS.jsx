
import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  TextField,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
} from "@mui/material";

import {
  School,
  Search,
  PlayArrow,
  MenuBook,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";

import { learningMaterials } from "../data/dummyData";

const STORAGE_KEY = "hera_demo_learning_progress";

const categories = [
  "Semua Kategori",
  "Public Speaking",
  "Manajemen Waktu",
  "Creativity Skill",
];

export default function MicroLMS() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua Kategori");
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(completed)
    );
  }, [completed]);

  const filteredMaterials = learningMaterials.filter((material) => {
    const matchSearch = material.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "Semua Kategori" ||
      material.category === category;

    return matchSearch && matchCategory;
  });

  const progress =
    learningMaterials.length > 0
      ? Math.round(
          (learningMaterials.filter((item) =>
            completed.includes(item.id)
          ).length /
            learningMaterials.length) *
            100
        )
      : 0;

  const handleComplete = (id) => {
    setCompleted((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto" }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Micro-LMS 📚
        </Typography>

        <Typography color="text.secondary">
          Belajar keterampilan baru melalui materi singkat
          yang mudah dipahami.
        </Typography>
      </Stack>

      <Card sx={{ mb: 4, bgcolor: "#F3E5F5" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <School color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Progres Belajarmu
            </Typography>
          </Stack>

          <Typography sx={{ mt: 2, mb: 1 }}>
            {
              learningMaterials.filter((item) =>
                completed.includes(item.id)
              ).length
            }{" "}
            dari {learningMaterials.length} materi selesai
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5 }}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {progress}% selesai
          </Typography>
        </CardContent>
      </Card>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          placeholder="Cari materi pembelajaran..."
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
          label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: { sm: 220 } }}
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
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {filteredMaterials.map((material) => {
          const isCompleted = completed.includes(material.id);

          return (
            <Card
              key={material.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#EDE7F6",
                  height: 125,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {material.type === "Video" ? (
                  <PlayArrow
                    sx={{ fontSize: 60, color: "primary.main" }}
                  />
                ) : (
                  <MenuBook
                    sx={{ fontSize: 60, color: "primary.main" }}
                  />
                )}
              </Box>

              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: 1.5,
                }}
              >
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={material.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />

                  {isCompleted && (
                    <Chip
                      label="Selesai"
                      size="small"
                      color="success"
                    />
                  )}
                </Stack>

                <Typography variant="h6" fontWeight="bold">
                  {material.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {material.description}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <AccessTime fontSize="small" color="disabled" />
                  <Typography variant="caption">
                    {material.duration} • {material.type}
                  </Typography>
                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                  fullWidth
                  variant={isCompleted ? "outlined" : "contained"}
                  onClick={() => setSelectedMaterial(material)}
                >
                  {isCompleted ? "Lihat Kembali" : "Mulai Belajar"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {filteredMaterials.length === 0 && (
        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ py: 5 }}
        >
          Materi tidak ditemukan.
        </Typography>
      )}

      <Dialog
        open={Boolean(selectedMaterial)}
        onClose={() => setSelectedMaterial(null)}
        fullWidth
        maxWidth="md"
      >
        {selectedMaterial && (
          <>
            <DialogTitle>
              {selectedMaterial.title}
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={3}>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={selectedMaterial.category}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={selectedMaterial.duration}
                    size="small"
                  />
                </Stack>

                {selectedMaterial.videoUrl ? (
                  <Box
                    component="video"
                    controls
                    src={selectedMaterial.videoUrl}
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      bgcolor: "black",
                    }}
                  />
                ) : (
                  selectedMaterial.type === "Video" && (
                    <Alert severity="info">
                      Video pembelajaran belum tersedia.
                      Silakan baca ringkasan materi di bawah.
                    </Alert>
                  )
                )}

                <Typography
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.9,
                  }}
                >
                  {selectedMaterial.content}
                </Typography>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setSelectedMaterial(null)}
              >
                Tutup
              </Button>

              <Button
                variant="contained"
                color={
                  completed.includes(selectedMaterial.id)
                    ? "inherit"
                    : "primary"
                }
                startIcon={<CheckCircle />}
                onClick={() =>
                  handleComplete(selectedMaterial.id)
                }
              >
                {completed.includes(selectedMaterial.id)
                  ? "Batalkan Selesai"
                  : "Tandai Selesai"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
