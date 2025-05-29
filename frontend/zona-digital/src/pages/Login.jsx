import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoTitle from "../components/LogoTitle";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
    const res = await fetch("https://frontend-backend-wr79.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
   body: JSON.stringify({ email, password })
});


      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        alert("Credenciales inválidas o falta token");
      }
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <LogoTitle />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button className="login-button" onClick={handleLogin}>
          Ingresar a la tienda
        </button>
      </div>
    </div>
  );
};

export default Login;
