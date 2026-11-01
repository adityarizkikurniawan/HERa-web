
import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Paper, Stack, Grid, Button,
  Chip, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Alert, Snackbar, Divider
} from "@mui/material";

const STORAGE_KEY = "hera_admin_community";

const initialPosts = [
  {
    id: 1,
    author: "Anonim",
    content: "Aku ingin belajar lebih percaya diri ketika berbicara di depan umum. Ada tips?",
    category: "Pengembangan Diri",
    date: "2026-10-29",
    status: "Aktif",
    report: "Tidak Ada",
    reportReason: ""
  },
  {
    id: 2,
    author: "Anonim",
    content: "Belakangan ini aku kesulitan membagi waktu antara kuliah dan pekerjaan.",
    category: "Manajemen Waktu",
    date: "2026-10-30",
    status: "Aktif",
    report: "Menunggu",
    reportReason: "Dilaporkan sebagai konten tidak relevan."
  },
  {
    id: 3,
    author: "Anonim",
    content: "Postingan contoh yang dilaporkan karena mengandung komentar merendahkan pengguna lain.",
    category: "Diskusi Umum",
    date: "2026-10-31",
    status: "Aktif",
    report: "Menunggu",
    reportReason: "Dugaan ujaran kebencian atau perundungan."
  },
  {
    id: 4,
    author: "Anonim",
    content: "Semangat untuk teman-teman yang sedang berjuang mengembangkan diri!",
    category: "Motivasi",
    date: "2026-10-28",
    status: "Aktif",
    report: "Tidak Ada",
    reportReason: ""
  }
];

const paperStyle = {
  borderRadius: 3,
  border: "1px solid #EEEAF5",
  boxShadow: "0 4px 20px rgba(60,35,100,0.04)"
};

export default function AdminCommunity() {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Gagal membaca data komunitas:", error);
    }
    return initialPosts;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const keyword = search.toLowerCase();
      const matchSearch =
        post.content.toLowerCase().includes(keyword) ||
        post.category.toLowerCase().includes(keyword);

      const matchFilter =
        filter === "Semua" ||
        (filter === "Dilaporkan" && post.report === "Menunggu") ||
        (filter === "Aktif" && post.status === "Aktif") ||
        (filter === "Disembunyikan" && post.status === "Disembunyikan");

      return matchSearch && matchFilter;
    });
  }, [posts, search, filter]);

  const reported = posts.filter(
    (p) => p.report === "Menunggu"
  ).length;

  const hidden = posts.filter(
    (p) => p.status === "Disembunyikan"
  ).length;

  const updatePost = () => {
    if (!selected || !action) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== selected.id) return post;

        if (action === "hide") {
          return {
            ...post,
            status: "Disembunyikan",
            report: "Ditangani"
          };
        }

        if (action === "restore") {
          return {
            ...post,
            status: "Aktif",
            report: "Ditangani"
          };
        }

        return {
          ...post,
          report: "Ditangani"
        };
      })
    );

    setMessage(
      action === "hide"
        ? "Postingan berhasil disembunyikan."
        : action === "restore"
        ? "Postingan berhasil dipulihkan."
        : "Laporan berhasil ditutup."
    );

    setAction(null);
    setSelected(null);
  };

  const statusColor = (status) =>
    status === "Aktif" ? "success" : "error";

  const reportColor = (report) =>
    report === "Menunggu"
      ? "warning"
      : report === "Ditangani"
      ? "success"
      : "default";

  const stats = [
    { label: "Total Postingan", value: posts.length, color: "#7E57C2" },
    { label: "Laporan Menunggu", value: reported, color: "#ED6C02" },
    { label: "Disembunyikan", value: hidden, color: "#D32F2F" }
  ];

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", pb: 5 }}>
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: "#9575CD", fontWeight: 600, mb: 1 }}
        >
          Admin / Pengawasan Komunitas
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
          Moderasi Komunitas
        </Typography>

        <Typography color="text.secondary">
          Pantau postingan dan tangani laporan konten
          untuk menjaga keamanan komunitas HERa.
        </Typography>
      </Box>

      {/* STATISTIK */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ ...paperStyle, p: 3 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: `${stat.color}18`,
                  borderRadius: 2,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: stat.color
                  }}
                />
              </Box>

              <Typography color="text.secondary" variant="body2">
                {stat.label}
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#25213B" }}
              >
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* TABEL */}
      <Paper sx={{ ...paperStyle, p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Daftar Postingan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filtered.length} postingan ditampilkan
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              size="small"
              placeholder="Cari postingan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { sm: 240 } }}
            />

            <TextField
              select
              size="small"
              label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              {["Semua", "Dilaporkan", "Aktif", "Disembunyikan"].map(
                (item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                )
              )}
            </TextField>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <TableContainer>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F1FD" }}>
                {[
                  "Postingan",
                  "Kategori",
                  "Tanggal",
                  "Status",
                  "Laporan",
                  "Aksi"
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{ fontWeight: 700, color: "#49366B" }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography fontWeight={600} fontSize={13}>
                      {post.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {post.content}
                    </Typography>
                  </TableCell>

                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.date}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={post.status}
                      color={statusColor(post.status)}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={post.report}
                      color={reportColor(post.report)}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => setSelected(post)}
                      sx={{ textTransform: "none" }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    Tidak ada postingan yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
        Mode demo: data moderasi hanya disimpan di browser.
        Identitas asli pengguna tidak ditampilkan.
      </Alert>

      {/* DETAIL POSTINGAN */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => {
          if (!action) setSelected(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={700}>
          Detail Postingan
        </DialogTitle>

        <DialogContent>
          {selected && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Penulis: {selected.author}
              </Typography>

              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "#FAF8FF" }}
              >
                <Typography>{selected.content}</Typography>
              </Paper>

              <Typography variant="body2">
                <strong>Kategori:</strong> {selected.category}
              </Typography>

              <Typography variant="body2">
                <strong>Status:</strong> {selected.status}
              </Typography>

              <Typography variant="body2">
                <strong>Laporan:</strong> {selected.report}
              </Typography>

              {selected.reportReason && (
                <Alert severity="warning">
                  Alasan laporan: {selected.reportReason}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, flexWrap: "wrap", gap: 1 }}>
          <Button onClick={() => setSelected(null)}>
            Tutup
          </Button>

          {selected?.report === "Menunggu" && (
            <Button
              color="success"
              onClick={() => setAction("keep")}
            >
              Pertahankan
            </Button>
          )}

          {selected?.status === "Aktif" ? (
            <Button
              color="error"
              variant="contained"
              onClick={() => setAction("hide")}
            >
              Sembunyikan
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setAction("restore")}
            >
              Pulihkan
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* KONFIRMASI */}
      <Dialog
        open={Boolean(action)}
        onClose={() => setAction(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle fontWeight={700}>
          Konfirmasi Moderasi
        </DialogTitle>

        <DialogContent>
          <Typography>
            {action === "hide"
              ? "Yakin ingin menyembunyikan postingan ini?"
              : action === "restore"
              ? "Yakin ingin memulihkan postingan ini?"
              : "Yakin ingin mempertahankan postingan dan menutup laporan?"}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAction(null)}>
            Batal
          </Button>
          <Button variant="contained" onClick={updatePost}>
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
