import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import Phone from "@mui/icons-material/Phone";
import Elevator from "@mui/icons-material/Elevator";
import Stairs from "@mui/icons-material/Stairs";
import Pets from "@mui/icons-material/Pets";
import Public from "@mui/icons-material/Public";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import MeetingRoom from "@mui/icons-material/MeetingRoom";

export default function RoomPreviewCard({
  form,
  isAdmin = true,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const districtLabel =
    typeof form.district === "object"
      ? form.district?.label
      : form.district;

  const rooms = form.rooms || [];

  /* LẤY ẢNH MAIN MỖI ROOM = ẢNH ĐẦU TIÊN */
  const images = rooms
    .map((room) => room.images?.[0])
    .filter(Boolean);

  const hasImages = images.length > 0;

  const prices = rooms
    .map((r) => Number(r.pricePerMonth))
    .filter(Boolean);

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const roomTypes = [
    ...new Set(
      rooms.map((r) => r.roomType).filter(Boolean)
    ),
  ];

  const totalRooms = rooms.length;

  const formatMoney = (value) =>
    Number(value).toLocaleString("vi-VN");

  const priceText =
    minPrice && maxPrice
      ? minPrice === maxPrice
        ? `${formatMoney(minPrice)} đ/tháng`
        : `${formatMoney(minPrice)} ~ ${formatMoney(maxPrice)} đ/tháng`
      : "Giá phòng";

  const title = isAdmin
    ? `${form.houseNumber || ""} ${form.street || ""} ${districtLabel || ""}`
    : `${form.street || ""} ${districtLabel || ""}`;

  const features = [
    {
      icon: form.transportType === "elevator" ? Elevator : Stairs,
      label:
        form.transportType === "elevator"
          ? "Thang máy"
          : "Thang bộ",
      active: true,
    },
    {
      icon: Pets,
      label: "Thú cưng",
      active: form.petPolicy,
    },
    {
      icon: Public,
      label: "Ngoại quốc",
      active: form.allowForeigners,
    },
    {
      icon: CalendarMonth,
      label: "Ngắn hạn",
      active: form.allowShortTerm,
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* IMAGE */}
      {hasImages ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              images.length > 1
                ? { xs: "1fr 1fr", sm: "2fr 1fr" }
                : "1fr",
            gridTemplateRows:
              images.length > 2
                ? { xs: "95px 95px", sm: "115px 115px" }
                : { xs: "190px", sm: "230px" },
            gap: 0.5,
            bgcolor: "grey.100",
          }}
        >
          {images.slice(0, 3).map((img, i) => (
            <Box
              key={i}
              sx={{
                position: "relative",
                overflow: "hidden",
                gridRow:
                  i === 0 && images.length > 1
                    ? { sm: "1 / 3" }
                    : "auto",
              }}
            >
              <Box
                component="img"
                src={img.url}
                alt=""
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {i === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    bgcolor: "rgba(0,0,0,.65)",
                    color: "#fff",
                    px: 1.2,
                    py: 0.4,
                    borderRadius: 2,
                    fontSize: ".75rem",
                    fontWeight: 700,
                  }}
                >
                  {images.length} ảnh
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            height: 190,
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <ImageOutlined
            sx={{
              fontSize: 42,
              color: "grey.400",
            }}
          />
          <Typography color="text.secondary">
            Chưa có hình ảnh
          </Typography>
        </Box>
      )}

      {/* CONTENT */}
      <CardContent sx={{ p: 3 }}>
        {/* PRICE */}
        <Box
          sx={{
            display: "inline-flex",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            px: 2,
            py: 0.8,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography fontWeight={800}>
            {priceText}
          </Typography>
        </Box>

        {/* TITLE */}
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.15rem",
            lineHeight: 1.4,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        {/* SUB INFO */}
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: ".95rem",
            mb: 1,
          }}
        >
          Dạng phòng:{" "}
          {roomTypes.length
            ? roomTypes.join(", ")
            : "Chưa có dữ liệu"}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <MeetingRoom
            sx={{
              fontSize: 18,
              color: "primary.main",
            }}
          />
          <Typography fontWeight={600} fontSize=".95rem">
            Tổng số phòng: {totalRooms}
          </Typography>
        </Stack>

        {/* PHONE */}
        {form.managerPhone && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Phone
              sx={{
                fontSize: 18,
                color: "primary.main",
              }}
            />
            <Typography
              fontWeight={600}
              fontSize=".95rem"
            >
              Số điện thoại chủ nhà: {form.managerPhone}
            </Typography>
          </Stack>
        )}

        <Divider sx={{ my: 2 }} />

        {/* FEATURES */}
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{ mb: 3 }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <Chip
                key={i}
                icon={<Icon sx={{ fontSize: 16 }} />}
                label={feature.label}
                size="small"
                variant={
                  feature.active
                    ? "filled"
                    : "outlined"
                }
                sx={{
                  bgcolor: feature.active
                    ? alpha(
                        theme.palette.primary.main,
                        0.1
                      )
                    : "transparent",
                  color: feature.active
                    ? "primary.main"
                    : "text.secondary",
                  borderColor: "divider",
                }}
              />
            );
          })}
        </Stack>

        {/* BUTTON */}
        <Button
          fullWidth
          variant="contained"
          size={isMobile ? "medium" : "large"}
          endIcon={<ArrowForward />}
          sx={{
            py: 1.3,
            borderRadius: 2.5,
            fontWeight: 700,
          }}
        >
          Xem Chi Tiết
        </Button>
      </CardContent>
    </Card>
  );
}