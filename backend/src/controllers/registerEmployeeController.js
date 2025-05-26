//importar el modelo
import employeeModel from "../models/employee.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

//creamos un array de funciones 
const registerEmployeeController = {};
registerEmployeeController.register = async (req, res) => {
    const {
        name,
        lastName,
        birthday,
        email,
        address,
        password,
        hireDate,
        telephone,
        dui,
        isVerified,
        issnumber,
    } = req.body;


    try {
        //1- Verificamoa si el empleado ya existe
        const existEmployee = await employeeModel.findOne({ email })
        if (existEmployee) {
            return res.json({ message: "Employee already exist" })
        }

        //2- Encriptar contraseña
        const passwordHash = await bcryptjs.hash(password, 10)

        //3- Guardar todo en la tabla Empleados
        const newEmployee = new employeeModel({

            name,
            lastName,
            birthday,
            email,
            address,
            password: passwordHash,
            hireDate,
            telephone,
            dui,
            isVerified,
            issnumber,

        })

        await newEmployee.save();

        //TOKEN
        jsonwebtoken.sign(
            //1- Que voy a guardar
            { id: newEmployee._id },
            //2- secreto
            config.JWT.secret,
            //3- cuando expira
            { expiresIn: config.JWT.expiresIn },
            //4- funcin flecha
            (error, token) => {
                if (error) console.log("error" + error)

                res.cookie("authToken", token)
                res.json({ message: "empleado guardado" })
            }

        )

    } catch (error) {
        console.log("error" + error)
        res.json({ message: "Error saving employee" })

    }

}


export default registerEmployeeController;
