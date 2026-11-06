
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import MentorSidebar from "../components/mentor/MentorSidebar";

import {
    getSession,
    getMentorById,
} from "../pages/mentor/mentorshipStore";

export default function MentorLayout() {
    const navigate = useNavigate();

    const [mentorId] = useState(getSession());
    const mentor = getMentorById(mentorId);

    useEffect(() => {
        if (!mentorId || !mentor) {
            navigate("/login", { replace: true });
        }
    }, [mentorId, mentor, navigate]);

    if (!mentorId || !mentor) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress sx={{ color: "#9271c7" }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                bgcolor: "#f8f6fc",
            }}
        >
            <MentorSidebar mentor={mentor} />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    p: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Outlet context={{ mentor, mentorId }} />
            </Box>
        </Box>
    );
}
