
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Divider,
} from "@mui/material";

import People from "@mui/icons-material/People";
import Psychology from "@mui/icons-material/Psychology";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Article from "@mui/icons-material/Article";
import ArrowForward from "@mui/icons-material/ArrowForward";
import TrendingUp from "@mui/icons-material/TrendingUp";
import MenuBook from "@mui/icons-material/MenuBook";
import Forum from "@mui/icons-material/Forum";
import Settings from "@mui/icons-material/Settings";
import Assessment from "@mui/icons-material/Assessment";
import Shield from "@mui/icons-material/Shield";
import Favorite from "@mui/icons-material/Favorite";

import { getAccounts } from "../../data/auth";

// Data contoh untuk visualisasi dashboard.
// Belum terhubung ke backend atau laporan aktual.
const demoActivity = [
  { month: "Jun", users: 22, consultations: 8 },
  { month: "Jul", users: 34, consultations: 13 },
  { month: "Agu", users: 43, consultations: 17 },
  { month: "Sep", users: 57, consultations: 23 },
  { month: "Okt", users: 72, consultations: 31 },
];

const demoModules = [
  { name: "Mood Tracker", value: 85, color: "#9575CD" },
  { name: "Journaling", value: 68, color: "#F48FB1" },
  { name: "Micro-LMS", value: 75, color: "#64B5F6" },
  { name: "Komunitas", value: 60, color: "#81C784" },
];

const cardStyle = {
  borderRadius: 4,
  border: "1px solid #EEEAF5",
  boxShadow: "0 8px 28px rgba(74, 45, 120, 0.05)",
  bgcolor: "#FFFFFF",
};

function StatisticCard({
  title,
  value,
  icon,
  color,
  background,
  subtitle,
}) {
  return (
    <Paper
      sx={{
        ...cardStyle,
        p: 2.5,
        height: "100%",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(74,45,120,0.12)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, mb: 1.5 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#2D2440",
              fontSize: { xs: 30, md: 34 },
            }}
          >
            {value}
          </Typography>
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            bgcolor: background,
            color: color,
            width: 52,
            height: 52,
            borderRadius: 3,
          }}
        >
          {icon}
        </Avatar>
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        {subtitle}
      </Typography>
    </Paper>
  );
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: "#302544" }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action}
    </Stack>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const accounts = getAccounts();

  const totalUsers = accounts.filter(
    (account) => account.role === "user"
  ).length;

  // Mendukung data role "mentor" dan nama lama "psikolog".
  const totalMentors = accounts.filter(
    (account) =>
      account.role === "mentor" ||
      account.role === "psikolog"
  ).length;

  const stats = [
    {
      title: "Total Pengguna",
      value: totalUsers,
      icon: <People />,
      color: "#8E63CB",
      background: "#F1E8FC",
      subtitle: "Berdasarkan data akun saat ini",
    },
    {
      title: "Total Mentor",
      value: totalMentors,
      icon: <Psychology />,
      color: "#EC78A3",
      background: "#FDE8F0",
      subtitle: "Berdasarkan data akun saat ini",
    },
    {
      title: "Total Konsultasi",
      value: "—",
      icon: <EventAvailable />,
      color: "#4DA6E8",
      background: "#E5F3FE",
      subtitle: "Belum terhubung ke data konsultasi",
    },
    {
      title: "Materi Micro-LMS",
      value: "—",
      icon: <MenuBook />,
      color: "#52AD82",
      background: "#E7F7EE",
      subtitle: "Belum terhubung ke data materi",
    },
  ];

  const quickActions = [
    {
      title: "Manajemen User",
      subtitle: "Kelola akun pengguna",
      icon: <People />,
      color: "#9575CD",
      path: "/admin/users",
    },
    {
      title: "Manajemen Mentor",
      subtitle: "Kelola akun mentor",
      icon: <Psychology />,
      color: "#F48FB1",
      path: "/admin/mentors",
    },
    {
      title: "Micro-LMS",
      subtitle: "Kelola materi belajar",
      icon: <MenuBook />,
      color: "#64B5F6",
      path: "/admin/micro-lms",
    },
    {
      title: "Moderasi Komunitas",
      subtitle: "Tinjau postingan dan laporan",
      icon: <Shield />,
      color: "#81C784",
      path: "/admin/moderasi",
    },
  ];

  const adminActivities = [
    {
      title: "Manajemen akun",
      description: "Kelola pengguna dan mentor melalui panel admin.",
      icon: <People />,
      color: "#9575CD",
    },
    {
      title: "Monitoring konsultasi",
      description: "Pantau permintaan dan status konsultasi.",
      icon: <EventAvailable />,
      color: "#64B5F6",
    },
    {
      title: "Moderasi komunitas",
      description: "Tinjau laporan konten dari pengguna.",
      icon: <Forum />,
      color: "#81C784",
    },
  ];

  const maxChartValue = Math.max(
    ...demoActivity.flatMap((item) => [
      item.users,
      item.consultations,
    ])
  );

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", pb: 5 }}>
      {/* WELCOME BANNER */}
      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          mb: 4,
          p: { xs: 3, md: 4 },
          color: "white",
          background:
            "linear-gradient(120deg, #7752B3 0%, #9A76D2 55%, #D99BCB 100%)",
          boxShadow: "0 12px 35px rgba(126,87,194,0.18)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -60,
            top: -90,
            width: 270,
            height: 270,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.10)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            right: 90,
            bottom: -100,
            width: 190,
            height: 190,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.08)",
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box>
            <Chip
              label="HERa Administration"
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.20)",
                color: "white",
                fontWeight: 700,
                mb: 2,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 25, md: 34 },
                mb: 1,
              }}
            >
              Selamat Datang, Admin! 🌷
            </Typography>

            <Typography
              sx={{
                opacity: 0.95,
                maxWidth: 570,
                lineHeight: 1.8,
                fontSize: { xs: 13, md: 15 },
              }}
            >
              Kelola pengguna, mentor, pembelajaran, dan
              komunitas HERa melalui satu dashboard.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/admin/laporan")}
              sx={{
                mt: 3,
                bgcolor: "white",
                color: "#7752B3",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                "&:hover": {
                  bgcolor: "#F6F0FF",
                },
              }}
            >
              Lihat Laporan
            </Button>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              width: 135,
              height: 135,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.16)",
              flexShrink: 0,
            }}
          >
            <Favorite sx={{ fontSize: 70, color: "white" }} />
          </Box>
        </Stack>
      </Paper>

      {/* STATISTICS */}
      <SectionHeading
        title="Ringkasan Platform"
        subtitle="Informasi utama pengelolaan HERa."
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid
            key={stat.title}
            size={{ xs: 12, sm: 6, lg: 3 }}
          >
            <StatisticCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* CHART & MODULE ACTIVITY */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* ACTIVITY CHART */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ ...cardStyle, p: 3, height: "100%" }}>
            <SectionHeading
              title="Aktivitas Platform"
              subtitle="Visualisasi contoh aktivitas bulanan."
              action={
                <Chip
                  label="Data Demo"
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              }
            />

            <Stack
              direction="row"
              spacing={3}
              sx={{ mb: 3 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: "#9575CD",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="caption">
                  Pengguna
                </Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: "#F48FB1",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="caption">
                  Konsultasi
                </Typography>
              </Stack>
            </Stack>

            <Box sx={{ overflowX: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 3,
                  height: 270,
                  minWidth: 430,
                  borderBottom: "1px solid #EAE5F0",
                  px: 2,
                }}
              >
                {demoActivity.map((item) => (
                  <Box
                    key={item.month}
                    sx={{
                      flex: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="flex-end"
                      justifyContent="center"
                      sx={{ height: 230 }}
                    >
                      <Box
                        title={`Pengguna: ${item.users}`}
                        sx={{
                          width: 24,
                          height: `${
                            (item.users / maxChartValue) * 100
                          }%`,
                          bgcolor: "#9575CD",
                          borderRadius: "7px 7px 0 0",
                        }}
                      />

                      <Box
                        title={`Konsultasi: ${item.consultations}`}
                        sx={{
                          width: 24,
                          height: `${
                            (item.consultations / maxChartValue) * 100
                          }%`,
                          bgcolor: "#F48FB1",
                          borderRadius: "7px 7px 0 0",
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="caption"
                      textAlign="center"
                      sx={{ py: 1.5 }}
                    >
                      {item.month}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              Grafik ini menggunakan data simulasi dan belum
              menunjukkan aktivitas aktual pengguna HERa.
            </Typography>
          </Paper>
        </Grid>

        {/* MODULE ACTIVITY */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ ...cardStyle, p: 3, height: "100%" }}>
            <SectionHeading
              title="Aktivitas Modul"
              subtitle="Contoh tingkat penggunaan fitur."
              action={
                <Chip
                  label="Demo"
                  size="small"
                  variant="outlined"
                />
              }
            />

            <Stack spacing={3}>
              {demoModules.map((module) => (
                <Box key={module.name}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {module.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {module.value}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={module.value}
                    sx={{
                      height: 9,
                      borderRadius: 5,
                      bgcolor: "#F0EBF6",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: module.color,
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Button
              fullWidth
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/admin/laporan")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                color: "#7E57C2",
                borderColor: "#D7C5F2",
              }}
            >
              Lihat Detail Aktivitas
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}
      <SectionHeading
        title="Akses Cepat"
        subtitle="Kelola fitur utama administrasi HERa."
      />

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid
            key={action.title}
            size={{ xs: 12, sm: 6, lg: 3 }}
          >
            <Paper
              onClick={() => navigate(action.path)}
              sx={{
                ...cardStyle,
                p: 2.5,
                cursor: "pointer",
                height: "100%",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 12px 28px rgba(74,45,120,0.12)",
                  borderColor: "#C9B5E8",
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: `${action.color}20`,
                    color: action.color,
                    borderRadius: 2,
                    width: 46,
                    height: 46,
                  }}
                >
                  {action.icon}
                </Avatar>

                <ArrowForward
                  sx={{ color: "#B7A8C9", fontSize: 20 }}
                />
              </Stack>

              <Typography
                fontWeight={700}
                sx={{ color: "#302544", mb: 0.5 }}
              >
                {action.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {action.subtitle}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ADMIN INFORMATION */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ ...cardStyle, p: 3, height: "100%" }}>
            <SectionHeading
              title="Pusat Administrasi"
              subtitle="Area kerja utama administrator."
            />

            <Stack spacing={2.5}>
              {adminActivities.map((activity, index) => (
                <Box key={activity.title}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: `${activity.color}20`,
                        color: activity.color,
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                      }}
                    >
                      {activity.icon}
                    </Avatar>

                    <Box>
                      <Typography
                        fontWeight={700}
                        variant="body2"
                      >
                        {activity.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {activity.description}
                      </Typography>
                    </Box>
                  </Stack>

                  {index < adminActivities.length - 1 && (
                    <Divider sx={{ mt: 2.5 }} />
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* SYSTEM STATUS */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ ...cardStyle, p: 3, height: "100%" }}>
            <SectionHeading
              title="Status Sistem"
              subtitle="Informasi lingkungan pengembangan."
            />

            <Stack spacing={2.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  Frontend
                </Typography>

                <Chip
                  label="React.js"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  Backend
                </Typography>

                <Chip
                  label="Belum Terhubung"
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  Role
                </Typography>

                <Typography variant="body2" fontWeight={600}>
                  Admin, User, Mentor
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  Mode
                </Typography>

                <Chip
                  label="Development"
                  color="secondary"
                  size="small"
                />
              </Stack>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              startIcon={<Settings />}
              onClick={() => navigate("/admin/pengaturan")}
              sx={{
                mt: 3,
                bgcolor: "#7E57C2",
                textTransform: "none",
                borderRadius: 2,
                py: 1.2,
                "&:hover": { bgcolor: "#673AB7" },
              }}
            >
              Pengaturan Admin
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
