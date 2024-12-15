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
const {getDues,dues,getSpeciality,getAmbulances,getAmbulanceType,getBranch,getSingleTestResult,getTestResultHistory,getSinglePrescription,getAppointmentHistory,getPatientTestResult,getPrescription,getUpcomingAppointments,getBookAppointment,getDoctorConfirm, getPatientHome,getPatientAppointments,getPatientAppointmentsHistory,getPatientHireAmbulance,getPatientHireNurse,getPatientTest,getPatientUpcomingAppointments,getDoctor,getPatientAppointmentConfirm} = require('../controller/patientController');
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
router.get("/home",decorateHTMLResponse('Home Patient'),getPatientHome);
router.get("/appointments",decorateHTMLResponse('Book Appointments'),getPatientAppointments);
router.get("/appointmentsHistory",decorateHTMLResponse("Appointments History"),getPatientAppointmentsHistory);
router.get("/ambulance",decorateHTMLResponse("Hire Ambulance"),getPatientHireAmbulance);
router.get("/nurse",decorateHTMLResponse("Hire Nurse"),getPatientHireNurse);
router.get("/test",decorateHTMLResponse("Test Results"),getPatientTest);
router.get("/upcomingAppointments",decorateHTMLResponse("Upcoming Appointments"),getPatientUpcomingAppointments);
router.get("/confirmAppointment",decorateHTMLResponse('Confirm Appointment'), getPatientAppointmentConfirm);
router.get('/prescription',decorateHTMLResponse('Prescription'),getPrescription);
router.get("/testResult",decorateHTMLResponse('Test Result'),getPatientTestResult);
router.get("/dues",decorateHTMLResponse("Dues"),dues);

/*
    GET JSON response
*/
router.get('/getBranch',getBranch);
router.get('/getAmbulanceType',getAmbulanceType);
router.get('/getSpeciality',getSpeciality);


router.post("/getDoctor",getDoctor);
router.post("/getDoctorConfirm", getDoctorConfirm);
router.post("/bookAppointment",getBookAppointment);
router.post("/getUpcomingAppointments",getUpcomingAppointments);
router.post("/getAppointmentHistory",getAppointmentHistory);
router.post("/getPrescription",getSinglePrescription);
router.post("/getTestResultHistory",getTestResultHistory);
router.post("/getTestResult",getSingleTestResult);
router.post("/getAmbulances",getAmbulances);
router.post("/getDues",getDues);





/*
Export
*/
module.exports = router;