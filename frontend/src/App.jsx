// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo, useState } from "react";
import { getTheme } from "./theme";

/* Layouts */
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

/* Public Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Apartments from "./pages/Apartments";
import Detail from "./pages/Detail";

/* Admin Pages */
import Dashboard from "./pages/admin/Dashboard";
import AdminApartments from "./pages/admin/AdminApartments";
import CreateApart from "./pages/admin/CreateApart";
import EditApart from "./pages/admin/EditApart";
import Bookings from "./pages/admin/Bookings";
import Users from "./pages/admin/Users";

function App() {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route
            element={
              <PublicLayout
                mode={mode}
                toggleTheme={toggleTheme}
              />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/detail/:id" element={<Detail />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="apartments" element={<AdminApartments />} />
            <Route path="apartments/create" element={<CreateApart />} />
            <Route path="apartments/edit/:id" element={<EditApart />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;