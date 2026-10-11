
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Divider,
} from "@mui/material";

import {
  Favorite,
  MenuBook,
  School,
  CalendarMonth,
  Groups,
  Person,
} from "@mui/icons-material";

const learningTotal = 6;

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function readObject(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    return data && typeof data === "object" && !Array.isArray(data)
      ? data
      : {};
  } catch {
    return {};
  }
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    profile: {},
    moods: [],
    journals: [],
    lessons: [],
    counseling: [],
    mentorship: [],
  });

  useEffect(() => {
    const loadData = () => {
      setData({
        profile: readObject("hera_demo_profile"),
        moods: readArray("hera_demo_mood_history"),
        journals: readArray("hera_demo_journals"),
        lessons: readArray("hera_demo_learning_progress"),
        counseling: readArray("hera_demo_counseling"),
        mentorship: readArray("hera_demo_mentorship"),
      });
    };

    loadData();

    window.addEventListener("focus", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const name =
    data.profile.nickname ||
    data.profile.name ||
    "Sahabat HERa";

  const latestMood = [...data.moods].sort((a, b) => {
    const aDate = String(
      a.createdAt || a.date || a.timestamp || ""
    );
    const bDate = String(
      b.createdAt || b.date || b.timestamp || ""
    );

    return bDate.localeCompare(aDate);
  })[0];

  const moodText = latestMood
    ? String(
        latestMood.mood ||
        latestMood.label ||
        latestMood.emoji ||
        "Sudah dicatat"
      )
    : "Belum ada mood";

  const completedLessons = data.lessons.filter(
    (id) => [1, 2, 3, 4, 5, 6].includes(Number(id))
  ).length;

  const progress = Math.min(
    Math.round((completedLessons / learningTotal) * 100),
    100
  );

  const today = new Date();

  const upcomingCounseling = data.counseling
    .filter((item) => {
      const date = new Date(`${item.date}T${item.time || "00:00"}:00`);
      return !Number.isNaN(date.getTime()) && date >= today;
    })
    .sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    )[0];

  const upcomingMentorship = data.mentorship
    .filter((item) => {
      const date = new Date(`${item.date}T23:59:59`);
      return !Number.isNaN(date.getTime()) && date >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const summaryCards = [
    {
      title: "Mood Tercatat",
      value: data.moods.length,
      subtitle: moodText,
      icon: <Favorite color="primary" />,
      path: "/mood",
    },
    {
      title: "Jurnal Harian",
      value: data.journals.length,
      subtitle: "Total jurnal tersimpan",
      icon: <MenuBook color="primary" />,
      path: "/journal",
    },
    {
      title: "Materi Selesai",
      value: `${completedLessons}/${learningTotal}`,
      subtitle: `${progress}% pembelajaran`,
      icon: <School color="primary" />,
      path: "/learning",
    },
    {
      title: "Jadwal Konseling",
      value: data.counseling.length,
      subtitle: "Total pemesanan demo",
      icon: <CalendarMonth color="primary" />,
      path: "/counseling",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Card
        sx={{
          mb: 3,
          background:
            "linear-gradient(120deg, #9575CD 0%, #CE93D8 100%)",
          color: "white",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                HERa • Her Empowerment & Resilience Assistant
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mt: 1, mb: 1 }}
              >
                Halo, {name}! 🌷
              </Typography>

              <Typography sx={{ opacity: 0.95 }}>
                Selamat datang kembali. Yuk, lanjutkan perjalanan
                wellness dan pengembangan dirimu hari ini.
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: "white",
                color: "primary.main",
              }}
            >
              <Person sx={{ fontSize: 38 }} />
            </Avatar>
          </Stack>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "white",
              color: "primary.main",
              "&:hover": { bgcolor: "#F3E5F5" },
            }}
            onClick={() => navigate("/profile")}
          >
            Lihat Profil
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Ringkasan Aktivitas
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                {card.icon}

                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>

                <Typography fontWeight="bold" variant="body2">
                  {card.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ minHeight: 30 }}
                >
                  {card.subtitle}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(card.path)}
                >
                  Lihat Detail
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Favorite color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Mood Terakhir
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" sx={{ mb: 2 }}>
              {moodText}
            </Typography>

            <Typography color="text.secondary" variant="body2">
              {latestMood
                ? "Terima kasih sudah meluangkan waktu untuk mencatat perasaanmu."
                : "Belum ada catatan mood. Yuk, mulai dari hari ini!"}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate("/mood")}
            >
              Catat Mood
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <School color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Progres Pembelajaran
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" fontWeight="bold">
              {completedLessons} dari {learningTotal} materi
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                mt: 2,
                mb: 1,
              }}
            />

            <Typography color="text.secondary" variant="body2">
              {progress}% materi selesai
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate("/learning")}
            >
              Lanjut Belajar
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Jadwal & Pengajuan
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonth color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Konseling Berikutnya
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {upcomingCounseling ? (
              <Stack spacing={1.5}>
                <Typography fontWeight="bold">
                  {upcomingCounseling.counselorName}
                </Typography>

                <Chip
                  label={formatDate(upcomingCounseling.date)}
                  color="primary"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                />

                <Typography color="text.secondary">
                  Jam {upcomingCounseling.time}
                </Typography>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                Belum ada jadwal konseling mendatang.
              </Typography>
            )}

            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              onClick={() => navigate("/counseling")}
            >
              Lihat Konseling
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Groups color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Pengajuan Mentorship
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {upcomingMentorship ? (
              <Stack spacing={1.5}>
                <Typography fontWeight="bold">
                  {upcomingMentorship.mentorName}
                </Typography>

                <Chip
                  label={upcomingMentorship.status}
                  size="small"
                  color="warning"
                  sx={{ alignSelf: "flex-start" }}
                />

                <Typography color="text.secondary">
                  Tanggal: {formatDate(upcomingMentorship.date)}
                </Typography>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                Belum ada pengajuan mentorship mendatang.
              </Typography>
            )}

            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              onClick={() => navigate("/mentorship")}
            >
              Lihat Mentorship
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Alert severity="info">
        Dashboard ini menggunakan data simulasi dari browser.
        Data belum tersinkronisasi dengan akun atau server.
      </Alert>
    </Box>
  );
}
