// pages/admin/Bookings.jsx
import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function Bookings() {
  const bookings = [
    { id: 1, customer: "John Doe", room: "Sunrise Luxury", status: "Pending" },
    { id: 2, customer: "Anna", room: "Modern Studio", status: "Confirmed" },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Bookings
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Apartment</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bookings.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.customer}</TableCell>
              <TableCell>{item.room}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}