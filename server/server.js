import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import apartmentRoutes from "./routes/apartment.routes.js";

const app = express();

/* middleware */
app.use(cors());
app.use(express.json());

/* routes */
app.use("/api/apartments", apartmentRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});


/* start server */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server start failed:", error.message);
  }
};

startServer();