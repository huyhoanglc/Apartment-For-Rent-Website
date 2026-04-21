import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Stack,
} from "@mui/material";

export default function Users() {
  const users = [
    { id: 1, name: "Gia Huy", email: "huy@gmail.com" },
    { id: 2, name: "Linh", email: "linh@gmail.com" },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{item.name[0]}</Avatar>
                  {item.name}
                </Stack>
              </TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}