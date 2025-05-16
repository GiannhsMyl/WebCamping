import express from "express";
import * as controller from"../controller/controller.mjs"
import { rootCertificates } from "tls";


const router=express.Router();

router.get("/",controller.mainPage);

router.get("/contact",controller.contactPage);
router.post("/new_contact_message",controller.sendContactMessage);

router.get("/reservation",controller.reservationPage);

router.get("/connect",controller.login);

router.get("/admin",controller.adminPage);
router.post("/admin/addZone",controller.addZone);
export {router}