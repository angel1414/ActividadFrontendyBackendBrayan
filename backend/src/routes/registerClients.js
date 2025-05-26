import express from "express"
import registerClientsController from "../controllers/registerClientsController.js"
const router = express.Router()

//Es como decir /api/registerClients
router.route("/").post(registerClientsController.registerClient)

//Es como decir /api/registerClients/verifyCodeEmail
router.route("/verifyCodeEmail").post(registerClientsController.verifyCodeEmail)

export default router


