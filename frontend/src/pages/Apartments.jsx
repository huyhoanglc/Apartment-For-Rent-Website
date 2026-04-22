import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { getApartments } from "../services/apartmentApi";
import RoomPreviewCard from "../components/RoomPreviewCard";

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

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.district) {
        params.district = filters.district;
      }

      if (filters.price === "500") {
        params.max = 5000000;
      }

      if (filters.price === "1000") {
        params.min = 5000000;
        params.max = 10000000;
      }

      if (filters.price === "2000") {
        params.min = 10000000;
      }

      const data = await getApartments(params);

      let result = data;

      if (filters.keyword) {
        result = result.filter((item) =>
          `${item.houseNumber} ${item.street}`
            .toLowerCase()
            .includes(filters.keyword.toLowerCase())
        );
      }

      setApartments(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.district, filters.price]);

  return (
    <Box sx={{ py: 8, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          mb={1}
        >
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={filters.keyword}
                onChange={(e) =>
                  handleChange(
                    "keyword",
                    e.target.value
                  )
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

            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="District"
                value={filters.district}
                onChange={(e) =>
                  handleChange(
                    "district",
                    e.target.value
                  )
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

            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Price"
                value={filters.price}
                onChange={(e) =>
                  handleChange(
                    "price",
                    e.target.value
                  )
                }
              >
                <MenuItem value="">
                  Any
                </MenuItem>
                <MenuItem value="500">
                  dưới 5 triệu
                </MenuItem>
                <MenuItem value="1000">
                  5 - 10 triệu
                </MenuItem>
                <MenuItem value="2000">
                  trên 10 triệu
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
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
          <Grid container spacing={3}>
            {apartments.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={item._id}
              >
                <RoomPreviewCard
                  form={item}
                  isAdmin={false}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}