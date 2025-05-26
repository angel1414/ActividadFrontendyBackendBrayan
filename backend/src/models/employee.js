import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    birthday: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    hireDate: {
      type: String,
    },
    telephone: {
      type: String,
      required: true,
    },
    dui: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
    },
    issNumber: { // <--- corregido aquí
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("employee", employeeSchema);
