const Router = require("express");
const router = new Router();
const {
   authMiddleware,
   authController } = require("./authController");

router.use(authMiddleware);

// создаем пути для аутентификации
router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.post("/check", authController.checkUser);
router.post("/username", authController.profileInfo);
router.post("/update", authController.updateProfileUser);
router.post("/updateBusket", authController.updateBusket);
router.post("/deleteBusket", authController.deleteBusket);
router.post("/deleteItemBusket", authController.deleteItemBusket);
router.post("/basket", authController.basket);
router.post("/sendOrder", authController.acceptBuyBasket);


module.exports = router;
