import employeeModel from "../models/employee.js";

const employeeController = {};

// SELECT
employeeController.getemployee = async (req, res) => {
  try {
    const employees = await employeeModel.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", error });
  }
};

// INSERT
employeeController.createemployee = async (req, res) => {
  try {
    const {
      name, lastName, birthday, email, password,
      telephone, dui, issNumber, hireDate, address, isVerified
    } = req.body;

    const newEmployee = new employeeModel({
      name,
      lastName,
      birthday,
      email,
      password, // 👈 ya no se cifra
      telephone,
      dui,
      issNumber,
      hireDate,
      address,
      isVerified
    });

    await newEmployee.save();
    res.json({ message: "Empleado guardado" });

  } catch (error) {
    res.status(500).json({ message: "Error al crear empleado", error });
  }
};

// DELETE
employeeController.deleteemployee = async (req, res) => {
  try {
    const deleted = await employeeModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    res.json({ message: "Empleado eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empleado", error });
  }
};

// UPDATE
employeeController.updateemployee = async (req, res) => {
  try {
    const {
      name, lastName, birthday, email, password,
      telephone, dui, issNumber, hireDate, address, isVerified
    } = req.body;

    const updateData = {
      name,
      lastName,
      birthday,
      email,
      password, // 👈 también sin cifrado
      telephone,
      dui,
      issNumber,
      hireDate,
      address,
      isVerified
    };

    await employeeModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ message: "Empleado actualizado" });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar empleado", error });
  }
};

export default employeeController;
