import React, { useEffect, useState } from "react";
import CrudHeader from "../components/CrudHeader";
import "../styles/Sucursales.css";
import { useNavigate } from "react-router-dom";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    birthday: "",
    schedule: "",
    telephone: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  const cargarSucursales = () => {
    fetch("http://localhost:4000/api/branches", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(setSucursales)
      .catch((err) => console.error("Error cargando sucursales:", err));
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Formulario a enviar:", form);

    const url = editandoId
      ? `http://localhost:4000/api/branches/${editandoId}`
      : "http://localhost:4000/api/branches";

    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setForm({
        name: "",
        address: "",
        birthday: "",
        schedule: "",
        telephone: "",
      });
      setEditandoId(null);
      cargarSucursales();
    } else {
      alert(data.message || "Error al guardar sucursal");
    }
  };

  const eliminarSucursal = async (id) => {
    await fetch(`http://localhost:4000/api/branches/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    cargarSucursales();
  };

  const iniciarEdicion = (suc) => {
    setForm({
      name: suc.name || "",
      address: suc.address || "",
      birthday: suc.birthday ? suc.birthday.slice(0, 10) : "",
      schedule: suc.schedule || "",
      telephone: suc.telephone || "",
    });
    setEditandoId(suc._id);
  };

  return (
    <div className="crud-container">
      <button className="volver-home" onClick={() => navigate("/home")}>
        ← Volver al inicio
      </button>

      <CrudHeader title="Administrar Sucursales" />

      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
        />
        <input
          type="text"
          name="schedule"
          placeholder="Horario"
          value={form.schedule}
          onChange={handleChange}
        />
        <input
          type="number"
          name="telephone"
          placeholder="Teléfono"
          value={form.telephone}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {editandoId ? "Actualizar" : "Agregar sucursal"}
        </button>
      </div>

      <div className="tabla-productos">
        <div className="encabezado">
          <span>Nombre</span>
          <span>Dirección</span>
          <span>Fundación</span>
          <span>Horario</span>
          <span>Teléfono</span>
          <span>Acciones</span>
        </div>

        {sucursales.map((suc) => (
          <div className="fila" key={suc._id}>
            <span><strong>{suc.name}</strong></span>
            <span>{suc.address || "—"}</span>
            <span>{suc.birthday ? new Date(suc.birthday).toLocaleDateString() : "—"}</span>
            <span>{suc.schedule || "—"}</span>
            <span>{suc.telephone || "—"}</span>
            <span className="botones">
              <button className="editar" onClick={() => iniciarEdicion(suc)}>Editar</button>
              <button className="eliminar" onClick={() => eliminarSucursal(suc._id)}>Eliminar</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sucursales;
