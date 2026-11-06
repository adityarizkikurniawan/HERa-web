
import { useOutletContext } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Avatar,
    Stack,
    Divider,
    Chip,
} from "@mui/material";

import {
    PersonRounded,
    EmailRounded,
    WorkRounded,
    SchoolRounded,
    SpaRounded,
} from "@mui/icons-material";

export default function MentorProfile() {
    const { mentor } = useOutletContext();

    const profileItems = [
        {
            label: "Nama Lengkap",
            value: mentor.name,
            icon: <PersonRounded />,
        },
        {
            label: "Alamat Email",
            value: mentor.email,
            icon: <EmailRounded />,
        },
        {
            label: "Bidang Keahlian",
            value: mentor.field,
            icon: <WorkRounded />,
        },
        {
            label: "Pengalaman",
            value: mentor.experience,
            icon: <SchoolRounded />,
        },
    ];

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>
            <Typography
                variant="body2"
                fontWeight={700}
                color="#9271c7"
                mb={1}
            >
                INFORMASI AKUN
            </Typography>

            <Typography variant="h4" fontWeight={800} color="#35294d">
                Profil Mentor
            </Typography>

            <Typography color="text.secondary" mt={1} mb={4}>
                Informasi identitas dan bidang keahlian Anda.
            </Typography>

            {/* Header Profil */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 5,
                    mb: 3,
                    background:
                        "linear-gradient(120deg, #8d6ac7, #c5afe7)",
                    color: "#fff",
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems="center"
                    spacing={3}
                >
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: "#fff",
                            color: "#805bb6",
                            fontSize: 38,
                            fontWeight: 800,
                            border: "4px solid rgba(255,255,255,0.5)",
                        }}
                    >
                        {mentor.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box textAlign={{ xs: "center", sm: "left" }}>
                        <Typography variant="h5" fontWeight={800}>
                            {mentor.name}
                        </Typography>

                        <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
                            {mentor.email}
                        </Typography>

                        <Chip
                            icon={<SpaRounded />}
                            label="Mentor HERa"
                            sx={{
                                mt: 1.5,
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "#fff",
                                fontWeight: 700,
                                "& .MuiChip-icon": { color: "#fff" },
                            }}
                        />
                    </Box>
                </Stack>
            </Paper>

            {/* Detail Profil */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 4,
                    border: "1px solid #eee9f5",
                }}
            >
                <Typography variant="h6" fontWeight={800} mb={2}>
                    Informasi Mentor
                </Typography>

                <Divider sx={{ mb: 1 }} />

                <Stack divider={<Divider flexItem />}>
                    {profileItems.map((item) => (
                        <Box
                            key={item.label}
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                                py: 2.5,
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: "#f0eafa",
                                    color: "#805bb6",
                                    width: 42,
                                    height: 42,
                                }}
                            >
                                {item.icon}
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mb={0.5}
                                >
                                    {item.label}
                                </Typography>

                                <Typography
                                    fontWeight={700}
                                    sx={{ overflowWrap: "anywhere" }}
                                >
                                    {item.value || "-"}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Paper>

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
