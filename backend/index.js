import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import connectDB from "./db/connectDB.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
// app.use(
//   cors({
//     origin: ["https://ecommerce-mern-frontend-beta.vercel.app"],
//     methods: ["POST", "GET", "DELETE", "PUT"],
//     credentials: true,
//   })
// );

app.use(express.json());

const db_url = process.env.DB_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", routes);
app.get("/", (req, res) => res.send("server is running"));

connectDB(db_url);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
