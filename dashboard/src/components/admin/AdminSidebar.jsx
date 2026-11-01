import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Toolbar } from "@mui/material";
import { Dashboard, People, Psychology, EventAvailable, MenuBook, Forum, Assessment, Settings } from "@mui/icons-material";

const menus = [
  { label: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
  { label: "Manajemen Pengguna", icon: <People />, path: "/admin/users" },
  { label: "Manajemen Mentor", icon: <Psychology />, path: "/admin/mentors" },
  { label: "Monitoring Konsultasi", icon: <EventAvailable />, path: "/admin/konsultasi" },
  { label: "Kelola Micro-LMS", icon: <MenuBook />, path: "/admin/micro-lms" },
  { label: "Moderasi Komunitas", icon: <Forum />, path: "/admin/moderasi" },
  { label: "Laporan Aktivitas", icon: <Assessment />, path: "/admin/laporan" },
  { label: "Pengaturan", icon: <Settings />, path: "/admin/pengaturan" },
];

export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Drawer variant="temporary" open={open} onClose={onClose} ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: 270, boxSizing: "border-box" } }}>
      <Toolbar><Box><Typography fontWeight={700} color="primary">HERa 🌷</Typography>
        <Typography variant="caption" color="text.secondary">Admin Panel</Typography></Box></Toolbar>
      <Divider />
      <List sx={{ px: 1.5 }}>
        {menus.map(menu => (
          <ListItemButton key={menu.path} selected={location.pathname === menu.path}
            onClick={() => { navigate(menu.path); onClose?.(); }}
            sx={{ borderRadius: 2, mb: 0.5, "&.Mui-selected": { bgcolor: "#EDE7F6", color: "#673AB7" } }}>
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{menu.icon}</ListItemIcon>
            <ListItemText primary={menu.label} primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
