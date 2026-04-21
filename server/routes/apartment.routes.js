import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
import {
  createApartment,
  getApartments,
  uploadRoomImages,
  setMainImage,
  sortImages,
  deleteApartment,
  deleteRoomImage
} from "../controllers/apartmentController.js";
const router = express.Router();
router.use(protect);
router.post("/", createApartment);
router.get("/", getApartments);
router.post(
  "/:apartmentId/rooms/:roomId/images",
  upload.array("images", 10),
  uploadRoomImages
);
router.put("/:apartmentId/rooms/:roomId/images/:imageId/main", setMainImage);
router.put("/:apartmentId/rooms/:roomId/images/sort", sortImages);

router.delete("/:id", deleteApartment);

router.delete(
  "/:apartmentId/rooms/:roomId/images/:imageId",
  deleteRoomImage
);
export default router;
