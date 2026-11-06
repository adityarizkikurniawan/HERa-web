
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clearSession } from "../../pages/mentor/mentorshipStore";

import {
    Box,
    Typography,
    Avatar,
    Button,
    Stack,
    Divider,
} from "@mui/material";

import {
    SpaRounded,
    DashboardRounded,
    PersonRounded,
    EventNoteRounded,
    LogoutRounded,
} from "@mui/icons-material";

const menuItems = [
    {
        label: "Dashboard",
        path: "/mentor",
        icon: <DashboardRounded />,
        end: true,
    },
    {
        label: "Profil Mentor",
        path: "/mentor/profile",
        icon: <PersonRounded />,
    },
    {
        label: "Permintaan Mentoring",
        path: "/mentor/requests",
        icon: <EventNoteRounded />,
    },
];

export default function MentorSidebar({ mentor }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        clearSession();
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <Box
            component="aside"
            sx={{
                width: { xs: "100%", md: 260 },
                minWidth: { md: 260 },
                minHeight: { xs: "auto", md: "100vh" },
                bgcolor: "#fff",
                borderRight: { md: "1px solid #eee8f5" },
                p: 3,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Logo */}
            <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                <Avatar
                    sx={{
                        bgcolor: "#9271c7",
                        width: 46,
                        height: 46,
                    }}
                >
                    <SpaRounded />
                </Avatar>

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        color="#805bb6"
                    >
                        HERa
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Mentor Workspace
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ borderColor: "#eee8f5", mb: 3 }} />

            <Typography
                variant="caption"
                fontWeight={700}
                sx={{
                    color: "#a69ab8",
                    letterSpacing: 1,
                    mb: 1.5,
                }}
            >
                MENU UTAMA
            </Typography>

            {/* Navigasi */}
            <Stack spacing={1}>
                {menuItems.map((item) => (
                    <Button
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        end={item.end}
                        fullWidth
                        startIcon={item.icon}
                        sx={{
                            justifyContent: "flex-start",
                            px: 2,
                            py: 1.5,
                            borderRadius: 3,
                            color: "#786d89",
                            fontWeight: 600,
                            textTransform: "none",
                            "&.active": {
                                bgcolor: "#f0eafa",
                                color: "#805bb6",
                                fontWeight: 800,
                            },
                            "&:hover": {
                                bgcolor: "#f8f5fc",
                                color: "#805bb6",
                            },
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Stack>

            <Box sx={{ flexGrow: 1, minHeight: 20 }} />

            {/* Profil singkat */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: "#f8f5fc",
                    borderRadius: 3,
                    mb: 2,
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: "#b69bdf", fontWeight: 700 }}>
                        {mentor?.name?.charAt(0)?.toUpperCase() || "M"}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography fontSize={13} fontWeight={700} noWrap>
                            {mentor?.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Mentor HERa
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Logout */}
            <Button
                fullWidth
                startIcon={<LogoutRounded />}
                onClick={handleLogout}
                sx={{
                    justifyContent: "flex-start",
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    color: "#d46e88",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": {
                        bgcolor: "#fff0f3",
                    },
                }}
            >
                Keluar
            </Button>
        </Box>
    );
}
