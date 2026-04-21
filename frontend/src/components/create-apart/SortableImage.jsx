import React from "react";
import { Box, Chip, IconButton, alpha, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableImage({ img, index, onDelete }) {
  const theme = useTheme();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : "auto",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        width: {
          xs: "calc(50% - 6px)",
          sm: 140,
          md: 150,
        },
        minWidth: {
          xs: "calc(50% - 6px)",
          sm: 140,
        },
        position: "relative",
        borderRadius: { xs: 2, sm: 3 },
        overflow: "hidden",
        border: index === 0
          ? "2px solid #1976d2"
          : "1px solid",
        borderColor: index === 0 ? "primary.main" : "divider",
        bgcolor: "background.paper",
        boxShadow: isDragging
          ? "0 14px 30px rgba(0,0,0,0.18)"
          : "0 4px 12px rgba(0,0,0,0.05)",
        transformOrigin: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: isDragging ? undefined : "translateY(-2px)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* IMAGE + DRAG */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <Box
          component="img"
          src={img}
          alt={`image-${index}`}
          sx={{
            width: "100%",
            height: {
              xs: 95,
              sm: 105,
              md: 110,
            },
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* drag icon */}
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <DragIndicatorIcon
            sx={{
              color: "#fff",
              fontSize: 18,
            }}
          />
        </Box>
      </Box>

      {/* LABEL */}
      <Chip
        label={index === 0 ? "Ảnh Chính" : `Ảnh ${index + 1}`}
        size="small"
        color={index === 0 ? "primary" : "default"}
        sx={{
          position: "absolute",
          top: 6,
          left: 6,
          height: 24,
          fontSize: "0.72rem",
          fontWeight: 600,
          backdropFilter: "blur(6px)",
          bgcolor:
            index === 0
              ? undefined
              : alpha(theme.palette.background.paper, 0.9),
        }}
      />

      {/* DELETE */}
      <IconButton
        size="small"
        onClick={() => onDelete(img)}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          width: 28,
          height: 28,
          bgcolor: alpha(theme.palette.background.paper, 0.92),
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          "&:hover": {
            bgcolor: alpha(theme.palette.error.main, 0.12),
            color: "error.main",
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}