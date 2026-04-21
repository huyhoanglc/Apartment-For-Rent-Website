import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout({ mode, toggleTheme }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar mode={mode} toggleTheme={toggleTheme} />

      <Box component="main" sx={{ flex: 1, pt: "78px" }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}