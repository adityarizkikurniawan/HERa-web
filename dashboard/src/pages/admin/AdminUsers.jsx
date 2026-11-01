
import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Alert,
} from "@mui/material";

import {
  Search,
  Visibility,
  People,
  CheckCircle,
  Block,
} from "@mui/icons-material";

import {
  getAccounts,
  getUserStatus,
  updateUserStatus,
} from "../../data/auth";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const users = useMemo(() => {
    return getAccounts()
      .filter((account) => account.role === "user")
      .map(({ password, ...account }) => ({
        ...account,
        status: getUserStatus(account.id),
      }));
  }, [refresh]);

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

  const activeUsers = users.filter(
    (user) => user.status === "active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "inactive"
  ).length;

  const handleToggleStatus = (user) => {
    const nextStatus =
      user.status === "active" ? "inactive" : "active";

    const success = updateUserStatus(user.id, nextStatus);

    if (success) {
      setRefresh((prev) => prev + 1);
      setSelectedUser(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Manajemen User
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Kelola akun pengguna HERa melalui panel administrator.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Mode demo: perubahan status hanya disimpan di browser.
        Belum ada backend atau database.
      </Alert>

      {/* Kartu statistik */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          {
            title: "Total User",
            value: users.length,
            icon: <People color="primary" />,
          },
          {
            title: "User Aktif",
            value: activeUsers,
            icon: <CheckCircle color="success" />,
          },
          {
            title: "User Nonaktif",
            value: inactiveUsers,
            icon: <Block color="error" />,
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent>
              <Stack spacing={1}>
                {item.icon}

                <Typography color="text.secondary">
                  {item.title}
                </Typography>

                <Typography variant="h4" fontWeight={700}>
                  {item.value}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tabel pengguna */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" fontWeight={700}>
              Daftar Pengguna
            </Typography>

            <TextField
              size="small"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F3EDF9" }}>
                  <TableCell>No.</TableCell>
                  <TableCell>Pengguna</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow hover key={user.id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Typography fontWeight={600}>
                          {user.name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          user.status === "active"
                            ? "Aktif"
                            : "Nonaktif"
                        }
                        color={
                          user.status === "active"
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => setSelectedUser(user)}
                        aria-label={`Lihat detail ${user.name}`}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Tidak ada pengguna ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog detail pengguna */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detail Pengguna</DialogTitle>

        <DialogContent dividers>
          {selectedUser && (
            <Stack spacing={2}>
              <Typography>
                <strong>Nama:</strong> {selectedUser.name}
              </Typography>

              <Typography>
                <strong>Email:</strong> {selectedUser.email}
              </Typography>

              <Typography>
                <strong>Role:</strong> User
              </Typography>

              <Typography>
                <strong>Status:</strong>{" "}
                {selectedUser.status === "active"
                  ? "Aktif"
                  : "Nonaktif"}
              </Typography>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedUser(null)}>
            Tutup
          </Button>

          {selectedUser && (
            <Button
              variant="contained"
              color={
                selectedUser.status === "active"
                  ? "error"
                  : "success"
              }
              onClick={() => handleToggleStatus(selectedUser)}
            >
              {selectedUser.status === "active"
                ? "Nonaktifkan Akun"
                : "Aktifkan Akun"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
