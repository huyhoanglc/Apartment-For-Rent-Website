// pages/admin/Dashboard.jsx
import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

export default function Dashboard() {
  const stats = [
    { title: "Total Apartments", value: 24 },
    { title: "Bookings", value: 12 },
    { title: "Users", value: 58 },
    { title: "Revenue", value: "$8,540" },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((item) => (
        <Grid size={{ xs: 12, md: 3 }} key={item.title}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">{item.title}</Typography>
              <Typography variant="h4" fontWeight="bold">
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}