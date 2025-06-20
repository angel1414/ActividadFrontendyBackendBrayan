import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Carga las variables del .env

// 1- Tomar la URI desde .env
const URI = process.env.DB_URI;

// 2- Conecto la base de datos
mongoose.connect(URI);

// ------ Comprobar que todo funciona ------

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("DB is connected");
});

connection.on("disconnected", () => {
  console.log("DB is disconnected");
});

connection.on("error", (error) => {
  console.log("error found", error);
});
