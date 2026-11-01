import { getAccounts } from "../../data/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


const handleLogin = (e) => {
  e.preventDefault();
  setError("");

  const account = getAccounts().find(
    (item) =>
      item.email === email.trim().toLowerCase() &&
      item.password === password
  );

  if (!account) {
    setError("Email atau password tidak sesuai.");
    return;
  }

  // Simpan sesi sekaligus perbarui state AuthContext
  login(account);

  // Arahkan berdasarkan role
  if (account.role === "admin") {
    navigate("/admin/dashboard", { replace: true });
  } else if (account.role === "psikolog") {
    navigate("/psikolog/dashboard", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
};
    

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "linear-gradient(135deg, #FCE4EC 0%, #EDE7F6 55%, #D1C4E9 100%)",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.dark",
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              fontSize: 32,
            }}
          >
            🌷
          </Avatar>

          <Typography variant="h4" fontWeight={700} color="primary.dark">
            HERa
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Her Empowerment & Resilience Assistant
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }} fontWeight={600}>
            Selamat Datang Kembali!
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Masuk untuk melanjutkan perjalananmu.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleLogin}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label="Tampilkan atau sembunyikan password"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
          >
            Masuk
          </Button>

          <Typography textAlign="center" variant="body2" sx={{ mt: 3 }}>
            Belum punya akun?{" "}
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => navigate("/register")}
            >
              Daftar Sekarang
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
