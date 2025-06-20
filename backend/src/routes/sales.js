import express from "express";
import salesController from "../controllers/salesController.js"

const router = express.Router();

router.route("/")
  .post(salesController.insertSales)
  .get(salesController.getSales); 

router.route("/category").get(salesController.salesByCategory)
router.route("/best-products").get(salesController.bestSellingProducts)
router.route("/frequent-customer").get(salesController.frecuentCustomer)
router.route("/total-earnings").get(salesController.totalEarnings)

export default router;