import React, { useMemo, useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Tooltip,
  Divider,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";

import {
  Dashboard,
  Apartment,
  AddHome,
  BookOnline,
  People,
  ChevronLeft,
  ChevronRight,
  NotificationsNone,
  LightMode,
  DarkMode,
} from "@mui/icons-material";

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 250;
const collapsedWidth = 78;

const menu = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <Dashboard /> },
  { label: "Apartments", path: "/admin/apartments", icon: <Apartment /> },
  { label: "Create Apartment", path: "/admin/apartments/create", icon: <AddHome /> },
  { label: "Bookings", path: "/admin/bookings", icon: <BookOnline /> },
  { label: "Users", path: "/admin/users", icon: <People /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState("light");

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#2563eb" },
          background: {
            default: mode === "dark" ? "#0f172a" : "#f8fafc",
            paper: mode === "dark" ? "#111827" : "#ffffff",
          },
        },
        shape: { borderRadius: 14 },
      }),
    [mode]
  );

  const sidebarWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: sidebarWidth,
              boxSizing: "border-box",
              overflowX: "hidden",
              px: 1.2,
              py: 1,
              transition: "0.25s",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {/* LOGO */}
          <Toolbar
            sx={{
              px: 1,
              minHeight: 72,
              display: "flex",
              justifyContent: collapsed ? "center" : "space-between",
            }}
          >
            <Box
              onClick={() => navigate("/admin/dashboard")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                cursor: "pointer",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38 }}>
                M
              </Avatar>

              {!collapsed && (
                <Typography fontWeight={800}>MQ ADMIN</Typography>
              )}
            </Box>

            <IconButton onClick={() => setCollapsed((p) => !p)}>
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Toolbar>

          <Divider sx={{ mb: 1 }} />

          {/* MENU */}
          <List sx={{ px: 0.5 }}>
            {menu.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Tooltip key={item.path} title={collapsed ? item.label : ""}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      mb: 0.7,
                      minHeight: 48,
                      px: collapsed ? 1.2 : 1.5,
                      justifyContent: collapsed ? "center" : "flex-start",
                      borderRadius: 3,
                      bgcolor: active ? "primary.main" : "transparent",
                      color: active ? "#fff" : "text.primary",
                      "&:hover": {
                        bgcolor: active ? "primary.dark" : "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed ? 0 : 1.6,
                        color: "inherit",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {!collapsed && (
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: 14, fontWeight: active ? 700 : 500 }}>
                            {item.label}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </List>
        </Drawer>

        {/* CONTENT */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* TOPBAR */}
          <AppBar
            position="sticky"
            elevation={0}
            color="inherit"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              backdropFilter: "blur(8px)",
            }}
          >
            <Toolbar sx={{ minHeight: 72, display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" fontWeight={800}>
                Admin Panel
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton>
                  <NotificationsNone />
                </IconButton>

                <IconButton onClick={() => setMode((p) => (p === "light" ? "dark" : "light"))}>
                  {mode === "light" ? <DarkMode /> : <LightMode />}
                </IconButton>

                <Box
                  sx={{
                    px: 1.2,
                    py: 0.6,
                    borderRadius: 99,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Avatar sx={{ width: 34, height: 34 }}>G</Avatar>

                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography fontSize={13} fontWeight={700}>
                      Gia Huy Hoàng
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      Administrator
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Toolbar>
          </AppBar>

          {/* MAIN */}
          <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}