// Importamos los modelos
import customersModel from "../models/customers.js";
import employeesModel from "../models/employee.js";
import bcrypt from "bcryptjs"; // Encriptar
import jsonwebtoken from "jsonwebtoken"; // Generar Token
import { config } from "../config.js";

// Controlador de login
const loginController = {};

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound;
    let userType;

    // Admin
    if (email === config.ADMIN.emailAdmin && password === config.ADMIN.password) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      // Empleado
      userFound = await employeesModel.findOne({ email });
      userType = "employee";

      // Cliente
      if (!userFound) {
        userFound = await customersModel.findOne({ email });
        userType = "customer";
      }
    }

    // Usuario no encontrado
    if (!userFound) {
      return res.status(401).json({ message: "user not found" });
    }

    // Validar contraseña si no es admin
    if (userType !== "admin") {
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (!isMatch) {
        return res.status(401).json({ message: "invalid password" });
      }
    }

    // Generar token
    jsonwebtoken.sign(
      { id: userFound._id, userType },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) {
          console.log("Error generando token:", error);
          return res.status(500).json({ message: "Error generando token" });
        }

        // ✅ Guardar token en cookie
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: false,   // true si usas HTTPS
          sameSite: "Lax"
        });

        // ✅ Enviar token por si también lo quieres en localStorage
        res.json({
          message: "Login successful",
          token
        });
      }
    );

  } catch (error) {
    console.log("Error general en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default loginController;
