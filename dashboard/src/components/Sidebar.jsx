
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Toolbar,
} from "@mui/material";

export const SIDEBAR_WIDTH = 250;

const menus = [
  { label: "Dashboard", path: "/", emoji: "🏠" },
  { label: "Mood Tracker", path: "/mood", emoji: "💗" },
  { label: "Journaling", path: "/journal", emoji: "📖" },
  { label: "Community", path: "/community", emoji: "💬" },
  { label: "Micro-LMS", path: "/learning", emoji: "📚" },
  { label: "Period Tracker", path: "/period", emoji: "🌸" },
  { label: "Konseling", path: "/counseling", emoji: "🤝" },
  { label: "Mentorship", path: "/mentorship", emoji: "🎓" },
  { label: "Profil Pengguna", path: "/profile", emoji: "👤" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);

    // Di HP, sidebar akan menutup setelah memilih menu.
    if (window.innerWidth < 900) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: "100%", bgcolor: "#FFFFFF" }}>
      <Toolbar sx={{ minHeight: "72px !important" }}>
        <Box>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary.main"
          >
            HERa 🌷
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Empowerment & Resilience
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ px: 1.5, py: 2 }}>
        {menus.map((menu) => {
          const selected = location.pathname === menu.path;

          return (
            <ListItemButton
              key={menu.path}
              selected={selected}
              onClick={() => handleNavigate(menu.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                gap: 1.5,
                "&.Mui-selected": {
                  bgcolor: "#EDE7F6",
                  color: "#673AB7",
                },
              }}
            >
              <Typography sx={{ fontSize: 20, mr: 1 }}>
                {menu.emoji}
              </Typography>

              <ListItemText
                primary={menu.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: selected ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* HP: sidebar overlay */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Laptop: sidebar mendorong konten */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: "none", md: "block" },
          width: open ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          transition: "width 250ms ease",
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            transition: "transform 250ms ease",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
