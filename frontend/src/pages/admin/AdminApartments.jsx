import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

export default function AdminApartments() {
  const data = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
      address: "12 Nguyễn Huệ",
      district: "Quận 1",
      roomTypes: ["Studio", "1PN", "2PN"],
      minPrice: "8.500.000đ",
      maxPrice: "15.000.000đ",
      ownerPhone: "0901 234 567",
      elevator: "Thang máy",
      pet: "Được nuôi thú cưng",
      shortTerm: "Có",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",
      address: "88 Lê Văn Sỹ",
      district: "Quận 3",
      roomTypes: ["Studio", "Duplex"],
      minPrice: "6.500.000đ",
      maxPrice: "10.000.000đ",
      ownerPhone: "0909 888 777",
      elevator: "Thang bộ",
      pet: "Không",
      shortTerm: "Không",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      address: "45 Phú Mỹ Hưng",
      district: "Quận 7",
      roomTypes: ["1PN", "2PN", "3PN", "Duplex"],
      minPrice: "12.000.000đ",
      maxPrice: "28.000.000đ",
      ownerPhone: "0933 456 999",
      elevator: "Thang máy",
      pet: "Chỉ mèo",
      shortTerm: "Có",
    },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Quản Lý Căn Hộ
        </Typography>

        <Button variant="contained">Thêm Căn Hộ</Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ảnh</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Quận</TableCell>
            <TableCell>Dạng phòng</TableCell>
            <TableCell>Giá thấp nhất</TableCell>
            <TableCell>Giá cao nhất</TableCell>
            <TableCell>SĐT chủ nhà</TableCell>
            <TableCell>Di chuyển</TableCell>
            <TableCell>Thú cưng</TableCell>
            <TableCell>Ngắn hạn</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Box
                  component="img"
                  src={item.image}
                  alt=""
                  sx={{
                    width: 90,
                    height: 60,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              </TableCell>

              <TableCell>{item.address}</TableCell>
              <TableCell>{item.district}</TableCell>

              <TableCell>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {item.roomTypes.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </TableCell>

              <TableCell>{item.minPrice}</TableCell>
              <TableCell>{item.maxPrice}</TableCell>
              <TableCell>{item.ownerPhone}</TableCell>
              <TableCell>{item.elevator}</TableCell>
              <TableCell>{item.pet}</TableCell>
              <TableCell>{item.shortTerm}</TableCell>

              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip label="Sửa" color="primary" clickable />
                  <Chip label="Xóa" color="error" clickable />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}