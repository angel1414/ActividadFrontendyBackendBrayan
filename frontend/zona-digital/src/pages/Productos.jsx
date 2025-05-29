import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudHeader from "../components/CrudHeader";
import CrudList from "../components/CrudList";
import "../styles/Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  const cargarProductos = () => {
    fetch("https://frontend-backend-wr79.onrender.com/api/products", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos recibidos:", data);
        setProductos(data);
      })
      .catch((err) =>
        console.error("Hubo un error al cargar los datos.", err)
      );
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = editandoId
      ? `https://frontend-backend-wr79.onrender.com/api/products/${editandoId}`
      : "https://frontend-backend-wr79.onrender.com/api/products";

    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setForm({ name: "", description: "", price: "", stock: "" });
      setEditandoId(null);
      cargarProductos();
    } else {
      alert(data.message || "Error al guardar producto");
    }
  };

  const eliminarProducto = async (id) => {
    await fetch(`https://frontend-backend-wr79.onrender.com/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    cargarProductos();
  };

  const iniciarEdicion = (prod) => {
    setForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
    });
    setEditandoId(prod._id);
  };

  return (
    <div className="crud-container">
      <div className="top-bar">
        <CrudHeader title="Administrar productos" />
        <button className="volver-home" onClick={() => navigate("/home")}>
          ← Volver al inicio
        </button>
      </div>

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
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {editandoId ? "Actualizar producto" : "Agregar producto"}
        </button>
      </div>

      <div className="tabla-productos">
        <div className="encabezado">
          <span>Nombre</span>
          <span>Descripción</span>
          <span>Precio</span>
          <span>Stock</span>
          <span>Acciones</span>
        </div>

        <CrudList
          items={productos}
          renderItem={(prod) => (
            <div className="fila" key={prod._id}>
              <span>
                <strong>{prod.name}</strong>
              </span>
              <span>{prod.description}</span>
              <span>${prod.price}</span>
              <span>{prod.stock}</span>
              <span className="botones">
                <button
                  className="editar"
                  onClick={() => iniciarEdicion(prod)}
                >
                  Editar
                </button>
                <button
                  className="eliminar"
                  onClick={() => eliminarProducto(prod._id)}
                >
                  Eliminar
                </button>
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Productos;
