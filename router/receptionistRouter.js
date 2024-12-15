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
const {clearDue2,clearDue1,getPatientDues,getReceptionistPatientDues,doReleasePatient,getBedByPID,getReceptionistReleasePatient,admitToBed,getEmptyBeds,getBedStatusFromAppointment,getReceptionistAssignBed,getBloodGroups,addDonor,bloodGiveaway,getBloodBags,getBloodBankCount,getReceptionistBloodGiveaway,getReceptionistAddBlood,getReceptionistBloodBank,getConfirmAppointment ,getCancelAppointment, getAppointments, getReceptionistApproveAppointments, getReceptionistHome} = require('../controller/receptionistController');
const decorateHTMLResponse = require("../middlewares/common-middlewares/decorateHTMLResponse");
const { route } = require('./loginRouter');


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
router.get("/home",decorateHTMLResponse('Home Receptionist'),getReceptionistHome);
router.get("/approveAppointments",decorateHTMLResponse('Approve Appointments'),getReceptionistApproveAppointments);
router.get("/bloodBank",decorateHTMLResponse("Blood Bank"),getReceptionistBloodBank);
router.get("/addBlood",decorateHTMLResponse("Add Blood"),getReceptionistAddBlood);
router.get("/giveaway",decorateHTMLResponse("Blood Giveaway"),getReceptionistBloodGiveaway);
router.get("/assignBed",decorateHTMLResponse("Assign Bed"),getReceptionistAssignBed);
router.get("/releasePatient",decorateHTMLResponse("Release Patient"),getReceptionistReleasePatient);
router.get("/patientDues",decorateHTMLResponse("Patient Dues"),getReceptionistPatientDues);

/*
    GET JSON response
*/
router.get("/getBloodBagCount",getBloodBankCount);
router.get("/getBloodGroups",getBloodGroups);


router.post('/getAppointments',getAppointments);
router.post('/confirmAppointment',getConfirmAppointment);
router.post('/cancelAppointment',getCancelAppointment);
router.post("/getBloodBags",getBloodBags);
router.post("/bloodGiveaway",bloodGiveaway);
router.post("/addDonor",addDonor);
router.post("/getBedStatusFromAppointment",getBedStatusFromAppointment);
router.post("/getEmptyBeds",getEmptyBeds);
router.post("/admitToBed",admitToBed);
router.post("/getBedByPID",getBedByPID);
router.post("/doReleasePatient",doReleasePatient);
router.post("/getPatientDues",getPatientDues);
router.post("/doClearDue1",clearDue1);
router.post("/doClearDue2",clearDue2);



/*
Export
*/
module.exports = router;
