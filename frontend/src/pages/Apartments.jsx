import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import { getApartments } from "../services/apartmentApi";

export default function Apartments() {
  const [filters, setFilters] = useState({
    keyword: "",
    district: "",
    price: "",
  });

  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState([]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ================= LOAD API ================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.district) params.district = filters.district;

      if (filters.price === "500") {
        params.max = 500;
      }

      if (filters.price === "1000") {
        params.min = 500;
        params.max = 1000;
      }

      if (filters.price === "2000") {
        params.min = 1000;
      }

      const data = await getApartments(params);

      setApartments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.district, filters.price]);

  /* ================= FLATTEN ROOMS ================= */
  const roomList = useMemo(() => {
    let list = [];

    apartments.forEach((apart) => {
      apart.rooms.forEach((room) => {
        list.push({
          apartmentId: apart._id,
          roomId: room._id,
          title:
            apart.name ||
            `${apart.houseNumber} ${apart.street}`,
          location: apart.district,
          price: room.pricePerMonth,
          area: room.area,
          status: room.status,
          desc: `${apart.transportType} • ${apart.petPolicy}`,
          images: room.images
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((img) => img.url),
        });
      });
    });

    if (filters.keyword) {
      list = list.filter((item) =>
        item.title
          .toLowerCase()
          .includes(filters.keyword.toLowerCase())
      );
    }

    return list;
  }, [apartments, filters.keyword]);

  /* ================= GALLERY ================= */
  function Gallery({ images }) {
    const visible = images.slice(0, 3);
    const extra = images.length - 3;

    if (images.length === 0) {
      return (
        <Box
          sx={{
            height: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#eee",
          }}
        >
          No Image
        </Box>
      );
    }

    return (
      <Box
        sx={{
          height: 260,
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 0.5,
          overflow: "hidden",
        }}
      >
        {visible.map((img, i) => (
          <Box
            key={i}
            sx={{
              position: "relative",
              gridRow: i === 0 ? "1 / 3" : "auto",
            }}
          >
            <Box
              component="img"
              src={img}
              alt=""
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {i === 2 && extra > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,.45)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                +{extra}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Typography variant="h3" align="center" fontWeight="bold">
          Our Apartments
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={5}
        >
          Explore premium serviced apartments
        </Typography>

        {/* FILTER */}
        <Paper sx={{ p: 3, borderRadius: 4, mb: 5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={filters.keyword}
                onChange={(e) =>
                  handleChange("keyword", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="District"
                value={filters.district}
                onChange={(e) =>
                  handleChange("district", e.target.value)
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="District 1">
                  District 1
                </MenuItem>
                <MenuItem value="District 7">
                  District 7
                </MenuItem>
                <MenuItem value="Binh Thanh">
                  Binh Thanh
                </MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Price"
                value={filters.price}
                onChange={(e) =>
                  handleChange("price", e.target.value)
                }
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="500">$0 - $500</MenuItem>
                <MenuItem value="1000">$500 - $1000</MenuItem>
                <MenuItem value="2000">$1000+</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{ height: 56 }}
                onClick={fetchData}
              >
                Find
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* LIST */}
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {roomList.map((item) => (
              <Grid
                key={item.roomId}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <Card
                  sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Gallery images={item.images} />

                    <Chip
                      label={`$${item.price}/month`}
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      {item.title}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      my={1}
                    >
                      <LocationOnOutlinedIcon fontSize="small" />
                      <Typography variant="body2">
                        {item.location}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={2}
                    >
                      {item.desc}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}