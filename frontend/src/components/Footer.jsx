import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { Link } from "react-router-dom";
import { navLinks } from "../data/navigation";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#111",
        color: "#fff",
        pt: 8,
        pb: 3,
        mt: 10,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              MQ HOUSE
            </Typography>

            <Typography sx={{ color: "rgba(255,255,255,.75)", mb: 3 }}>
              Premium serviced apartments for short-term and long-term stays.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton sx={{ color: "#fff" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>

            {navLinks.map((item) => (
              <Typography
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  display: "block",
                  mb: 1,
                  textDecoration: "none",
                  color: "rgba(255,255,255,.75)",
                  transition: "0.3s",
                  "&:hover": {
                    color: "#fff",
                    pl: 1,
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact
            </Typography>

            <Typography sx={{ mb: 1 }}>Ho Chi Minh City, Vietnam</Typography>
            <Typography sx={{ mb: 1 }}>+84 123 456 789</Typography>
            <Typography>info@mqhouse.com</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,.1)" }} />

        <Typography
          align="center"
          sx={{ color: "rgba(255,255,255,.6)", fontSize: 14 }}
        >
          © 2026 MQ HOUSE. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}