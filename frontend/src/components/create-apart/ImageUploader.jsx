import React, { useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CloudUpload from '@mui/icons-material/CloudUpload'
import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate'

export default function ImageUploader({ onUpload }) {
  const inputRef = useRef(null)
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const event = { target: { files } }
      onUpload(event)
    }
  }

  return (
    <Box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      sx={{
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
        textAlign: 'center',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.25s ease',
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.02
        )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.1)',
        },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onUpload}
        style={{ display: 'none' }}
      />

      {/* Icon Box */}
      <Box
        sx={{
          width: { xs: 56, sm: 64, md: 72 },
          height: { xs: 56, sm: 64, md: 72 },
          borderRadius: { xs: 2, sm: 3 },
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        <CloudUpload
          sx={{
            fontSize: { xs: 28, sm: 32, md: 36 },
            color: 'primary.main',
          }}
        />
      </Box>

      {/* Title */}
      <Typography
        variant={isMobile ? 'body1' : 'h6'}
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 0.5,
          fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
        }}
      >
        Kéo thả hình ảnh vào đây
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: { xs: 2, sm: 2.5 },
          fontSize: { xs: '0.82rem', sm: '0.9rem', md: '0.95rem' },
          px: { xs: 1, sm: 0 },
        }}
      >
        Hoặc click để chọn từ máy tính
      </Typography>

      {/* Button */}
      <Button
        variant="outlined"
        fullWidth={isMobile}
        startIcon={<AddPhotoAlternate />}
        sx={{
          maxWidth: isMobile ? '100%' : 220,
          borderRadius: 2,
          px: { xs: 2, sm: 3 },
          py: 1,
          fontSize: { xs: '0.85rem', sm: '0.95rem' },
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        }}
      >
        Chọn Hình Ảnh
      </Button>

      {/* Footer */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          color: 'text.secondary',
          mt: { xs: 1.5, sm: 2 },
          fontSize: { xs: '0.72rem', sm: '0.78rem' },
          lineHeight: 1.5,
        }}
      >
        Hỗ trợ: JPG, PNG, WEBP (tối đa 5MB/hình)
      </Typography>
    </Box>
  )
}