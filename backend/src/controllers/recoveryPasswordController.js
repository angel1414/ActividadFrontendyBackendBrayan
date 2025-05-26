import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";

import clientsModel from "../models/customers.js";
import employee from "../models/employee.js";

import { sendEmail, HTMLRecoveryEmail } from "../utils/mailPasswordRecovery.js";
import { config } from "../config.js";
import { verify } from "crypto";

// 1- Crear un array de funciones
const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
    const { email } = req.body;

    try {
        let userFound;
        let userType;

        userFound = await clientsModel.findOne({ email });
        if (userFound) {
            userType = "client";
        } else {
            userFound = await employee.findOne({ email });
            if (userFound) {
                userType = "employee";
            }
        }

        if (!userFound) {
            return res.json({ message: "user not found" });
        }

        // Genera un código aleatorio
        const code = Math.floor(10000 + Math.random() * 90000).toString();

        // Guardamos todo en un token
        const token = jsonwebtoken.sign(
            { email, code, userType, verify: false },
            config.JWT.secret,
            { expiresIn: "20m" } // Cambiado para que expire en 20 minutos
        );

        res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

        // Último paso: enviar correo con el código
        await sendEmail(
            email,
            "Your verification code", // Asunto
            "Hi, remember not to forget your password", // Cuerpo
            HTMLRecoveryEmail(code) // HTML
        );

        res.json({message: "email sent"});

    } catch (error) {
        console.log("error: " + error);
    }
};

//Funcion para verificar codigo 
passwordRecoveryController.verifyCode = async (req, res)=>{
    const {code} = req.body;
    try{
        //sacar el otken de las cookies
        const token = req.cookies.tokenRecoveryCode

        //Extraer la información del token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if(decoded.code !== code){
            return res.json({message: "invalid code"})
        }

        //marcar el token como verificado
        const newToken = jsonwebtoken.sign(
            //1-que vamos a guardar
            {email: decoded.email,
             code: decoded.code,
             userType: decoded.userType,
             verified:true
            },
            //2-secret key
            config.JWT.secret,
            //3-cuando expira
            {expireIn: "20m"}
        )

        res.cookie("tokenRecoveryCode", newToken, {maxAge:20*60*1000})

        res.json({message: "code verified successfully"});
    }catch (error){
        console.log("error" + error);

    }
};

//funcion para asignar la nueva contraseña
passwordRecoveryController.newPassword = async (req, res) => {
    const { newPassword } = req.body;

    try{

        //extraer el token de las cookies;
        const token = req.cookies.tokenRecoveryCode;

        //extraer la información del token
        const decoded =  jsonwebtoken.verify(token, config.JWT.secret)

        //comprobar si el codigo es verificado
        if(!decoded.verified){
            return res.json({message: "code not verified"})
        }

        //extraer el email y el userType del token
        const {email, userType} =  decoded;

        // Encriptar la contraseña
        const hashPassword = await bcryptjs.hash(newPassword, 10)

        //Actualizar la contraseña del usuario en la base de datos
        let updatedUser;

        if (userType === "client"){
            updatedUser = await clientsModel.findOneAndUpdate (
                { email },
                { password: hashedPassword },
                { new: true }
            )
        }else if(userType === "employee") {
            updatedUser = await employeeModel.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            )
        }

        //quitamos el token
        res.clearCookies("tokenRecoveryCode")

        res.json({message: "Password updated"});

    }catch (error){
        console.log("error" + error);

    }
}

export default passwordRecoveryController