
import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Avatar,
    Stack,
    Button,
} from "@mui/material";

import {
    GroupsRounded,
    ScheduleRounded,
    CheckCircleRounded,
    CancelRounded,
    PersonRounded,
    ArrowForwardRounded,
    SpaRounded,
} from "@mui/icons-material";

import { getRequests } from "./mentorshipStore";

export default function MentorDashboard() {
    const { mentor, mentorId } = useOutletContext();
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);

    const loadRequests = () => {
        const allRequests = getRequests();

        setRequests(
            allRequests.filter(
                (item) => String(item.mentorId) === String(mentorId)
            )
        );
    };

    useEffect(() => {
        loadRequests();
    }, [mentorId]);

    const pending = requests.filter(
        (item) => item.status === "Menunggu"
    ).length;

    const accepted = requests.filter(
        (item) => item.status === "Diterima"
    ).length;

    const rejected = requests.filter(
        (item) => item.status === "Ditolak"
    ).length;

    const statistics = [
        {
            title: "Total Permintaan",
            value: requests.length,
            icon: <GroupsRounded />,
            color: "#9271c7",
            bg: "#f0eafa",
        },
        {
            title: "Menunggu",
            value: pending,
            icon: <ScheduleRounded />,
            color: "#d99a42",
            bg: "#fff5e6",
        },
        {
            title: "Diterima",
            value: accepted,
            icon: <CheckCircleRounded />,
            color: "#55a987",
            bg: "#e8f7f0",
        },
        {
            title: "Ditolak",
            value: rejected,
            icon: <CancelRounded />,
            color: "#d46e88",
            bg: "#fff0f3",
        },
    ];

    return (
        <Box sx={{ maxWidth: 1250, mx: "auto" }}>
            {/* Header */}
            <Box mb={4}>
                <Typography
                    variant="body2"
                    fontWeight={700}
                    color="#9271c7"
                    mb={1}
                >
                    MENTOR WORKSPACE
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#35294d"
                    sx={{ fontSize: { xs: 25, md: 32 } }}
                >
                    Selamat Datang, {mentor.name}!
                </Typography>

                <Typography color="text.secondary" mt={1}>
                    Pantau aktivitas mentoring Anda melalui dashboard HERa.
                </Typography>
            </Box>

            {/* Banner */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    borderRadius: 5,
                    color: "#fff",
                    background:
                        "linear-gradient(120deg, #8d6ac7, #b49adf, #ddc9f2)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="h5" fontWeight={800} mb={1}>
                        Ruang Inspirasi dan Pertumbuhan
                    </Typography>

                    <Typography sx={{ maxWidth: 550, lineHeight: 1.8 }}>
                        Terus dampingi mentee untuk menemukan potensi
                        terbaiknya. Setiap bimbingan membawa perubahan.
                    </Typography>

                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardRounded />}
                        onClick={() => navigate("/mentor/requests")}
                        sx={{
                            mt: 3,
                            bgcolor: "#fff",
                            color: "#805bb6",
                            borderRadius: 3,
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": {
                                bgcolor: "#f3edfa",
                            },
                        }}
                    >
                        Lihat Permintaan
                    </Button>
                </Box>

                <SpaRounded
                    sx={{
                        position: "absolute",
                        right: 20,
                        bottom: -35,
                        fontSize: { xs: 120, md: 190 },
                        color: "rgba(255,255,255,0.16)",
                    }}
                />
            </Paper>

            {/* Statistik */}
            <Typography variant="h6" fontWeight={800} mb={2}>
                Ringkasan Aktivitas
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        xl: "repeat(4, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {statistics.map((stat) => (
                    <Paper
                        key={stat.title}
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 4,
                            border: "1px solid #eee9f5",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            transition: "0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow:
                                    "0 8px 25px rgba(120,90,160,0.09)",
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: stat.bg,
                                color: stat.color,
                                width: 52,
                                height: 52,
                            }}
                        >
                            {stat.icon}
                        </Avatar>

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {stat.title}
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={800}
                                color="#35294d"
                            >
                                {stat.value}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Profil Singkat */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mt: 4,
                    borderRadius: 4,
                    border: "1px solid #eee9f5",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mb={2}
                >
                    <Avatar sx={{ bgcolor: "#eee5fa", color: "#805bb6" }}>
                        <PersonRounded />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={800}>
                            Profil Mentor
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {mentor.field}
                        </Typography>
                    </Box>

                    <Button
                        endIcon={<ArrowForwardRounded />}
                        onClick={() => navigate("/mentor/profile")}
                        sx={{
                            color: "#805bb6",
                            fontWeight: 700,
                            textTransform: "none",
                        }}
                    >
                        Lihat Profil
                    </Button>
                </Stack>

                <Typography color="text.secondary" variant="body2">
                    {mentor.experience}
                </Typography>
            </Paper>

            {/* Footer */}
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                textAlign="center"
                mt={5}
            >
                © 2026 HERa - Her Empowerment & Resilience Assistant
            </Typography>
        </Box>
    );
}
