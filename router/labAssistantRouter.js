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
const {getUploadTestResult,getSingleTest,getGiveTestResult,getTests,getLabAssistantEditTests,getLabAssistantHome,getLabAssistantUpcomingTests}  = require('../controller/labAssistantController');
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
router.get('/home',decorateHTMLResponse('Lab Assistant Home'),getLabAssistantHome);
router.get('/upcomingTests',decorateHTMLResponse('Upcoming Tests'),getLabAssistantUpcomingTests);
router.get('/editTests',decorateHTMLResponse('Edit Tests'), getLabAssistantEditTests);
router.get('/giveTestResult',decorateHTMLResponse('Test Result'),getGiveTestResult);

router.post('/getTests',getTests);
router.post('/getSingleTest',getSingleTest);
router.post('/uploadTestResult',getUploadTestResult);


/*
Export
*/
module.exports = router;