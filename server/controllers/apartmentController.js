import Apartment from "../models/Apartment.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* upload buffer => cloudinary */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "apartments" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/* CREATE */
export const createApartment = async (req, res) => {
  try {
    const data = await Apartment.create(req.body);

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* GET + FILTER + ROLE ADDRESS */
export const getApartments = async (req, res) => {
  try {
    const {
      district,
      min,
      max,
      petPolicy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (district) query.district = district;
    if (petPolicy) query.petPolicy = petPolicy;

    const isAdmin = req.user?.role === "admin";

    let data = await Apartment.find(query).lean();

    data = data.map((a) => ({
      ...a,

      // admin thấy số nhà
      houseNumber: isAdmin ? a.houseNumber : undefined,

      // địa chỉ hiển thị
      publicAddress: isAdmin
        ? `${a.houseNumber} ${a.street}, ${a.district}`
        : `${a.street}, ${a.district}`,
    }));

    /* filter giá phòng */
    if (min || max) {
      data = data
        .map((a) => ({
          ...a,
          rooms: a.rooms.filter(
            (r) =>
              (!min || r.pricePerMonth >= Number(min)) &&
              (!max || r.pricePerMonth <= Number(max))
          ),
        }))
        .filter((a) => a.rooms.length > 0);
    }

    /* pagination */
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);

    res.json({
      total: data.length,
      page: Number(page),
      limit: Number(limit),
      data: data.slice(start, end),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* UPLOAD ROOM IMAGES */
export const uploadRoomImages = async (req, res) => {
  try {
    const { apartmentId, roomId } = req.params;

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    const room = apartment.rooms.id(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);

      room.images.push({
        cloudinaryPublicId: result.public_id,
        url: result.secure_url,
        sortOrder: room.images.length,
        isMain: room.images.length === 0,
      });
    }

    await apartment.save();

    res.json(room.images);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* SET MAIN IMAGE */
export const setMainImage = async (req, res) => {
  try {
    const { apartmentId, roomId, imageId } = req.params;

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    const room = apartment.rooms.id(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    room.images.forEach((img) => {
      img.isMain = img._id.toString() === imageId;
    });

    await apartment.save();

    res.json(room.images);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* SORT IMAGE */
export const sortImages = async (req, res) => {
  try {
    const { apartmentId, roomId } = req.params;
    const { images } = req.body;

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    const room = apartment.rooms.id(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    images.forEach((id, index) => {
      const img = room.images.id(id);

      if (img) img.sortOrder = index;
    });

    room.images.sort((a, b) => a.sortOrder - b.sortOrder);

    await apartment.save();

    res.json(room.images);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* DELETE APARTMENT + ALL CLOUDINARY IMAGES */
export const deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    /* xóa toàn bộ ảnh trên cloudinary */
    for (const room of apartment.rooms) {
      for (const image of room.images) {
        if (image.cloudinaryPublicId) {
          await cloudinary.uploader.destroy(
            image.cloudinaryPublicId
          );
        }
      }
    }

    /* xóa mongo */
    await Apartment.findByIdAndDelete(id);

    res.json({
      message: "Apartment and all images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* DELETE ROOM IMAGE */
export const deleteRoomImage = async (req, res) => {
  try {
    const { apartmentId, roomId, imageId } = req.params;

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({
        message: "Apartment not found",
      });
    }

    const room = apartment.rooms.id(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const image = room.images.id(imageId);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    /* xóa cloudinary */
    await cloudinary.uploader.destroy(
      image.cloudinaryPublicId
    );

    /* xóa image trong mongo */
    room.images.pull(imageId);

    /* nếu mất main thì set ảnh đầu */
    if (
      room.images.length > 0 &&
      !room.images.some((img) => img.isMain)
    ) {
      room.images[0].isMain = true;
    }

    await apartment.save();

    res.json({
      message: "Image deleted successfully",
      images: room.images,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};