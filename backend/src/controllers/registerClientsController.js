//Importamos todas las librerias
import jsonwebtoken from "jsonwebtoken"; //Genera token
import bcryptjs from "bcryptjs"; //Encripta 
import nodemailer from "nodemailer"; //Envia correo
import crypto from "crypto"; //genera codigo


import clientsModel from "../models/customers.js";
import { config } from "../config.js";
import { error, info } from "console";
import { text } from "stream/consumers";

//Array de funciones 
const registerClientsController = {};

registerClientsController.registerClient = async (req, res) => {

    const { name,
        lastName,
        birthday,
        email,
        password,
        telephone,
        dui,
        isVerified,
    } = req.body;

    try {

        //Varificar si el cliente ya existe
        const existgCLient = await clientsModel.findOne({ email })
        if (existgCLient) {
            return res.json({ message: "client already exist" })
        }

        //Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10)

        //Guarcdamos en la tabla 
        const newClient = new clientsModel({
            name,
            lastName,
            birthday,
            email,
            password: passwordHash,
            telephone,
            dui: dui || null,
            isVerified: isVerified || false
        });

        await newClient.save()

        //generar un codigo de verificacion 
        const verificacionCode = crypto.randomBytes(3).toString("hex")
        const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas 

        //TOKEN 
        const tokenCode = jsonwebtoken.sign({
            //1- ¿que vamos a guardar?
            email, verificacionCode, expiresAt
        },
            //2 secreto 
            config.JWT.secret,
            { expiresIn: config.JWT.expiresIn },
            /* */
            (error, token) => {
                if (error) console.log("error" + error);
                res.cookie("verificationToken" + token, { maxAge: + 2 * 60 * 60 * 1000 })
            }

        )

        //Enviar Correo
        const transporte = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user,
                pass: config.email.pass
            }
        })

        //A quien se lo voy a enviar??

        const mailOptions = {
            from: config.email.user,
            to: email,
            subject: "verificación de correo",
            text: `Confirma que eres dueño de la cuenta, utilizando este codigo ${verificacionCode}\n Este codigo expira en dos horas\n`
        }


        // Envío el correo
        transporte.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error: " + error);
                return res.json({ message: "Error sending email" });
            }
        });

        // Si el correo se envió correctamente
        res.json({ message: "Client registered, please verify your email" });


    } catch (error) {
        console.log("error: " + error);
        res.json({ message: "Error saving Client" });
    }

};

registerClientsController.verifyCodeEmail = async (req, res) => {
    const { verificacionToken } = req.body;
    //Accedemos al token de Verefication toke
    //Ya que este contiene el email el codigo de verificacion y cuando expira 
    const token = req.cookies.verificacionToken;

    if (!token) {
        return res.json({ message: "Please register your account " })
    }

    try {
        /*verificamos y codificar el token para obtener el email y el codigo de verificacion
        que acabamos de guardar el momento de registrar*/
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const { email, verificacionCode: storedCode } = decoded;

        //Comparar el codigo recibido con el alamcenando en el token
        if (verificacionCode !== storedCode) {
            return res.json({ message: "Invalid verification code" })
        }

        //Busco el cliente
        const client = await clientsModel.findOne({ email })
        if (!client) {
            return res.json({ message: "Client not found" })
        }

        //A ese cliente le cambio el campo de "isVerified" a true
        client.isVerified = true,
            await client.save();

        //Quitar el token con el email, codigo verificacion
        res.clearCookie("vereficationToken")

        res.json({ message: "Email verified successfully" })

    } catch (error) {
        res.json({ message: "error" + error })
    }
}

export default registerClientsController; 