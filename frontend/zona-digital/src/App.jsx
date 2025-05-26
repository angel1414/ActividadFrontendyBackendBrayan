import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Empleados from "./pages/Empleados";
import Sucursales from "./pages/Sucursales";

// Aquí podrías importar las pantallas CRUD
// import Productos from './pages/Productos'
// import Empleados from './pages/Empleados'
// import Sucursales from './pages/Sucursales'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/sucursales" element={<Sucursales />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
