import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import productsRoutes from "./src/routes/products.js";
import customersRoutes from "./src/routes/customers.js";
import employeeRoutes from "./src/routes/employees.js";
import branchesRoutes from "./src/routes/branches.js";
import registerEmployessRoutes from "./src/routes/registerEmployees.js";
import loginRouter from "./src/routes/login.js";
import logoutRouter from "./src/routes/logout.js";
import registerCliente from "./src/routes/registerClients.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import providersRoutes from "./src/routes/providers.js";


import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";

import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const app = express();

//Traemos el archivo json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("./DocumentacionZonaDigital.json"), "utf-8")
);

// Middleware de CORS
app.use(
  cors({
    origin: "http://actividad-frontendy-backend-brayan.vercel.app",
    credentials: true
  })
);

// Middleware para leer JSON y cookies
app.use(express.json());
app.use(cookieParser()); // ¡Asegúrate de que está antes de usar validateAuthToken!

// Rutas protegidas y públicas
app.use("/api/products", validateAuthToken(["admin", "employee"]), productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/registerEmployees", validateAuthToken(["admin"]), registerEmployessRoutes);

app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/registerClients", registerCliente);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);
app.use("/api/providers", validateAuthToken(["admin"]), providersRoutes);


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
