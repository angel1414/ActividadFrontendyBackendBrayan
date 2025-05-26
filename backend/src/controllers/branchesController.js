import branchesModel from "../models/branches.js";

const branchesController = {};

// SELECT
branchesController.getbranches = async (req, res) => {
  const branches = await branchesModel.find();
  res.json(branches);
};

// INSERT
branchesController.createbranches = async (req, res) => {
  const { name, address, birthday, schedule, telephone } = req.body;

  try {
    const newBranch = new branchesModel({
      name,
      address,
      birthday,
      schedule,
      telephone,
    });

    await newBranch.save();
    res.json({ message: "Sucursal guardada correctamente" });
  } catch (error) {
    console.error("Error al guardar sucursal:", error);
    res.status(500).json({ message: "Error al guardar sucursal" });
  }
};

// DELETE
branchesController.deletebranches = async (req, res) => {
  const deleted = await branchesModel.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Sucursal no encontrada" });
  }
  res.json({ message: "Sucursal eliminada" });
};

// UPDATE
branchesController.updatebranches = async (req, res) => {
  const { name, address, birthday, schedule, telephone } = req.body;

  await branchesModel.findByIdAndUpdate(
    req.params.id,
    { name, address, birthday, schedule, telephone },
    { new: true }
  );

  res.json({ message: "Sucursal actualizada" });
};

export default branchesController;
