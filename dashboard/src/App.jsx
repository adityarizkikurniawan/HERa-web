
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Typography } from "@mui/material";

import theme from "./theme/theme";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Journaling from "./pages/Journaling";
import Community from "./pages/Community";
import MicroLMS from "./pages/MicroLMS";
import PeriodTracker from "./pages/PeriodTracker";
import Counseling from "./pages/Counseling";
import Mentorship from "./pages/Mentorship";
import Profile from "./pages/Profile";

function ComingSoon({ title }) {
  return (
    <Typography variant="h4" fontWeight="bold">
      {title} — Segera Hadir 🌷
    </Typography>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/journal" element={<Journaling />} />
            <Route path="/community" element={<Community />} />
            <Route path="/learning" element={<MicroLMS />} />
            <Route path="/period" element={<PeriodTracker />} />
            <Route path="/counseling" element={<Counseling />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
