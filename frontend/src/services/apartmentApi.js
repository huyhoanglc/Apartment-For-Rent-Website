import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/apartments",
});

export const createApartment = async (data) => {
  const res = await API.post("/", data);
  return res.data;
};

export const getApartments = async (params = {}) => {
  const res = await API.get("/", { params });
  return res.data;
};

export const uploadRoomImages = async (
  apartmentId,
  roomId,
  files
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await API.post(
    `/${apartmentId}/rooms/${roomId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const setMainImage = async (
  apartmentId,
  roomId,
  imageId
) => {
  const res = await API.put(
    `/${apartmentId}/rooms/${roomId}/images/${imageId}/main`
  );

  return res.data;
};

export const sortImages = async (
  apartmentId,
  roomId,
  imageIds
) => {
  const res = await API.put(
    `/${apartmentId}/rooms/${roomId}/images/sort`,
    {
      images: imageIds,
    }
  );

  return res.data;
};

export const deleteRoomImage = async (
  apartmentId,
  roomId,
  imageId
) => {
  const res = await API.delete(
    `/${apartmentId}/rooms/${roomId}/images/${imageId}`
  );

  return res.data;
};

export const deleteApartment = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};

export const updateApartment = async (id, data) => {
  const res = await API.put(`/${id}`, data);
  return res.data;
};