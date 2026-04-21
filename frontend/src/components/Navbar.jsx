// Navbar.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Paper,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { Link } from "react-router-dom";

import { navLinks } from "../data/navigation";
import { locations } from "../data/locations";

import flagVN from "../assets/Flag_of_Vietnam.png";
import flagUS from "../assets/Flag_of_United_Kingdom.png";
import flagCN from "../assets/Flag_of_China.png";

export default function Navbar({ mode, toggleTheme }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  const [locationAnchor, setLocationAnchor] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);

  const [darkMode, setDarkMode] = useState(false);

  const languages = [
    { code: "EN", name: "English", flag: flagUS },
    { code: "VI", name: "Tiếng Việt", flag: flagVN },
    { code: "CN", name: "中文", flag: flagCN },
  ];

  const [selectedLang, setSelectedLang] = useState(languages[0]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;

      if (current < 10) setShowNavbar(true);
      else if (current > lastScroll) setShowNavbar(false);
      else setShowNavbar(true);

      setLastScroll(current);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  const navStyle = {
    color: darkMode ? "#fff" : "#111",
    fontWeight: 500,
    textTransform: "none",
    fontSize: "15px",
    px: 1.2,
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
        transition: "all .35s ease",
        background: darkMode ? "rgba(18,18,18,0.82)" : "rgba(255,255,255,0.78)",
        backdropFilter: "blur(14px)",
        borderBottom: darkMode
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "78px !important",
          px: { xs: 2, md: 5 },
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: darkMode ? "#fff" : "#111",
            fontWeight: 800,
            fontSize: "28px",
            letterSpacing: 1,
            minWidth: 170,
          }}
        >
          MQ HOUSE
        </Typography>

        {/* Center Menu */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 0.5,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {navLinks.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={navStyle}
            >
              {item.label}
            </Button>
          ))}

          <Button
            sx={navStyle}
            endIcon={<KeyboardArrowDownRoundedIcon />}
            onClick={(e) => setLocationAnchor(e.currentTarget)}
          >
            Locations
          </Button>

          <Menu
            anchorEl={locationAnchor}
            open={Boolean(locationAnchor)}
            onClose={() => setLocationAnchor(null)}
          >
            {locations.map((item) => (
              <MenuItem key={item}>{item}</MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.4,
              width: 260,
              borderRadius: 99,
              bgcolor: darkMode ? "#1f1f1f" : "#fff",
            }}
          >
            <SearchIcon />
            <InputBase
              placeholder="Search apartment..."
              sx={{
                ml: 1,
                flex: 1,
                color: darkMode ? "#fff" : "#111",
              }}
            />
          </Paper>

          {/* Language */}
          <Button
            onClick={(e) => setLangAnchor(e.currentTarget)}
            endIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{
              color: darkMode ? "#fff" : "#111",
              borderRadius: 99,
              textTransform: "none",
            }}
          >
            <img
              src={selectedLang.flag}
              alt=""
              style={{
                width: 22,
                height: 16,
                marginRight: 8,
              }}
            />
            {selectedLang.code}
          </Button>

          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
          >
            {languages.map((item) => (
              <MenuItem
                key={item.code}
                onClick={() => {
                  setSelectedLang(item);
                  setLangAnchor(null);
                }}
              >
                <ListItemIcon>
                  <img src={item.flag} alt="" width="24" />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Menu>

          {/* Theme */}
          <IconButton
            onClick={toggleTheme}
            sx={{ color: mode === "dark" ? "#fff" : "#111" }}
          >
            {mode === "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>

          <IconButton>
            <Badge badgeContent={2} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>

          <IconButton>
            <PersonOutlineOutlinedIcon />
          </IconButton>

          <Button variant="contained" sx={{ borderRadius: 99 }}>
            Book Now
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
