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
const decorateHTMLResponse = require("../middlewares/common-middlewares/decorateHTMLResponse");
const {getMedNames,getDoctorSingleTestResult,getSingleTestResult,getTestResults,getSinglePrescription,getDoctorPatientPrescription,getAppointmentHistory,uploadPrescription,getTestNames,getSingleAppointment,getDoctorGivePrescription,getAppointments,getDoctorHome,getDoctorPatientHistory,getDoctorEditPrescription,getUpcomingAppointments,getDoctorTestResults} = require('../controller/doctorController');


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
// router.get("/home",decorateHTMLResponse('Home Doctor'),getDoctorHome);
router.get('/home',decorateHTMLResponse('Doctor Home'),getDoctorHome);
router.get('/patientHistory',decorateHTMLResponse('Patient History'),getDoctorPatientHistory);
router.get('/editPrescription',decorateHTMLResponse('edit prescription'),getDoctorEditPrescription);
router.get('/upcomingAppointments',decorateHTMLResponse('Upcoming Appointments'),getUpcomingAppointments);
router.get('/testResults',decorateHTMLResponse('Test Results'),getDoctorTestResults);
router.get('/givePrescription',decorateHTMLResponse('Give Prescription'),getDoctorGivePrescription);
router.get('/patientPrescription',decorateHTMLResponse('Prescription'),getDoctorPatientPrescription);
router.get('/singleTestResult',decorateHTMLResponse('Test Result'),getDoctorSingleTestResult);


/*
GET JSON response
*/
router.get("/getMedNames",getMedNames);

router.post('/getAppointments',getAppointments);
router.post('/getSingleAppointment',getSingleAppointment);
router.post('/testNames',getTestNames);
router.post('/uploadPrescription',uploadPrescription);
router.post('/getAppointmentHistory',getAppointmentHistory);
router.post('/getSinglePrescription',getSinglePrescription);
router.post('/getTestResults',getTestResults);
router.post('/getSingleTestResult',getSingleTestResult);





/*
Export
*/
module.exports = router;