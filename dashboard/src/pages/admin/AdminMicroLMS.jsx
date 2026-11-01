
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Avatar,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";


import Add from "@mui/icons-material/Add";
import Search from "@mui/icons-material/Search";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import OndemandVideoOutlined from "@mui/icons-material/OndemandVideoOutlined";
import AudiotrackOutlined from "@mui/icons-material/AudiotrackOutlined";

const STORAGE_KEY = "hera_admin_microlms";

const initialMaterials = [
  {
    id: 1,
    title: "Dasar Public Speaking",
    description: "Belajar berbicara dengan percaya diri.",
    category: "Public Speaking",
    format: "Video",
    url: "",
    status: "Terbit",
  },
  {
    id: 2,
    title: "Mengatur Waktu dengan Efektif",
    description: "Strategi menyusun prioritas harian.",
    category: "Manajemen Waktu",
    format: "Audio",
    url: "",
    status: "Draft",
  },
  {
    id: 3,
    title: "Latihan Berpikir Kreatif",
    description: "Aktivitas untuk melatih kreativitas.",
    category: "Creativity Skill",
    format: "Video",
    url: "",
    status: "Terbit",
  },
];

const emptyForm = {
  title: "",
  description: "",
  category: "Public Speaking",
  format: "Video",
  url: "",
  status: "Draft",
};

const categories = [
  "Public Speaking",
  "Manajemen Waktu",
  "Creativity Skill",
];

const cardStyle = {
  borderRadius: 3,
  border: "1px solid #EEEAF5",
  boxShadow: "0 4px 20px rgba(60, 35, 100, 0.04)",
};

export default function AdminMicroLMS() {
  const [materials, setMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.error("Gagal membaca materi:", error);
    }
    return initialMaterials;
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.title.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        (item.description || "").toLowerCase().includes(keyword);

      const matchStatus =
        filterStatus === "Semua" ||
        item.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [materials, search, filterStatus]);

  const totalPublished = materials.filter(
    (item) => item.status === "Terbit"
  ).length;

  const totalDraft = materials.filter(
    (item) => item.status === "Draft"
  ).length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setOpenDialog(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || "",
      category: item.category,
      format: item.format,
      url: item.url || "",
      status: item.status,
    });
    setOpenDialog(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      setNotification("Judul materi wajib diisi.");
      return;
    }

    if (editingId !== null) {
      setMaterials((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
      setNotification("Materi berhasil diperbarui.");
    } else {
      const newMaterial = {
        ...form,
        id: Date.now(),
      };

      setMaterials((prev) => [...prev, newMaterial]);
      setNotification("Materi berhasil ditambahkan.");
    }

    setOpenDialog(false);
  };

  const handleDelete = () => {
    setMaterials((prev) =>
      prev.filter((item) => item.id !== deleteId)
    );
    setDeleteId(null);
    setNotification("Materi berhasil dihapus.");
  };

  const stats = [
    {
      title: "Total Materi",
      value: materials.length,
      icon: <MenuBookOutlined />,
      color: "#7E57C2",
      bg: "#F1E8FF",
    },
    {
      title: "Materi Terbit",
      value: totalPublished,
      icon: <CheckCircle />,
      color: "#2E7D32",
      bg: "#E8F5E9",
    },
    {
      title: "Materi Draft",
      value: totalDraft,
      icon: <DescriptionOutlined />,
      color: "#ED6C02",
      bg: "#FFF3E0",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", pb: 5 }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "#9575CD", fontWeight: 600, mb: 1 }}
          >
            Admin / Pengelolaan Pembelajaran
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#25213B",
              mb: 1,
              fontSize: { xs: 26, md: 32 },
            }}
          >
            Kelola Micro-LMS
          </Typography>

          <Typography color="text.secondary">
            Kelola materi pembelajaran untuk mendukung
            pengembangan diri perempuan.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{
            bgcolor: "#7E57C2",
            borderRadius: 2,
            px: 3,
            py: 1.4,
            textTransform: "none",
            fontWeight: 700,
            whiteSpace: "nowrap",
            boxShadow: "0 5px 14px rgba(126,87,194,0.22)",
            "&:hover": { bgcolor: "#673AB7" },
          }}
        >
          Tambah Materi
        </Button>
      </Stack>

      {/* STATISTIK */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 4 }}>
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: stat.bg,
                    color: stat.color,
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {stat.title}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#25213B" }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* DAFTAR MATERI */}
      <Paper sx={{ ...cardStyle, p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Daftar Materi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredMaterials.length} materi ditampilkan
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              size="small"
              placeholder="Cari materi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: { sm: 260 },
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {["Semua", "Terbit", "Draft"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F6F1FD" }}>
                {[
                  "Materi Pembelajaran",
                  "Kategori",
                  "Format",
                  "Status",
                  "Aksi",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: 700,
                      color: "#49366B",
                      py: 2,
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredMaterials.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    "& td": {
                      py: 2,
                      borderColor: "#F0EDF5",
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: "#F1E8FF",
                          color: "#7E57C2",
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                        }}
                      >
                        {item.format === "Video" ? (
                          <OndemandVideoOutlined />
                        ) : (
                          <AudiotrackOutlined />
                        )}
                      </Avatar>

                      <Box>
                        <Typography fontWeight={700} fontSize={14}>
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {item.category}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={item.format}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1.5 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={item.status}
                      size="small"
                      color={
                        item.status === "Terbit"
                          ? "success"
                          : "default"
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit materi">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(item)}
                          sx={{ color: "#7E57C2" }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Hapus materi">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteId(item.id)}
                          color="error"
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filteredMaterials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <MenuBookOutlined
                      sx={{ fontSize: 45, color: "#C5B7DF", mb: 1 }}
                    />
                    <Typography color="text.secondary">
                      Tidak ada materi yang ditemukan.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* FORM TAMBAH / EDIT */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingId !== null ? "Edit Materi" : "Tambah Materi"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Judul Materi"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Deskripsi"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              select
              label="Kategori"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Format Materi"
              name="format"
              value={form.format}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Video">Video</MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
            </TextField>

            <TextField
              label="URL Materi"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://..."
              fullWidth
              helperText="Masukkan tautan materi audio atau video."
            />

            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Terbit">Terbit</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Batal
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#7E57C2",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              "&:hover": { bgcolor: "#673AB7" },
            }}
          >
            Simpan Materi
          </Button>
        </DialogActions>
      </Dialog>

      {/* KONFIRMASI HAPUS */}
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>
          Hapus Materi?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Materi yang dihapus tidak dapat dikembalikan
            melalui halaman ini.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>
            Batal
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFIKASI */}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={3000}
        onClose={() => setNotification("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="info"
          onClose={() => setNotification("")}
          variant="filled"
        >
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}
