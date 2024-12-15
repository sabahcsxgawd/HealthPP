/*
    importing internal dependencies 
*/
const database = require("../database/database");


function getAdminHome(req, res, next) {
    res.render('adminHome');
}

function getAdminApproveDoctor(req, res, next) {
    res.render('adminApproveDoctor');
}

function getAdminApproveReceptionist(req, res, next) {
    res.render('adminApproveReceptionist');
}

function getAdminApproveLabAssistant(req, res, next) {
    res.render('adminApproveLabAssistant');
}

async function getUnDoctors(req, res) {
    const sql = `
        SELECT
        *
        FROM
        UV_EMPLOYEES
        JOIN UV_DOCTORS USING (EID)
    `;

    const binds = {
    }

    let result = await database.execute(sql, binds);
    
    res.json(result.rows);
}

async function getUnDoctorSingle(req, res) {
    const sql = `
    SELECT EID, 
       FIRST_NAME || ' ' || LAST_NAME AS DOCTOR_NAME, 
       GENDER, 
       ADDRESS, 
       GET_AGE(DOB) AS AGE, 
       BLOOD_GROUP, 
       PHONE, 
       EMAIL, 
       GET_UV_DOC_DEGREES(EID) AS DEGREES, 
       GET_UV_DOC_VIS_TIMES(EID) AS VIS_TIMES, 
       FEES, 
       WARD_NAME AS SPECIALITY
    FROM UV_EMPLOYEES
    JOIN UV_DOCTORS USING (EID)
    WHERE EID = $1;

    `;

    const binds = {
        DID: req.body.DID
    }

    let result = await database.execute(sql, binds);

    res.json(result.rows);
}


async function doDoctorApprove(req, res) {
    const sql = `
    INSERT INTO EMPLOYEES
    SELECT *
    FROM (
        SELECT 
            E.EID, 
            E.FIRST_NAME, 
            E.LAST_NAME, 
            E.GENDER, 
            E.ADDRESS, 
            E.DOB, 
            E.BLOOD_GROUP, 
            E.PHONE, 
            E.EMAIL, 
            E.PASSWORD, 
            A.AID, 
            'HOS1' AS HID
        FROM UV_EMPLOYEES E, ADMIN A
        WHERE E.EID = $1
        AND A.AID = $2
    ) AS T1;

    `;

    const binds = {
        DID: req.body.DID,
        AID: req.body.AID
    }

    let result = await database.execute(sql, binds);

    const sql1 = `
        DELETE FROM UV_EMPLOYEES
        WHERE EID = $1
    `;

    const binds1 = {
        DID: req.body.DID
    }

    let result1 = await database.execute(sql1, binds1);

    res.json("success");
}


async function getUnLabAssistant(req, res) {
    const sql = `
        SELECT
        *
        FROM
        UV_EMPLOYEES
        JOIN UV_LAB_ASSISTANTS USING (EID)
    `;

    const binds = {
    }

    let result = await database.execute(sql, binds);

    res.json(result.rows);
}

async function getUnLabAssistantSingle(req, res) {
    const sql = `
    SELECT 
        EID, 
        FIRST_NAME || ' ' || LAST_NAME AS LAB_ASSISTANT_NAME, 
        GENDER, 
        ADDRESS, 
        GET_AGE(DOB) AS AGE, 
        BLOOD_GROUP, 
        PHONE, 
        EMAIL, 
        LABNAME
    FROM UV_EMPLOYEES
    JOIN UV_LAB_ASSISTANTS USING (EID)
    WHERE EID = $1;

    `;

    const binds = {
        LID: req.body.LID
    }


    let result = await database.execute(sql, binds);

    res.json(result.rows);
}


async function doLabAssistantApprove(req, res) {
    const sql = `
        INSERT INTO EMPLOYEES
        SELECT
            E.eid,
            E.first_name,
            E.last_name,
            E.gender,
            E.address,
            E.dob,
            E.blood_group,
            E.phone,
            E.email,
            E.password,
            A.aid,
            'HOS1' AS hid
        FROM UV_EMPLOYEES E, ADMIN A
        WHERE E.eid = $1
        AND A.aid = $2;
    `;

    const binds = {
        LID: req.body.LID,
        AID: req.body.AID
    }

    let result = await database.execute(sql, binds);

    const sql1 = `
    DELETE FROM UV_EMPLOYEES
    WHERE EID = $1
    `;

    const binds1 = {
        LID: req.body.LID
    }

    let result1 = await database.execute(sql1, binds1);

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