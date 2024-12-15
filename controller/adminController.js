/*
    importing internal dependencies 
*/
const database = require("../database/database");


function getAdminHome(req,res,next){
    res.render('adminHome');
}

function getAdminApproveDoctor(req,res,next){
    res.render('adminApproveDoctor');
}

function getAdminApproveReceptionist(req,res,next){
    res.render('adminApproveReceptionist');
}

function getAdminApproveLabAssistant(req,res,next){
    res.render('adminApproveLabAssistant');
}

async function getUnDoctors(req,res){
    const sql = `
        SELECT
        *
        FROM
        UV_EMPLOYEES
        JOIN UV_DOCTORS USING (EID)
    `;

    const binds = {
    }
    //console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}

async function getUnDoctorSingle(req,res){
    const sql = `
    SELECT EID, FIRST_NAME || ' ' || LAST_NAME DOCTOR_NAME, GENDER, ADDRESS, GET_AGE(DOB) AGE, BLOOD_GROUP, PHONE, EMAIL, GET_UV_DOC_DEGREES(EID) DEGREES, GET_UV_DOC_VIS_TIMES(EID) VIS_TIMES, FEES, WARD_NAME SPECIALITY
    FROM UV_EMPLOYEES
    JOIN UV_DOCTORS USING(EID)
    WHERE EID = :DID
    `;

    const binds = {
        DID:req.body.DID
    }
    //console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}


async function doDoctorApprove(req,res){
    const sql = `
    INSERT INTO EMPLOYEES
    SELECT *
    FROM
    (SELECT E.EID, E.FIRST_NAME, E.LAST_NAME, E.GENDER, E.ADDRESS, E.DOB, E.BLOOD_GROUP, E.PHONE, E.EMAIL, E.PASSWORD, AID, 'HOS1' HID 
    FROM UV_EMPLOYEES E, ADMIN A
    WHERE EID = :DID
    AND AID = :AID) T1
    `;

    const binds = {
        DID:req.body.DID,
        AID:req.body.AID
    }
    //console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    console.log(result);

    const sql1 = `
        DELETE FROM UV_EMPLOYEES
        WHERE EID = :DID
    `;

    const binds1 = {
        DID:req.body.DID
    }
    //console.log(req.body.PID);
    let result1 = await database.execute(sql1, binds1);
    //console.log(result1);


    res.json("success");
}


async function getUnLabAssistant(req,res){
    const sql = `
        SELECT
        *
        FROM
        UV_EMPLOYEES
        JOIN UV_LAB_ASSISTANTS USING (EID)
    `;

    const binds = {
    }
    //console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    console.log(result);
    res.json(result.rows);
}

async function getUnLabAssistantSingle(req,res){
    const sql = `
    SELECT EID, FIRST_NAME || ' ' || LAST_NAME LAB_ASSISTANT_NAME, GENDER, ADDRESS, GET_AGE(DOB) AGE, BLOOD_GROUP, PHONE, EMAIL, LABNAME
    FROM UV_EMPLOYEES
    JOIN UV_LAB_ASSISTANTS USING(EID)
    WHERE EID = :LID
    `;

    const binds = {
        LID:req.body.LID
    }
    console.log(binds.LID);
    //console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    console.log(result);
    res.json(result.rows);
}


async function doLabAssistantApprove(req,res){
    const sql = `
    INSERT INTO EMPLOYEES
    SELECT *
    FROM
    (SELECT E.EID, E.FIRST_NAME, E.LAST_NAME, E.GENDER, E.ADDRESS, E.DOB, E.BLOOD_GROUP, E.PHONE, E.EMAIL, E.PASSWORD, AID, 'HOS1' HID 
    FROM UV_EMPLOYEES E, ADMIN A
    WHERE EID = :LID
    AND AID = :AID) T1
    `;

    const binds = {
        LID:req.body.LID,
        AID:req.body.AID
    }
    //console.log(req.body.PID);
    let result = await database.execute(sql, binds);
    console.log(result);

    const sql1 = `
    DELETE FROM UV_EMPLOYEES
    WHERE EID = :LID
    `;

    const binds1 = {
        LID:req.body.LID
    }
    //console.log(req.body.PID);
    let result1 = await database.execute(sql1, binds1);
    console.log(result1);


    res.json("success");
}


/*
Export
*/
module.exports = {
    getAdminHome,
    getAdminApproveDoctor,
    getAdminApproveReceptionist,
    getAdminApproveLabAssistant,
    getUnDoctors,
    getUnDoctorSingle,
    doDoctorApprove,
    getUnLabAssistant,
    getUnLabAssistantSingle,
    doLabAssistantApprove
}