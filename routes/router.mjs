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

router.use("/admin",authController.checkAuth)
router.get("/admin",controller.adminPage);

router.post("/login", authController.handleLogin);      
router.get("/logout", authController.handleLogout);   

router.post("/admin/addZone",controller.addZone);
router.post("/admin/editZone",controller.editZone);

router.post("/admin/getZones",controller.getAllZones);
router.post("/admin/getReservations",controller.getAllReservations);

router.get("/admin/delete/:zone",controller.deleteZone);

router.post("/admin/editReservations",controller.editReservations);
router.get("/admin/deleteReservation/:reservation",controller.deleteReservation);

router.use((err,req,res,next)=>{
    res.render("error",{css : ["main_style.css","adminCustomerPage.css"],title:"error",message:err.message,errtrace:err.stack});
});
export {router}