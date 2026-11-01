
import { useMemo, useState } from "react";
import {
  Box, Typography, Paper, Grid, Stack, Button,
  TextField, MenuItem, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Alert, LinearProgress, Divider
} from "@mui/material";

const activityData = [
  { month: "Jun", users: 22, consultations: 8, posts: 15 },
  { month: "Jul", users: 34, consultations: 13, posts: 24 },
  { month: "Agu", users: 43, consultations: 17, posts: 29 },
  { month: "Sep", users: 57, consultations: 23, posts: 38 },
  { month: "Okt", users: 72, consultations: 31, posts: 46 },
];

const moduleData = [
  { name: "Mood Tracker", total: 95 },
  { name: "Journaling", total: 78 },
  { name: "Micro-LMS", total: 65 },
  { name: "Community", total: 82 },
  { name: "Period Tracker", total: 48 },
  { name: "Counseling", total: 46 },
  { name: "Mentorship", total: 37 },
];

const paperStyle = {
  borderRadius: 3,
  border: "1px solid #EEEAF5",
  boxShadow: "0 4px 20px rgba(60,35,100,0.05)"
};

const initialStats = {
  users: 128,
  mentors: 8,
  consultations: 46,
  materials: 12,
};

function StatCard({ title, value, subtitle, color }) {
  return (
    <Paper sx={{ ...paperStyle, p: 3, height: "100%" }}>
      <Box
        sx={{
          width: 42,
          height: 5,
          borderRadius: 2,
          bgcolor: color,
          mb: 2
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, color: "#25213B", my: 1 }}
      >
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Paper>
  );
}

export default function AdminReports() {
  const [period, setPeriod] = useState("Semua");

  const filteredData = useMemo(() => {
    if (period === "Semua") return activityData;
    return activityData.filter((item) => item.month === period);
  }, [period]);

  const maxValue = Math.max(
    1,
    ...filteredData.flatMap((item) => [
      item.users,
      item.consultations,
      item.posts
    ])
  );

  const exportCSV = () => {
    const rows = [
      ["Bulan", "Pengguna", "Konsultasi", "Postingan"],
      ...filteredData.map((item) => [
        item.month,
        item.users,
        item.consultations,
        item.posts
      ])
    ];

    const csv = rows.map((row) => row.join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Laporan_Aktivitas_HERa_Demo.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      title: "Pengguna Terdaftar",
      value: initialStats.users,
      subtitle: "Total akun pengguna demo",
      color: "#7E57C2"
    },
    {
      title: "Mentor Aktif",
      value: initialStats.mentors,
      subtitle: "Mentor aktif dalam data demo",
      color: "#2196F3"
    },
    {
      title: "Total Konsultasi",
      value: initialStats.consultations,
      subtitle: "Simulasi jumlah konsultasi",
      color: "#2E7D32"
    },
    {
      title: "Materi Pembelajaran",
      value: initialStats.materials,
      subtitle: "Simulasi materi Micro-LMS",
      color: "#ED6C02"
    }
  ];

  const chartSeries = [
    { key: "users", label: "Pengguna", color: "#7E57C2" },
    {
      key: "consultations",
      label: "Konsultasi",
      color: "#42A5F5"
    },
    { key: "posts", label: "Postingan", color: "#66BB6A" }
  ];

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", pb: 5 }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "#9575CD", fontWeight: 600, mb: 1 }}
          >
            Admin / Analisis Aktivitas
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#25213B",
              fontSize: { xs: 26, md: 32 },
              mb: 1
            }}
          >
            Laporan Aktivitas HERa
          </Typography>

          <Typography color="text.secondary">
            Pantau ringkasan aktivitas dan penggunaan modul HERa.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={exportCSV}
          sx={{
            bgcolor: "#7E57C2",
            "&:hover": { bgcolor: "#673AB7" },
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1.4,
            fontWeight: 700
          }}
        >
          Export CSV
        </Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Mode demo: statistik dan grafik menggunakan data contoh.
        Angka belum terhubung ke database HERa.
      </Alert>

      {/* STATISTIK */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid
            key={stat.title}
            size={{ xs: 12, sm: 6, lg: 3 }}
          >
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* GRAFIK */}
      <Paper sx={{ ...paperStyle, p: { xs: 2, md: 3 }, mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Grafik Aktivitas Bulanan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Perbandingan aktivitas pada data contoh.
            </Typography>
          </Box>

          <TextField
            select
            size="small"
            label="Periode"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="Semua">Semua Bulan</MenuItem>
            {activityData.map((item) => (
              <MenuItem key={item.month} value={item.month}>
                {item.month}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack
          direction="row"
          spacing={3}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 3 }}
        >
          {chartSeries.map((series) => (
            <Stack
              key={series.key}
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: series.color,
                  borderRadius: 1
                }}
              />
              <Typography variant="caption">
                {series.label}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Box sx={{ overflowX: "auto" }}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "flex-end",
              minWidth: 480,
              height: 270,
              px: 2,
              pt: 2,
              borderBottom: "1px solid #DDD"
            }}
          >
            {filteredData.map((item) => (
              <Box
                key={item.month}
                sx={{
                  flex: 1,
                  minWidth: 65,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end"
                }}
              >
                <Stack
                  direction="row"
                  alignItems="flex-end"
                  justifyContent="center"
                  spacing={0.5}
                  sx={{ height: 225 }}
                >
                  {chartSeries.map((series) => (
                    <Box
                      key={series.key}
                      title={`${series.label}: ${item[series.key]}`}
                      sx={{
                        width: 18,
                        height: `${Math.max(
                          2,
                          (item[series.key] / maxValue) * 100
                        )}%`,
                        bgcolor: series.color,
                        borderRadius: "5px 5px 0 0",
                        transition: "height 0.3s"
                      }}
                    />
                  ))}
                </Stack>

                <Typography
                  variant="caption"
                  textAlign="center"
                  sx={{ py: 1 }}
                >
                  {item.month}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* PENGGUNAAN MODUL */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ ...paperStyle, p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700}>
              Aktivitas per Modul
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Jumlah aktivitas demo pada setiap fitur.
            </Typography>

            <Stack spacing={2.5}>
              {moduleData.map((module) => (
                <Box key={module.name}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {module.name}
                    </Typography>
                    <Typography variant="body2">
                      {module.total}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={module.total}
                    sx={{
                      height: 9,
                      borderRadius: 5,
                      bgcolor: "#EEE7F8",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#9575CD",
                        borderRadius: 5
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* TABEL RINGKASAN */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ ...paperStyle, p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700}>
              Ringkasan Bulanan
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Rekap aktivitas berdasarkan periode.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F6F1FD" }}>
                    {[
                      "Bulan",
                      "Pengguna",
                      "Konsultasi",
                      "Postingan"
                    ].map((label) => (
                      <TableCell
                        key={label}
                        sx={{
                          fontWeight: 700,
                          color: "#49366B"
                        }}
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.month} hover>
                      <TableCell>{item.month}</TableCell>
                      <TableCell>{item.users}</TableCell>
                      <TableCell>{item.consultations}</TableCell>
                      <TableCell>{item.posts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
              <Chip
                size="small"
                label="Data Simulasi"
                color="secondary"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
