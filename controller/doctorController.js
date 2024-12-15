/*
    importing internal dependencies 
*/

const database = require("../database/database");


function getDoctorHome(req, res, next) {
    res.render('doctorHome');
}

function getDoctorPatientHistory(req, res, next) {
    res.render('doctorPatientHistory');
}

function getDoctorEditPrescription(req, res, next) {
    res.render('doctorEditPrescription');
}

function getUpcomingAppointments(req, res, next) {
    res.render('doctorUpAppointments');
}

function getDoctorTestResults(req, res, next) {
    res.render('doctorTestResults');
}

function getDoctorGivePrescription(req, res, next) {
    res.render('doctorGivePrescription');
}

function getDoctorPatientPrescription(req, res, next) {
    res.render('doctorPatientPrescription');
}

function getDoctorSingleTestResult(req, res, next) {
    res.render('doctorSingleTestResult');
}

async function getTestNames(req, res) {
    const sql = `
    SELECT TEST_NAME
    FROM TESTS
    `;
    const binds = {
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

async function uploadPrescription(req, res) {
    let sql = `
    UPDATE APPOINTMENTS
    SET DONE = 'Y',
    REMARKS = $1,
    ADVICE = $2,
    ROOM_REQ = $3
    WHERE APPTID = $4`;
    let binds = {
        APPTID: req.body.APPTID,
        REMARKS: req.body.REMARKS,
        ADVICE: req.body.ADVICE,
        ROOM_REQ: req.body.BED
    }
    let result = await database.execute(sql, binds);
    console.log(result);
    let testArr = req.body.TESTARR;
    console.log(testArr);
    for (let i = 0; i < testArr.length; i++) {
        sql = `INSERT INTO APPT_TESTS(APPTID, TEST_NAME) VALUES($1, $2)`;
        let binds2 = {
            APPTID: req.body.APPTID,
            TEST_NAME: testArr[i]
        }
        result = await database.execute(sql, binds2);
        //console.log(result);
    }

    sql = `INSERT INTO APPT_MEDS(APPTID, MEDNAME) VALUES($1, $2)`;
    let binds3 = {
        APPTID: req.body.APPTID,
        MEDNAME: req.body.MEDICINES
    }
    result = await database.execute(sql, binds3);
    //console.log(result);
    res.json("success");
}

async function getAppointments(req, res) {
    const sql = `
    SELECT APPTID, APPT_TIME, TO_CHAR(APPT_DATE,'YYYY-MM-DD') AS APPT_DATE, PID, P.FIRST_NAME || ' ' || P.LAST_NAME AS PATIENT_NAME, P.PHONE, GET_AGE(P.DOB) AS AGE, P.BLOOD_GROUP 
    FROM 
    (SELECT * 
    FROM APPOINTMENTS 
    WHERE 
    DEID = $1 
    AND REID IS NOT NULL 
    AND DONE = 'N' 
    AND APPT_DATE = CURRENT_DATE
    ) T1 
    JOIN  
    PATIENTS P USING (PID)
    ORDER BY APPTID ASC
    `;
    const binds = {
        EID: req.body.EID
    };
    //console.log(binds.EID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

async function getSingleAppointment(req, res) {
    const sql = `
    SELECT APPTID, APPT_TIME, TO_CHAR(APPT_DATE,'YYYY-MM-DD') AS APPT_DATE, PID, P.FIRST_NAME || ' ' || P.LAST_NAME AS PATIENT_NAME, P.PHONE, GET_AGE(P.DOB) AS AGE, P.BLOOD_GROUP, DONE, REMARKS, ADVICE, ROOM_REQ 
    FROM 
    (SELECT * 
    FROM APPOINTMENTS 
    WHERE 
    APPTID = $1) T1 
    JOIN  
    PATIENTS P USING (PID)
    `;
    const binds = {
        APPTID: req.body.APPTID
    };
    //console.log(binds.APPTID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}


async function getAppointmentHistory(req, res) {
    const sql = `
    SELECT DISTINCT
	APPTID,
	TO_CHAR( APPT_DATE, 'DD-MON-YYYY' ) APPT_DATE,
	APPT_TIME,
	FIRST_NAME || ' ' || LAST_NAME DOCTOR_NAME,
	WARD_NAME SPECIALITY,
	GET_DOC_DEGREES ( DEID ) DEGREES,
	ADVICE,
	REMARKS,
	ROOM_REQ,
	HOSPITAL_NAME,
	BRANCH 
    FROM
	( SELECT * FROM APPOINTMENTS WHERE PID = : PID AND REID IS NOT NULL AND DONE = 'Y'  ) T1
	JOIN EMPLOYEES ON ( EID = DEID )
	JOIN DOCTORS USING ( EID )
	JOIN DOC_DEGREES USING ( EID )
	JOIN HOSPITALS USING ( HID )
    ORDER BY APPT_DATE DESC, APPTID DESC
    `;

    const binds = {
        PID: req.body.PID
    }
    //console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

// need to handle medname fetch [easy fix remove foreign key constraint from appt_meds i guess]
async function getSinglePrescription(req, res) {
    const sql = `
    SELECT DISTINCT
	APPTID,
	TO_CHAR( APPT_DATE, 'DD-MON-YYYY' ) APPT_DATE,
	APPT_TIME,
	E.FIRST_NAME || ' ' || E.LAST_NAME DOCTOR_NAME,
	WARD_NAME SPECIALITY,
	GET_DOC_DEGREES ( DEID ) DEGREES,
	FEES,
	E.PHONE DOCTOR_PHONE,
	E.EMAIL DOCTOR_EMAIL,
	P.FIRST_NAME || ' ' || P.LAST_NAME PATIENT_NAME,
	GET_AGE ( P.DOB ) PATIENT_AGE,
	P.BLOOD_GROUP,
	P.PHONE PATIENT_PHONE,
	GET_TEST_NAMES ( APPTID ) TEST_NAMES,
	MEDNAME,
	REMARKS,
	ADVICE,
	ROOM_REQ,
	HOSPITAL_NAME,
	BRANCH,
	H.PHONE HOSPITAL_PHONE,
	H.EMAIL HOSPITAL_EMAIL 
    FROM
	( SELECT * FROM APPOINTMENTS WHERE APPTID = :APPT_ID ) T1
	JOIN PATIENTS P USING ( PID )
	JOIN APPT_MEDS USING ( APPTID )
	JOIN EMPLOYEES E ON ( EID = DEID )
	JOIN DOCTORS D USING ( EID )
	JOIN DOC_DEGREES DD USING ( EID )
	JOIN HOSPITALS H USING ( HID )
    `;
    const binds = {
        APPT_ID: req.body.APPT_ID
    }
    //console.log(req.body.APPT_ID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

// join LABORATORIES USING Labid???? need to fix => labid -> labname i hope it fixes
async function getTestResults(req, res) {
    const sql = `
    SELECT DISTINCT
	TEST_NAME,
	TO_CHAR( TEST_DATE, 'DD-MON-YYYY' ) TEST_DATE,
	RESULTS,
	LABNAME,
	FIRST_NAME || ' ' || LAST_NAME LAB_ASST_NAME,
	HOSPITAL_NAME,
	BRANCH,
	H.PHONE HOSPITAL_PHONE,
	APPTID,
	TO_CHAR( APPT_DATE, 'DD-MON-YYYY' ) APPT_DATE,
	APPT_TIME 
    FROM
	( SELECT APPTID, APPT_DATE, APPT_TIME FROM APPOINTMENTS WHERE PID = : PID ) T1
	JOIN TEST_RESULTS USING ( APPTID )
	JOIN LAB_ASSISTANTS USING ( EID )
	JOIN EMPLOYEES USING ( EID )
	JOIN HOSPITALS H USING ( HID )
	JOIN LABORATORIES USING ( LABNAME ) 
    ORDER BY
	TEST_DATE DESC,
	APPTID DESC
    `;
    const binds = {
        PID: req.body.PID
    }

    // console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

// join LABORATORIES USING Labid???? need to fix => labid -> labname i hope it fixes
async function getSingleTestResult(req, res) {
    const sql = `
    SELECT DISTINCT
	HOSPITAL_NAME,
	BRANCH,
	H.PHONE HOSPITAL_PHONE,
	TEST_NAME,
	TO_CHAR( TEST_DATE, 'DD-MON-YYYY' ) TEST_DATE,
	RESULTS,
	LABNAME,
	E.FIRST_NAME || ' ' || E.LAST_NAME LAB_ASST_NAME,
	P.FIRST_NAME || ' ' || P.LAST_NAME PATIENT_NAME,
	GET_AGE ( P.DOB ) AGE,
	P.BLOOD_GROUP,
	P.PHONE,
	APPTID,
	TO_CHAR( APPT_DATE, 'DD-MON-YYYY' ) APPT_DATE,
	APPT_TIME 
    FROM
	( SELECT * FROM TEST_RESULTS WHERE APPTID = : APPT_ID AND TEST_NAME = : TEST_NAME ) T1
	JOIN APPOINTMENTS A USING ( APPTID )
	JOIN PATIENTS P USING ( PID )
	JOIN EMPLOYEES E USING ( EID )
	JOIN HOSPITALS H USING ( HID )
	JOIN LAB_ASSISTANTS LA USING ( EID )
	JOIN LABORATORIES L USING ( LABNAME )
    `;
    const binds = {
        APPT_ID: req.body.APPT_ID,
        TEST_NAME: req.body.TEST_NAME
    }
    //console.log(req.body.APPT_ID);
    //console.log(req.body.TEST_NAME);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

async function getMedNames(req,res){
    const sql = `
        SELECT MEDNAME FROM DISPENSARY
    `;
    const binds = {
   
    }

    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

/*
Export
*/
module.exports = {
    getDoctorHome,
    getDoctorPatientHistory,
    getDoctorEditPrescription,
    getUpcomingAppointments,
    getDoctorTestResults,
    getAppointments,
    getDoctorGivePrescription,
    getSingleAppointment,
    getTestNames,
    uploadPrescription,
    getAppointmentHistory,
    getDoctorPatientPrescription,
    getSinglePrescription,
    getTestResults,
    getSingleTestResult,
    getDoctorSingleTestResult,
    getMedNames
}