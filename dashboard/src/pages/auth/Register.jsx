
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Avatar,
} from "@mui/material";

import { registerUser } from "../../data/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    const result = registerUser(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    alert("Registrasi berhasil! Silakan login.");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        background:
          "linear-gradient(135deg, #FCE4EC, #EDE7F6, #D1C4E9)",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
        }}
      >
        <Box textAlign="center" mb={3}>
          <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.dark",
              mx: "auto",
              mb: 2,
              width: 60,
              height: 60,
              fontSize: 30,
            }}
          >
            🌷
          </Avatar>

          <Typography variant="h4" fontWeight={700} color="primary.dark">
            Daftar HERa
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Mulai perjalanan wellness dan pengembangan dirimu
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleRegister}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Nama Lengkap"
            name="name"
            fullWidth
            required
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />

          <TextField
            label="Konfirmasi Password"
            name="confirmPassword"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
          >
            Daftar
          </Button>

          <Typography textAlign="center" variant="body2" mt={3}>
            Sudah punya akun?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/login")}
            >
              Masuk Sekarang
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
