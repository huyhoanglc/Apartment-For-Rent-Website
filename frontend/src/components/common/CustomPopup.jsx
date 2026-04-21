import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Fade,
} from "@mui/material";

import Close from "@mui/icons-material/Close";
import WarningAmber from "@mui/icons-material/WarningAmber";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

export default function CustomPopup({
  open,
  type = "info",
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onClose,
  onConfirm,
  autoHide = 2500,
}) {
  const isDialog = type === "confirm";

  const iconMap = {
    success: <CheckCircle fontSize="small" />,
    error: <ErrorOutlineOutlined fontSize="small" />,
    warning: <WarningAmber fontSize="small" />,
    info: <InfoOutlined fontSize="small" />,
  };

  if (isDialog) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}

          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            {message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>
            {cancelText}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHide}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        severity={type}
        variant="filled"
        onClose={onClose}
        icon={iconMap[type]}
        sx={{
          minWidth: 300,
          borderRadius: 3,
        }}
      >
        <Stack spacing={0.4}>
          {title && (
            <Typography fontWeight={700}>
              {title}
            </Typography>
          )}

          <Typography fontSize=".85rem">
            {message}
          </Typography>
        </Stack>
      </Alert>
    </Snackbar>
  );
}