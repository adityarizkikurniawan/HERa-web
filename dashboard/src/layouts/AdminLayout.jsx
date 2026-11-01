
  import { useState } from "react";
  import { Outlet, useNavigate } from "react-router-dom";

  import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
  } from "@mui/material";

  import { Menu, Logout } from "@mui/icons-material";

  import AdminSidebar from "../components/admin/AdminSidebar";
  import { useAuth } from "../context/AuthContext";

  export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/login", { replace: true });
    };

    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#FAF8FF" }}>
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: "1px solid #eee" }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
              aria-label="Buka menu admin"
            >
              <Menu />
            </IconButton>

            <Typography sx={{ flexGrow: 1 }} fontWeight={600}>
              HERa Admin Panel
            </Typography>

            <Button
              startIcon={<Logout />}
              onClick={handleLogout}
              color="primary"
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <Toolbar />

        <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    );
  }
