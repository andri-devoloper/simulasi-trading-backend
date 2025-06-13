const express = require("express");
const router = express.Router();
const controller = require("../controllers/strategyController");

router.post("/config", controller.saveConfig);
router.get("/config", controller.getConfig);
router.post("/webhook", controller.receiveWebhook);
router.get("/orders", controller.getOrders);
router.post("/final", controller.FinalConfig);

module.exports = router;
