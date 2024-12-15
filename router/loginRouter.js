
/*
Imorting External dependencies
*/
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');



/*
Importing Internal Dependencies
*/
const {getLoginAll,getLoginDoctor,getLoginLabAssistant,getLoginReceiptionist, getLoginPatient,getLoginAdmin,doLoginPatient,doLoginAdmin,doLoginDoctor,doLoginReceptionist,doLoginLabAssistant} = require('../controller/logincontroller');
const decorateHTMLResponse = require("../middlewares/common-middlewares/decorateHTMLResponse");


/*
Creating a router
*/
const router = express.Router();
router.use(cors());
router.options('*',cors());
router.use(cookieParser(process.env.COOKIE_SECRET)); 

/*
Routing Setup
*/
router.get("/",decorateHTMLResponse('Login'),getLoginAll);
router.get("/loginAdmin",decorateHTMLResponse('Login Admin'),getLoginAdmin);
router.get("/loginPatient",decorateHTMLResponse('Login Patient'),getLoginPatient);
router.get("/loginDoctor",decorateHTMLResponse('Login Doctor'),getLoginDoctor);
router.get("/loginReceiptionist",decorateHTMLResponse('Login Nurse'),getLoginReceiptionist);
router.get("/loginLabAssistant",decorateHTMLResponse('Login LabAssistant'),getLoginLabAssistant);
router.post("/doLoginPatient",doLoginPatient);
router.post("/doLoginDoctor",doLoginDoctor);
router.post("/doLoginReceptionist",doLoginReceptionist);
router.post("/doLoginLabAssistant",doLoginLabAssistant);
router.post("/doLoginAdmin",doLoginAdmin);

/*
Export
*/
module.exports = router;
