
import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  Box,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#FAF8FC",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      <Navbar
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen && isDesktop}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: 0,
          minHeight: "100vh",
          p: { xs: 2, sm: 3 },
          boxSizing: "border-box",
          transition: "width 250ms ease",
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important" }} />

        <Outlet />
      </Box>
    </Box>
  );
}
