/*
    importing internal dependencies 
*/

const database = require("../database/database");


/*
For Rendering the Home page For Receptionist;
*/
function getReceptionistHome(req, res, next) {
    res.render("receptionistHome");
}

function getReceptionistApproveAppointments(req, res, next) {
    res.render('receptionistApproveAppointments')
}

function getReceptionistBloodBank(req,res,next){
    res.render('receptionistBloodBank');
}

function getReceptionistAddBlood(req,res,next){
    res.render('receptionistAddBlood');
}

function getReceptionistBloodGiveaway(req,res,next){
    res.render('receptionistBloodGiveaway');
}

function getReceptionistAssignBed(req,res,next){
    res.render('receptionistAssignBed.ejs');
}

function getReceptionistReleasePatient(req,res,next){
    res.render('receptionistReleasePatient');
}

function getReceptionistPatientDues(req,res,next){
    res.render('receptionistPatientDues');
}

async function getAppointments(req, res) {
    const sql = `
    SELECT
	APPTID,
	TO_CHAR( APPT_DATE, 'YYYY-MM-DD' ) APPT_DATE,
	APPT_TIME,
	P.FIRST_NAME || ' ' || P.LAST_NAME PATIENT_NAME,
	T2.FIRST_NAME || ' ' || T2.LAST_NAME DOCTOR_NAME,
	WARD_NAME SPECIALITY,
	DONE,
	REMARKS,
	ADVICE,
	ROOM_REQ,
	FEES 
    FROM
	( SELECT * FROM APPOINTMENTS WHERE REID IS NULL ) T1
	JOIN ( SELECT * FROM EMPLOYEES JOIN DOCTORS USING ( EID ) WHERE HID = : HID ) T2 ON T1.DEID = T2.EID
	JOIN PATIENTS P USING ( PID ) 
    WHERE
	APPT_DATE >= TO_DATE( TO_CHAR( SYSDATE, 'YYYY-MM-DD' ), 'YYYY-MM-DD' ) 
    ORDER BY
	APPT_DATE ASC 
    `;
    const binds = {
        HID: req.body.HID
    };
    //console.log(binds.HID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}


async function getConfirmAppointment(req, res) {
    console.log(req.body.APPTID);
    console.log(req.body.REID);
    const sql = `
    UPDATE APPOINTMENTS
    SET REID = :REID
    WHERE APPTID = :APPTID
    `;
    const binds = {
        APPTID: req.body.APPTID,
        REID: req.body.REID
    };
    let result = await database.execute(sql, binds);
    res.json("success");

}

async function getCancelAppointment(req, res) {
    const sql = `
    DELETE FROM APPOINTMENTS
    WHERE APPTID = :APPTID
    `;
    const binds = {
        APPTID: req.body.APPTID
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json("success");
}

async function getBloodBankCount(req,res){
    const sql = `
    SELECT BLOOD_GROUP, COUNT(BAGID) COUNT
    FROM BLOOD_GROUPS
    LEFT JOIN BLOOD_BANK USING(BLOOD_GROUP)
    GROUP BY BLOOD_GROUP
    `;
    const binds = {
        
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}


async function getBloodBags(req,res){
    const sql = `
        SELECT BAGID, BLOOD_GROUP, TO_CHAR(LAST_ADDED, 'DD-MON-YYYY') LAST_ADDED
        FROM BLOOD_BANK
        WHERE BLOOD_GROUP = :BLOOD_GROUP
        ORDER BY LAST_ADDED DESC
    `;
    const binds = {
        BLOOD_GROUP:req.body.BLOOD_GROUP
    };
    console.log(req.body.BLOOD_GROUP);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

async function bloodGiveaway(req,res){
    const sql = `
        DELETE FROM BLOOD_BANK
        WHERE BAGID = :BAGID
    `;
    const binds = {
        BAGID:req.body.BAGID
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    let userObject = {
        success:true
    }
    res.json(userObject);
}


async function addDonor(req,res){
    const sql = `
    INSERT INTO BLOOD_BANK(BAGID, BLOOD_GROUP, LAST_ADDED, HID, EID, DONOR_NAME, DNID) VALUES('BAG_' || BLOOD_BANK_SEQ.NEXTVAL, :BLOOD_GROUP, TO_DATE(TO_CHAR(SYSDATE, 'YYYY-MM-DD'),'YYYY-MM-DD'), :HID, :EID, :DONOR_NAME, :DNID)
    `;
    const binds = {
        DONOR_NAME: req.body.DONOR_NAME,
        DNID: req.body.DNID,
        BLOOD_GROUP: req.body.BLOOD_GROUP,
        HID:req.body.HID,
        EID:req.body.EID
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    let userObject = {
        success:true
    }
    res.json(userObject);
}


async function getBloodGroups(req,res){
    const sql = `
        SELECT BLOOD_GROUP FROM BLOOD_GROUPS
    `;
    const binds = {
        
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

async function getBedStatusFromAppointment(req,res){
    const sql = `
        SELECT 
        PID, 
        P.FIRST_NAME||' '||P.LAST_NAME PATIENT_NAME, 
        GET_AGE(P.DOB) PATIENT_AGE, 
        p.BLOOD_GROUP, 
        APPTID, 
        TO_CHAR(APPT_DATE, 'DD-MON-YYYY') APPT_DATE, 
        APPT_TIME, 
        E.EID DOCTOR_EID, 
        E.FIRST_NAME||' '||E.LAST_NAME DOCTOR_NAME, 
        D.WARD_NAME SPECIALITY, 
        DONE, 
        REMARKS, 
        ADVICE, 
        ROOM_REQ 
        FROM 
        ( 
        SELECT 
        * 
        FROM 
        ( 
        SELECT * 
        FROM APPOINTMENTS 
        WHERE PID = :PID 
        AND DONE = 'Y' 
        ORDER BY APPT_DATE DESC, APPTID DESC 
        FETCH FIRST 1 ROWS ONLY 
        ) T1 
        WHERE ROOM_REQ = 'Y' 
        ) T2 
        JOIN PATIENTS P USING (PID) 
        JOIN EMPLOYEES E ON E.EID = T2.DEID 
        JOIN DOCTORS D ON D.EID = E.EID
    `;
    const binds = {
        PID: req.body.PID
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

async function getEmptyBeds(req,res){
    const sql = `
    SELECT 
    * 
    FROM 
    WARDS_BEDS 
    WHERE WARD_NAME = :SPECIALITY
    AND HID = :HID
    AND PID IS NULL
    `;
    const binds = {
        SPECIALITY:req.body.SPECIALITY,
        HID:req.body.HID
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}


async function admitToBed(req,res){
    const sql = `
        UPDATE WARDS_BEDS
        SET PID = :PID, ADMITTED_DATE = TO_DATE(TO_CHAR(SYSDATE,'YYYY-MM-DD'),'YYYY-MM-DD')
        WHERE BED_NO = :BED_NO
        AND WARD_NAME = :SPECIALITY
        AND HID = :HID
    `;
    const binds = {
        BED_NO:req.body.BED_NO,
        PID:req.body.PID,
        HID:req.body.HID,
        SPECIALITY:req.body.SPECIALITY
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    let userobject = {
        success:true
    }
    res.json(userobject);
}


async function getBedByPID(req,res){
    const sql = `
        SELECT 
        BED_NO,
        TO_CHAR(ADMITTED_DATE, 'DD-MON-YYYY') ADMITTED_DATE,
        PID,
        HID,
        WARD_NAME
        FROM WARDS_BEDS WHERE PID = :PID
    `;
    const binds = {
        PID:req.body.PID
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}


async function doReleasePatient(req,res){
    const sql = `
        UPDATE WARDS_BEDS
        SET ADMITTED_DATE = NULL, PID = NULL
        WHERE PID = :PID
    `;
    const binds = {
        PID:req.body.PID
    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    let userobject = {
        success:true
    }
    res.json(userobject);
}


async function getPatientDues(req,res){
    const sql = `
        SELECT *
        FROM APT_TEST_BILLS_DUE
        WHERE PID = :PID
    `;
    const binds = {
        PID:req.body.PID
    };


    let result = await database.execute(sql, binds);

    const sql2 = `
        SELECT *
        FROM BEDS_BILLS_DUE
        WHERE PID = :PID
    `;
    const binds2 = {
        PID:req.body.PID
    };


    let result2 = await database.execute(sql2, binds2);

    //console.log(result);
    //console.log(result2);
    let newObj = {
        result : result.rows,
        result2 : result2.rows
    };
    res.json(newObj);
}


async function clearDue1(req,res){
    const sql = `
       DELETE FROM APT_TEST_BILLS_DUE
       WHERE BILL_ID = :BILL_ID
    `;
    const binds = {
        BILL_ID:req.body.BILL_ID
    };


    let result = await database.execute(sql, binds);
    //console.log(result);
    let userObject = {
        success:true
    };
    res.json(userObject);
}

async function clearDue2(req,res){
    const sql = `
        DELETE FROM BEDS_BILLS_DUE
        WHERE BILL_ID = :BILL_ID
    `;
    const binds = {
        BILL_ID:req.body.BILL_ID
    };


    let result = await database.execute(sql, binds);
    //console.log(result);
    let userObject = {
        success:true
    };
    res.json(userObject);
}


/*
Export
*/
module.exports = {
    getReceptionistHome,
    getReceptionistApproveAppointments,
    getAppointments,
    getConfirmAppointment,
    getCancelAppointment,
    getReceptionistAddBlood,
    getReceptionistBloodBank,
    getReceptionistBloodGiveaway,
    getBloodBankCount,
    getBloodBags,
    bloodGiveaway,
    addDonor,
    getBloodGroups,
    getReceptionistAssignBed,
    getBedStatusFromAppointment,
    getEmptyBeds,
    admitToBed,
    getReceptionistReleasePatient,
    getBedByPID,
    doReleasePatient,
    getReceptionistPatientDues,
    getPatientDues,
    clearDue1,
    clearDue2
}