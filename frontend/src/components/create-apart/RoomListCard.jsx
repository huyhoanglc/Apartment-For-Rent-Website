import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";

import Delete from "@mui/icons-material/Delete";
import MeetingRoom from "@mui/icons-material/MeetingRoom";
import Image from "@mui/icons-material/Image";

export default function RoomListCard({ room, onDelete }) {
  const theme = useTheme();

  const formatPrice = (value) => {
    if (!value) return "Chưa có giá";
    return `${Number(value).toLocaleString("vi-VN")} đ`;
  };

  const images = room.images || [];
  const hasImages = images.length > 0;

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        transition: "all 0.25s ease",
        bgcolor: "background.paper",
        minHeight: 220,
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-3px)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* IMAGE */}
      {hasImages ? (
        <Box
          sx={{
            position: "relative",
            height: 105,
            overflow: "hidden",
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={images[0].url}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {images.length > 1 && (
            <Chip
              label={`+${images.length - 1}`}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                height: 22,
                fontSize: ".7rem",
                bgcolor: "rgba(0,0,0,.65)",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            height: 105,
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Image sx={{ fontSize: 24, color: "grey.400" }} />
          <Typography
            sx={{
              fontSize: ".75rem",
              color: "text.secondary",
            }}
          >
            Chưa có hình
          </Typography>
        </Box>
      )}

      {/* CONTENT */}
      <CardContent
        sx={{
          p: 1.4,
          "&:last-child": { pb: 1.4 },
        }}
      >
        <Stack spacing={1}>
          {/* TOP */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MeetingRoom
                sx={{
                  fontSize: 14,
                  color: "primary.main",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: ".9rem",
                flex: 1,
              }}
            >
              Mã: {room.roomCode || "---"}
            </Typography>

            <IconButton
              onClick={onDelete}
              size="small"
              sx={{
                p: 0.4,
                color: "grey.400",
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: "error.main",
                },
              }}
            >
              <Delete sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>

          {/* ROOM TYPE */}
          <Typography
            sx={{
              fontSize: ".82rem",
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            Dạng phòng: {room.roomType || "Phòng"}
          </Typography>

          {/* PRICE */}
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: ".95rem",
              color: "primary.main",
            }}
          >
            Giá thuê: {formatPrice(room.pricePerMonth)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}