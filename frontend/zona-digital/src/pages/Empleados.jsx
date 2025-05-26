import React, { useEffect, useState } from "react";
import CrudHeader from "../components/CrudHeader";
import "../styles/Empleados.css";
import { useNavigate } from "react-router-dom";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    birthday: "",
    email: "",
    address: "",
    password: "",
    hireDate: "",
    telephone: "",
    dui: "",
    issNumber: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  const cargarEmpleados = () => {
    fetch("http://localhost:4000/api/employee", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setEmpleados(data))
      .catch((err) =>
        console.error("Hubo un error al cargar los empleados.", err)
      );
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = editandoId
      ? `http://localhost:4000/api/employee/${editandoId}`
      : "http://localhost:4000/api/employee";

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
        lastName: "",
        birthday: "",
        email: "",
        address: "",
        password: "",
        hireDate: "",
        telephone: "",
        dui: "",
        issNumber: "",
      });
      setEditandoId(null);
      cargarEmpleados();
    } else {
      alert(data.message || "Error al guardar empleado");
    }
  };

  const eliminarEmpleado = async (id) => {
    await fetch(`http://localhost:4000/api/employee/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    cargarEmpleados();
  };

  const iniciarEdicion = (emp) => {
    setForm({
      name: emp.name || "",
      lastName: emp.lastName || "",
      birthday: emp.birthday?.slice(0, 10) || "",
      email: emp.email || "",
      address: emp.address || "",
      password: emp.password || "", // ✅ ahora se muestra la contraseña
      hireDate: emp.hireDate || "",
      telephone: emp.telephone || "",
      dui: emp.dui || "",
      issNumber: emp.issNumber || "",
    });
    setEditandoId(emp._id);
  };

  return (
    <div className="crud-container">
      <CrudHeader title="Administrar Empleados" />
      <div className="form-group">
        <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} />
        <input type="date" name="birthday" placeholder="Nacimiento" value={form.birthday} onChange={handleChange} />
        <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} />
        <input type="text" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} /> {/* ✅ visible */}
        <input type="text" name="hireDate" placeholder="Fecha de contratación" value={form.hireDate} onChange={handleChange} />
        <input type="text" name="telephone" placeholder="Teléfono" value={form.telephone} onChange={handleChange} />
        <input type="text" name="dui" placeholder="DUI" value={form.dui} onChange={handleChange} />
        <input type="text" name="issNumber" placeholder="N° ISSS" value={form.issNumber} onChange={handleChange} />

        <button onClick={handleSubmit}>
          {editandoId ? "Actualizar empleado" : "Agregar empleado"}
        </button>
        <button className="volver" onClick={() => navigate("/home")}>Volver al home</button>
      </div>

      <div className="tabla-productos">
        <div className="encabezado">
          <span>Nombre</span>
          <span>Apellido</span>
          <span>Correo</span>
          <span>Teléfono</span>
          <span>DUI</span>
          <span>ISSS</span>
          <span>Dirección</span>
          <span>Contratación</span>
          <span>Contraseña</span>
          <span>Acciones</span>
        </div>

        {empleados.map((emp) => (
          <div className="fila" key={emp._id}>
            <span><strong>{emp.name}</strong></span>
            <span>{emp.lastName}</span>
            <span>{emp.email}</span>
            <span>{emp.telephone}</span>
            <span>{emp.dui}</span>
            <span>{emp.issNumber}</span>
            <span>{emp.address}</span>
            <span>{emp.hireDate}</span>
            <span>{emp.password}</span> {/* ✅ visible en tabla */}
            <span className="botones">
              <button className="editar" onClick={() => iniciarEdicion(emp)}>Editar</button>
              <button className="eliminar" onClick={() => eliminarEmpleado(emp._id)}>Eliminar</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Empleados;
