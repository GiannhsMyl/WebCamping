import express from "express";
import * as controller from"../controller/controller.mjs"
import * as authController from '../controller/authController.mjs'
import { checkAuth } from '../Middleware/authMiddleware.mjs';
import { rootCertificates } from "tls";

const router=express.Router();

router.get("/",controller.mainPage);

router.get("/reservation",controller.reservationPage);

router.get("/contact",controller.contactPage);
router.post("/new_contact_message",controller.sendContactMessage);


router.get("/connect", checkAuth, controller.login);

router.get("/admin",controller.adminPage);

router.post("/login", authController.handleLogin);      
router.get("/logout", authController.handleLogout);   

router.post("/admin/addZone",controller.addZone);

export {router}