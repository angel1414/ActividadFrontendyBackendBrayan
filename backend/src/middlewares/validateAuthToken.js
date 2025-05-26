import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      // 1. Extraer el token de las cookies
      const { authToken } = req.cookies;

      // 2. Si no hay token, bloquear
      if (!authToken) {
        return res.status(401).json({ message: "No auth token found, you must log in" });
      }

      // 3. Verificar token
      const decoded = jsonwebtoken.verify(authToken, config.JWT.secret);

      // 4. Validar el tipo de usuario
      if (!allowedUserTypes.includes(decoded.userType)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // 5. Guardar info del usuario (opcional)
      req.user = decoded;

      next();

    } catch (error) {
      console.log("Error al verificar token:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
