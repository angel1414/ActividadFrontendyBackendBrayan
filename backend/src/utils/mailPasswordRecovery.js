import nodemailer from "nodemailer";
import { config } from "../config.js";

// Configuración del transporte
const transporte = nodemailer.createTransport({
  host: "smtp.gmail.com", // corregido: antes decía smpt.gmail.com
  port: 465,
  secure: true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Función para enviar correo
const sendEmail = async (to, subject, body, html) => {
  try {
    const info = await transporte.sendMail({
      from: "zonadigital@correo.com",
      to,
      subject,
      text: body,
      html,
    });
    return info;
  } catch (error) {
    console.log("Error al enviar correo:", error);
  }
};

// HTML del correo de recuperación (actualizado con Zona Digital)
const HTMLRecoveryEmail = (codigo) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Zona Digital - Recuperación de Cuenta</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #007bff;
    }
    .content {
      padding: 20px 0;
    }
    .recovery-code {
      background: #e9ecef;
      padding: 20px;
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      border-radius: 6px;
      letter-spacing: 4px;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      padding: 10px 25px;
      border-radius: 5px;
    }
    .footer {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Zona Digital</div>
    </div>
    <div class="content">
      <h2>Código de Recuperación</h2>
      <p>Hola,</p>
      <p>Has solicitado recuperar el acceso a tu cuenta de <strong>Zona Digital</strong>.</p>
      <p>Utiliza el siguiente código para continuar con el proceso:</p>
      <div class="recovery-code">${codigo}</div>
      <p>Este código es válido por 30 minutos.</p>
      <p>Si no realizaste esta solicitud, ignora este mensaje o contacta a soporte.</p>
      <a href="#" class="button">Volver al sitio</a>
    </div>
    <div class="footer">
      <p>Zona Digital &copy; 2025. Todos los derechos reservados.</p>
      <p>Este mensaje fue generado automáticamente. No respondas este correo.</p>
    </div>
  </div>
</body>
</html>
`;
};

export { sendEmail, HTMLRecoveryEmail };
