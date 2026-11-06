
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Stack,
    Avatar,
    Chip,
    Button,
    Divider,
    Alert,
} from "@mui/material";

import {
    GroupsRounded,
    EmailRounded,
    CalendarMonthRounded,
    CheckCircleRounded,
    CancelRounded,
    RefreshRounded,
} from "@mui/icons-material";

import {
    getRequests,
    updateRequestStatus,
} from "./mentorshipStore";

export default function MentorRequests() {
    const { mentorId } = useOutletContext();

    const [requests, setRequests] = useState([]);

    const loadRequests = () => {
        const allRequests = getRequests();

        const mentorRequests = allRequests.filter(
            (item) => String(item.mentorId) === String(mentorId)
        );

        setRequests(mentorRequests);
    };

    useEffect(() => {
        loadRequests();
    }, [mentorId]);

    const handleStatus = (requestId, status) => {
        updateRequestStatus(requestId, mentorId, status);
        loadRequests();
    };

    const getStatusColor = (status) => {
        if (status === "Diterima") return "success";
        if (status === "Ditolak") return "error";
        return "warning";
    };

    const pending = requests.filter(
        (item) => item.status === "Menunggu"
    ).length;

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto" }}>
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                mb={4}
            >
                <Box>
                    <Typography
                        variant="body2"
                        fontWeight={700}
                        color="#9271c7"
                        mb={1}
                    >
                        MENTORING MANAGEMENT
                    </Typography>

                    <Typography variant="h4" fontWeight={800} color="#35294d">
                        Permintaan Mentoring
                    </Typography>

                    <Typography color="text.secondary" mt={1}>
                        Kelola permintaan bimbingan dari para mentee.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<RefreshRounded />}
                    onClick={loadRequests}
                    sx={{
                        borderColor: "#d8c9ed",
                        color: "#805bb6",
                        borderRadius: 3,
                        fontWeight: 700,
                        textTransform: "none",
                    }}
                >
                    Refresh
                </Button>
            </Box>

            {/* Ringkasan */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 4,
                    bgcolor: "#f0eafa",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: "#9271c7",
                        width: 48,
                        height: 48,
                    }}
                >
                    <GroupsRounded />
                </Avatar>

                <Box>
                    <Typography fontWeight={800} color="#594477">
                        {requests.length} Total Permintaan
                    </Typography>

                    <Typography variant="body2" color="#806b9c">
                        {pending} permintaan masih menunggu keputusan.
                    </Typography>
                </Box>
            </Paper>

            {/* Daftar */}
            {requests.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        textAlign: "center",
                        borderRadius: 4,
                        border: "1px dashed #d8c9ed",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 65,
                            height: 65,
                            mx: "auto",
                            mb: 2,
                            bgcolor: "#f0eafa",
                            color: "#9271c7",
                        }}
                    >
                        <GroupsRounded sx={{ fontSize: 32 }} />
                    </Avatar>

                    <Typography variant="h6" fontWeight={800}>
                        Belum Ada Permintaan
                    </Typography>

                    <Typography color="text.secondary" mt={1}>
                        Permintaan mentoring dari mentee akan muncul di sini.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {requests.map((item) => (
                        <Paper
                            key={item.id}
                            elevation={0}
                            sx={{
                                p: { xs: 2.5, md: 3 },
                                borderRadius: 4,
                                border: "1px solid #eee9f5",
                                transition: "0.2s",
                                "&:hover": {
                                    borderColor: "#d8c9ed",
                                    boxShadow:
                                        "0 8px 25px rgba(120,90,160,0.08)",
                                },
                            }}
                        >
                            {/* Identitas Mentee */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                flexWrap="wrap"
                                gap={2}
                                mb={2}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: "#e9def8",
                                            color: "#805bb6",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {(item.menteeName || "M")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </Avatar>

                                    <Box>
                                        <Typography fontWeight={800}>
                                            {item.menteeName || "Mentee"}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Mentee HERa
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Chip
                                    label={item.status || "Menunggu"}
                                    color={getStatusColor(item.status)}
                                    size="small"
                                    sx={{ fontWeight: 700 }}
                                />
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Detail */}
                            <Stack spacing={1.5} mb={2}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <EmailRounded
                                        sx={{ color: "#9878c5", fontSize: 19 }}
                                    />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.email || "-"}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <CalendarMonthRounded
                                        sx={{ color: "#9878c5", fontSize: 19 }}
                                    />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.date || "-"}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: "#faf8fd",
                                    borderRadius: 3,
                                    mb: 2,
                                }}
                            >
                                <Typography fontWeight={800} variant="body2">
                                    Tujuan Mentoring
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={0.5}
                                    sx={{ lineHeight: 1.8 }}
                                >
                                    {item.goal || "-"}
                                </Typography>
                            </Box>

                            {/* Aksi */}
                            {item.status === "Menunggu" && (
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={1.5}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<CheckCircleRounded />}
                                        onClick={() =>
                                            handleStatus(item.id, "Diterima")
                                        }
                                        sx={{
                                            bgcolor: "#69b99b",
                                            borderRadius: 3,
                                            fontWeight: 700,
                                            textTransform: "none",
                                            boxShadow: "none",
                                            "&:hover": {
                                                bgcolor: "#51a987",
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        Terima Permintaan
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelRounded />}
                                        onClick={() =>
                                            handleStatus(item.id, "Ditolak")
                                        }
                                        sx={{
                                            color: "#d46e88",
                                            borderColor: "#e7a7b6",
                                            borderRadius: 3,
                                            fontWeight: 700,
                                            textTransform: "none",
                                            "&:hover": {
                                                bgcolor: "#fff2f5",
                                                borderColor: "#d46e88",
                                            },
                                        }}
                                    >
                                        Tolak Permintaan
                                    </Button>
                                </Stack>
                            )}

                            {item.status !== "Menunggu" && (
                                <Alert
                                    severity={
                                        item.status === "Diterima"
                                            ? "success"
                                            : "error"
                                    }
                                    sx={{ borderRadius: 3 }}
                                >
                                    Permintaan ini sudah {item.status.toLowerCase()}.
                                </Alert>
                            )}
                        </Paper>
                    ))}
                </Stack>
            )}

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
