
import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Stack,
  Chip,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

import {
  Person,
  Edit,
  Save,
  RestartAlt,
  Favorite,
  MenuBook,
  School,
  Groups,
} from "@mui/icons-material";

const STORAGE_KEY = "hera_demo_profile";

const initialProfile = {
  name: "Pengguna HERa",
  nickname: "Sahabat HERa",
  bio: "",
  interests: [],
  goal: "",
};

const interestOptions = [
  "Public Speaking",
  "Manajemen Waktu",
  "Pengembangan Karier",
  "Entrepreneurship",
  "Teknologi & Digital",
  "Creativity Skill",
  "Leadership",
  "Kesehatan & Wellness",
];

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...initialProfile, ...JSON.parse(saved) }
        : { ...initialProfile };
    } catch {
      return { ...initialProfile };
    }
  });

  const [form, setForm] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({
    moods: 0,
    journals: 0,
    lessons: 0,
    posts: 0,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const moodHistory = readArray("hera_demo_mood_history");
    const journals = readArray("hera_demo_journals");
    const lessons = readArray("hera_demo_learning_progress");
    const posts = readArray("hera_demo_community");

    const userId = localStorage.getItem(
      "hera_demo_community_user"
    );

    setStats({
      moods: moodHistory.length,
      journals: journals.length,
      lessons: lessons.length,
      posts: posts.filter(
        (post) => post.ownerId === userId
      ).length,
    });
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setMessage("");
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setMessage("Nama pengguna wajib diisi.");
      return;
    }

    if (!form.nickname.trim()) {
      setMessage("Nama panggilan wajib diisi.");
      return;
    }

    const updatedProfile = {
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      bio: form.bio.trim(),
      interests: form.interests,
      goal: form.goal.trim(),
    };

    setProfile(updatedProfile);
    setForm(updatedProfile);
    setIsEditing(false);
    setMessage("Profil berhasil diperbarui!");
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setIsEditing(false);
    setMessage("");
  };

  const handleReset = () => {
    if (!window.confirm("Kembalikan profil demo ke data awal?")) {
      return;
    }

    setProfile({ ...initialProfile });
    setForm({ ...initialProfile });
    setIsEditing(false);
    setMessage("Profil demo dikembalikan ke data awal.");
  };

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const statCards = [
    {
      label: "Catatan Mood",
      value: stats.moods,
      icon: <Favorite color="primary" />,
    },
    {
      label: "Jurnal Harian",
      value: stats.journals,
      icon: <MenuBook color="primary" />,
    },
    {
      label: "Materi Selesai",
      value: stats.lessons,
      icon: <School color="primary" />,
    },
    {
      label: "Postingan Komunitas",
      value: stats.posts,
      icon: <Groups color="primary" />,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profil Pengguna 🌷
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Kelola informasi dan tujuan pengembangan dirimu.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Profil ini menggunakan data simulasi yang disimpan
        pada browser. Jangan memasukkan informasi pribadi
        yang sensitif selama pengujian.
      </Alert>

      {message && (
        <Alert
          severity={message.includes("wajib") ? "warning" : "success"}
          onClose={() => setMessage("")}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: "primary.main",
                fontSize: 30,
              }}
            >
              {initials || <Person />}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {profile.name}
              </Typography>

              <Typography color="text.secondary">
                @{profile.nickname.replace(/\s+/g, "").toLowerCase()}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                {profile.bio || "Belum ada bio pengguna."}
              </Typography>
            </Box>

            {!isEditing && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => {
                  setForm({ ...profile });
                  setIsEditing(true);
                  setMessage("");
                }}
              >
                Edit Profil
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Ringkasan Aktivitas
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <Stack spacing={1}>
                {stat.icon}
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {stat.label}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Informasi Profil
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Nama Pengguna"
              fullWidth
              value={form.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
              disabled={!isEditing}
              slotProps={{
                htmlInput: { maxLength: 100 },
              }}
            />

            <TextField
              label="Nama Panggilan"
              fullWidth
              value={form.nickname}
              onChange={(e) =>
                handleChange("nickname", e.target.value)
              }
              disabled={!isEditing}
              slotProps={{
                htmlInput: { maxLength: 50 },
              }}
            />

            <TextField
              label="Bio Singkat"
              multiline
              minRows={3}
              fullWidth
              value={form.bio}
              onChange={(e) =>
                handleChange("bio", e.target.value)
              }
              disabled={!isEditing}
              slotProps={{
                htmlInput: { maxLength: 300 },
              }}
              helperText={`${form.bio.length}/300 karakter`}
            />

            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel id="interests-label">
                Minat Pengembangan Diri
              </InputLabel>

              <Select
                labelId="interests-label"
                multiple
                value={form.interests}
                onChange={(e) =>
                  handleChange("interests", e.target.value)
                }
                input={
                  <OutlinedInput label="Minat Pengembangan Diri" />
                }
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {interestOptions.map((interest) => (
                  <MenuItem key={interest} value={interest}>
                    {interest}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tujuan Pengembangan Diri"
              placeholder="Contoh: Ingin lebih percaya diri berbicara di depan umum"
              multiline
              minRows={3}
              fullWidth
              value={form.goal}
              onChange={(e) =>
                handleChange("goal", e.target.value)
              }
              disabled={!isEditing}
              slotProps={{
                htmlInput: { maxLength: 500 },
              }}
            />

            <Divider />

            {isEditing ? (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Simpan Perubahan
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Batal
                </Button>
              </Stack>
            ) : (
              <Box>
                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  onClick={handleReset}
                >
                  Reset Profil Demo
                </Button>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
