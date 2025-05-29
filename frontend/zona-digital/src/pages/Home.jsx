import React from "react";
import { useNavigate } from "react-router-dom";
import HomeTitle from "../components/HomeTitle";
import HomeButton from "../components/HomeButton";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("https://frontend-backend-wr79.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        navigate("/"); // Vuelve al login
      } else {
        alert("Error al cerrar sesión");
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="home-container">
      <HomeTitle />
      <div className="home-buttons">
        <HomeButton label="Administrar Productos" onClick={() => navigate("/productos")} />
        <HomeButton label="Administrar Empleados" onClick={() => navigate("/empleados")} />
        <HomeButton label="Administrar Sucursales" onClick={() => navigate("/sucursales")} />
      </div>

      <button className="cerrar-sesion" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
