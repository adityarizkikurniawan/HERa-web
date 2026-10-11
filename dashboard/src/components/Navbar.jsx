
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";

import { Menu, Person } from "@mui/icons-material";

import { SIDEBAR_WIDTH } from "./Sidebar";

export default function Navbar({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: "100%",
          md: sidebarOpen
            ? `calc(100% - ${SIDEBAR_WIDTH}px)`
            : "100%",
        },
        ml: {
          md: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
        },
        transition: "width 250ms ease, margin 250ms ease",
        bgcolor: "#FFFFFF",
        color: "text.primary",
        borderBottom: "1px solid #EEEEEE",
      }}
    >
      <Toolbar sx={{ minHeight: "72px !important" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Buka atau tutup menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <Menu />
        </IconButton>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            flexGrow: 1,
            fontSize: { xs: 17, sm: 20 },
          }}
        >
          HERa Dashboard
        </Typography>

        <Tooltip title="Lihat Profil">
          <IconButton
            onClick={() => navigate("/profile")}
            aria-label="Lihat profil"
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
              }}
            >
              <Person fontSize="small" />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
