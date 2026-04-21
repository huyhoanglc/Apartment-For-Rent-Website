import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  Switch,
  Collapse,
  Stack,
  Fade,
  alpha,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Add from "@mui/icons-material/Add";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Save from "@mui/icons-material/Save";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import HomeWork from "@mui/icons-material/HomeWork";
import Settings from "@mui/icons-material/Settings";
import MeetingRoom from "@mui/icons-material/MeetingRoom";
import PhotoLibrary from "@mui/icons-material/PhotoLibrary";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { locations } from "../../data/locations";

import ImageUploader from "../../components/create-apart/ImageUploader";
import SortableImage from "../../components/create-apart/SortableImage";
import RoomListCard from "../../components/create-apart/RoomListCard";
import RoomPreviewCard from "../../components/create-apart/RoomPreviewCard";

import { saveDraft, getDraft, clearDraft } from "../../utils/storage";

import { createApartment, uploadRoomImages } from "../../services/apartmentApi";

import CustomPopup from "../../components/common/CustomPopup";

const defaultForm = {
  houseNumber: "",
  street: "",
  district: null,
  managerPhone: "",
  transportType: "stairs",
  petPolicy: false,
  allowForeigners: false,
  allowShortTerm: false,
  description: "",
  rooms: [],
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      mb: 3,
      flexWrap: "wrap",
    }}
  >
    <Box
      sx={{
        width: { xs: 40, md: 44 },
        height: { xs: 40, md: 44 },
        borderRadius: 2.5,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon
        sx={{
          color: "primary.main",
          fontSize: { xs: 20, md: 22 },
        }}
      />
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

const Section = ({ icon, title, subtitle, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, sm: 2.5, md: 3 },
      mb: 3,
      borderRadius: { xs: 3, md: 4 },
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <SectionHeader icon={icon} title={title} subtitle={subtitle} />

    <Grid container spacing={{ xs: 1.5, md: 2 }}>
      {children}
    </Grid>
  </Paper>
);

const ConfigSwitch = ({ label, description, checked, onChange }) => (
  <Box
    onClick={onChange}
    sx={{
      p: 2,
      borderRadius: 3,
      border: "1px solid",
      borderColor: checked ? "primary.main" : "divider",
      bgcolor: checked
        ? (theme) => alpha(theme.palette.primary.main, 0.05)
        : "background.paper",
      cursor: "pointer",
      height: "100%",
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color={checked ? "primary.main" : "text.primary"}
        >
          {label}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Switch checked={checked} />
    </Stack>
  </Box>
);

export default function CreateApart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [showPreview, setShowPreview] = useState(!isMobile);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(() => getDraft() || defaultForm);

  const [room, setRoom] = useState({
    roomCode: "",
    pricePerMonth: "",
    roomType: "Studio",
    images: [],
  });

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const roomOptions = ["Studio", "Duplex", "1PN", "2PN", "3PN"];

  const openDialog = ({ title, message, type = "info", onConfirm }) => {
    setDialog({
      open: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const showToast = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    if (isMobile) setShowPreview(false);
  }, [isMobile]);

  useEffect(() => {
    saveDraft(form);
  }, [form]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheck = (name) => () => {
    setForm((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleUploadImages = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setRoom((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setRoom((prev) => {
      const oldIndex = prev.images.findIndex((i) => i.url === active.id);

      const newIndex = prev.images.findIndex((i) => i.url === over.id);

      return {
        ...prev,
        images: arrayMove(prev.images, oldIndex, newIndex),
      };
    });
  };

  const removeImage = (url) => {
    setRoom((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== url),
    }));
  };

  const addRoom = () => {
    if (!room.roomCode || !room.pricePerMonth) return;

    setForm((prev) => ({
      ...prev,
      rooms: [...prev.rooms, room],
    }));

    setRoom({
      roomCode: "",
      pricePerMonth: "",
      roomType: "Studio",
      images: [],
    });
  };

  const removeRoom = (index) => {
    openDialog({
      title: "Xóa phòng",
      message: "Bạn có chắc muốn xóa phòng này?",
      type: "error",
      onConfirm: () => {
        setForm((prev) => ({
          ...prev,
          rooms: prev.rooms.filter((_, i) => i !== index),
        }));

        closeDialog();
        showToast("Đã xóa phòng", "success");
      },
    });
  };

  const resetAll = () => {
    openDialog({
      title: "Xóa toàn bộ dữ liệu",
      message: "Toàn bộ dữ liệu nhập sẽ bị mất. Tiếp tục?",
      type: "warning",
      onConfirm: () => {
        clearDraft();
        setForm(defaultForm);

        setRoom({
          roomCode: "",
          pricePerMonth: "",
          roomType: "Studio",
          images: [],
        });

        setShowPreview(false);
        closeDialog();
        showToast("Đã xóa nháp", "success");
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        name: `${form.street} Apartment`,
        district: form.district,
        petPolicy: form.petPolicy ? "allowed" : "none",
        rooms: form.rooms.map((r) => ({
          roomCode: r.roomCode,
          roomType: r.roomType,
          pricePerMonth: Number(r.pricePerMonth),
          area: 0,
          images: [],
        })),
      };

      const apartment = await createApartment(payload);

      for (let i = 0; i < form.rooms.length; i++) {
        const files = form.rooms[i].images.map((img) => img.file);

        if (files.length > 0) {
          await uploadRoomImages(apartment._id, apartment.rooms[i]._id, files);
        }
      }

      showToast("Lưu căn hộ thành công!", "success");
      resetAll();
    } catch (error) {
      console.error(error);
      showToast("Lỗi khi lưu căn hộ", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN");
  };

  const hasRooms = form.rooms.length > 0;
  const canAddRoom = room.roomCode && room.pricePerMonth;

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4, lg: 5 },
        py: { xs: 2, md: 4 },
        mx: "0",
        width: "100%",
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          sx={{
            fontWeight: 800,
            lineHeight: 1.2,
            fontSize: {
              xs: "1.8rem",
              sm: "2.2rem",
              md: "2.6rem",
            },
          }}
        >
          Thêm Căn Hộ Mới
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            fontSize: { xs: ".95rem", md: "1rem" },
          }}
        >
          Điền thông tin căn hộ và quản lý danh sách phòng của bạn
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* LEFT SIDE */}
          <Grid xs={12} xl={showPreview ? 9 : 12}>
            {/* BASIC */}
            <Section
              icon={HomeWork}
              title="Thông tin cơ bản"
              subtitle="Địa chỉ và liên hệ chính"
            >
              <Grid xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Số nhà"
                  name="houseNumber"
                  value={form.houseNumber}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Tên đường"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>

              {/* QUẬN CỐ ĐỊNH CHIỀU DÀI */}
              <Grid xs={12} sm={6} md={4}>
                <Autocomplete
                  fullWidth
                  options={locations}
                  value={form.district}
                  onChange={(e, value) =>
                    setForm((prev) => ({
                      ...prev,
                      district: value,
                    }))
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      minHeight: 56,
                      paddingRight: "39px !important",
                    },
                    "& .MuiAutocomplete-input": {
                      minWidth: "120px !important",
                    },
                    "& .MuiAutocomplete-endAdornment": {
                      right: 10,
                    },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Quận" fullWidth />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="SĐT"
                  name="managerPhone"
                  value={form.managerPhone}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
            </Section>

            {/* CONFIG */}
            <Section
              icon={Settings}
              title="Cấu hình"
              subtitle="Tiện ích & chính sách"
            >
              <Grid xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Di chuyển"
                  name="transportType"
                  value={form.transportType}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 3,
                    },
                  }}
                >
                  <MenuItem value="elevator">Thang máy</MenuItem>
                  <MenuItem value="stairs">Thang bộ</MenuItem>
                </TextField>
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <ConfigSwitch
                  label="Cho nuôi pet"
                  description="Mèo, chó..."
                  checked={form.petPolicy}
                  onChange={handleCheck("petPolicy")}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <ConfigSwitch
                  label="Người nước ngoài"
                  description="Có visa"
                  checked={form.allowForeigners}
                  onChange={handleCheck("allowForeigners")}
                />
              </Grid>

              <Grid xs={12} sm={6} md={3}>
                <ConfigSwitch
                  label="Ngắn hạn"
                  description="Dưới 6 tháng"
                  checked={form.allowShortTerm}
                  onChange={handleCheck("allowShortTerm")}
                />
              </Grid>

              {/* THÊM Ô MÔ TẢ */}
              <Grid xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mô tả"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả căn hộ, tiện ích, nội quy..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
            </Section>

            {/* ROOM */}
            <Section
              icon={MeetingRoom}
              title="Thông tin phòng"
              subtitle="Thiết lập phòng và quản lý hình ảnh"
            >
              <Grid container spacing={3}>
                <Grid xs={12} lg={8}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Mã phòng"
                          value={room.roomCode}
                          onChange={(e) =>
                            setRoom({
                              ...room,
                              roomCode: e.target.value,
                            })
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: 56,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Grid>

                      <Grid xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Giá thuê"
                          value={formatPrice(room.pricePerMonth)}
                          onChange={(e) =>
                            setRoom({
                              ...room,
                              pricePerMonth: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                VND
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: 56,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Grid>

                      <Grid xs={12} md={4}>
                        <TextField
                          select
                          fullWidth
                          label="Loại phòng"
                          value={room.roomType}
                          onChange={(e) =>
                            setRoom({
                              ...room,
                              roomType: e.target.value,
                            })
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: 56,
                              borderRadius: 3,
                            },
                          }}
                        >
                          {roomOptions.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* THU NHỎ BOX UPLOAD */}
                    <Box
                      sx={{
                        "& .upload-box": {
                          minHeight: 180,
                        },
                      }}
                    >
                      <ImageUploader onUpload={handleUploadImages} />
                    </Box>
                  </Stack>
                </Grid>

                <Grid xs={12} lg={4}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: "divider",
                      minHeight: 250,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} mb={2}>
                      Danh sách ảnh ({room.images.length})
                    </Typography>

                    {room.images.length > 0 && (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={room.images.map((i) => i.url)}
                          strategy={rectSortingStrategy}
                        >
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fill,minmax(95px,1fr))",
                              gap: 1.5,
                            }}
                          >
                            {room.images.map((img, index) => (
                              <SortableImage
                                key={img.url}
                                img={img.url}
                                index={index}
                                onDelete={removeImage}
                              />
                            ))}
                          </Box>
                        </SortableContext>
                      </DndContext>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Section>

            {/* ACTION */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 4,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addRoom}
                  disabled={!canAddRoom}
                  fullWidth={isMobile}
                >
                  Thêm phòng
                </Button>

                {hasRooms && (
                  <>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlined />}
                      onClick={resetAll}
                      fullWidth={isMobile}
                    >
                      Xóa nháp
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={
                        showPreview ? <VisibilityOff /> : <Visibility />
                      }
                      onClick={() => setShowPreview((prev) => !prev)}
                      fullWidth={isMobile}
                    >
                      {showPreview ? "Ẩn preview" : "Xem preview"}
                    </Button>
                  </>
                )}
              </Stack>
            </Paper>

            {/* ROOM LIST */}
            {hasRooms && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Phòng đã thêm ({form.rooms.length})
                </Typography>

                <Grid container spacing={2}>
                  {form.rooms.map((r, index) => (
                    <Grid xs={12} sm={6} lg={showPreview ? 6 : 4} key={index}>
                      <Fade in>
                        <Box>
                          <RoomListCard
                            room={r}
                            onDelete={() => removeRoom(index)}
                          />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* PREVIEW ĐƯA LÊN TRÊN NÚT SUBMIT */}
            {showPreview && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Xem trước
                </Typography>

                {hasRooms ? (
                  <Box
                    sx={{
                      maxWidth: 520,
                    }}
                  >
                    <RoomPreviewCard form={form} isAdmin />
                  </Box>
                ) : (
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      textAlign: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      Chưa có phòng nào
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              disabled={loading || !hasRooms}
              startIcon={<Save />}
              sx={{
                py: 2,
                borderRadius: 4,
                fontSize: "1.05rem",
                fontWeight: 700,
              }}
            >
              {loading ? "Đang xử lý..." : "Hoàn tất & Lưu căn hộ"}
            </Button>
            <CustomPopup
              open={dialog.open}
              title={dialog.title}
              message={dialog.message}
              type="confirm"
              onClose={closeDialog}
              onConfirm={dialog.onConfirm}
            />

            <CustomPopup
              open={snackbar.open}
              title=""
              message={snackbar.message}
              type={snackbar.severity}
              onClose={() =>
                setSnackbar((prev) => ({
                  ...prev,
                  open: false,
                }))
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
