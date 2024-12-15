/*
Imorting External dependencies
*/
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');


/*
Importing Internal Dependencies
*/
const {getLabName,getDocSpeciality,doRegReceptionist,doRegLabAssistant,doRegDoctor,getRegDoctor,getRegPatient,getRegReceptionist,getRegLabAssistant,doRegPatient} = require('../controller/regcontroller');
const decorateHTMLResponse = require("../middlewares/common-middlewares/decorateHTMLResponse");

/*
Creating a router
*/
const router = express.Router();
router.use(cors());
router.options('*',cors());
router.use(cookieParser(process.env.COOKIE_SECRET));
router.use(express.static(path.join(__dirname,"../public")));     //Setting up static Folders
router.use(express.static(path.join(__dirname,"../public/js"))); 
router.use(express.static(path.join(__dirname,"../public/images"))); 
router.use(express.static(path.join(__dirname,"../public/css")));

/*
Routing Setup
*/
router.get("/regPatient",decorateHTMLResponse('Reg Patient'),getRegPatient);
router.get("/regDoctor",decorateHTMLResponse("Reg Doctor"),getRegDoctor);
router.get("/regReceptionist",decorateHTMLResponse("Reg Receptionist"),getRegReceptionist);
router.get("/regLabAssistant",decorateHTMLResponse("Reg LabAssistant"),getRegLabAssistant);

/*
GET json response
*/
router.get("/getDocSpeciality",getDocSpeciality);
router.get("/getLabName",getLabName);


router.post("/doRegPatient",doRegPatient);
router.post("/doRegDoctor",doRegDoctor);
router.post("/doRegLabAssistant",doRegLabAssistant);
router.post("/doRegReceptionist",doRegReceptionist);


/*
Export
*/
module.exports = router;