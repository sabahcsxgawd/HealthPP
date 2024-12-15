/*
    importing internal dependencies 
*/

const database = require("../database/database");


function getLabAssistantHome(req, res, next) {
    res.render('labAssistantHome');
}

function getLabAssistantUpcomingTests(req, res, next) {
    res.render('labAssistantUpcomingTests');
}

function getLabAssistantEditTests(req, res, next) {
    res.render('labAssistantEditTests');
}

function getGiveTestResult(req, res, next) {
    res.render('labAssistantGiveTestResult');
}

// labid again???
async function getTests(req, res) {
    const sql = `
    SELECT
	APPTID,
	TO_CHAR( APPT_DATE, 'YYYY-MM-DD' ) APPT_DATE,
	APPT_TIME,
	LABNAME,
	TEST_NAME,
	PID 
    FROM
	( SELECT * FROM APPT_TESTS APT_T JOIN APPOINTMENTS APT USING ( APPTID ) WHERE APT_T.DONE = 'N' ) T1
	JOIN TESTS USING ( TEST_NAME )
	JOIN LABS_HOS USING ( LABNAME ) 
    WHERE
	LABNAME = :LABNAME 
	AND HID = :HID
    `;
    const binds = {
        HID: req.body.HID,
        LABNAME: req.body.LABNAME
    };
    // console.log(req.body.HID);
    let result = await database.execute(sql, binds);
    // console.log(result);
    res.json(result.rows);
}

async function getSingleTest(req, res) {
    const sql = `
    SELECT
	APPTID,
	TO_CHAR( APPT_DATE, 'YYYY-MM-DD' ) APPT_DATE,
	APPT_TIME,
	LABNAME,
	TEST_NAME,
	PID,
	FIRST_NAME || ' ' || LAST_NAME PATIENT_NAME,
	GET_AGE ( DOB ) AGE,
	BLOOD_GROUP 
    FROM
	APPT_TESTS
	JOIN TESTS USING ( TEST_NAME )
	JOIN APPOINTMENTS USING ( APPTID )
	JOIN PATIENTS USING ( PID ) 
    WHERE
	APPTID = : APPTID 
	AND TEST_NAME = : TEST_NAME
    `;
    const binds = {
        APPTID: req.body.APPTID,
        TEST_NAME: req.body.TEST_NAME
    };
    // console.log(binds.LABID);
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);
}


async function getUploadTestResult(req, res) {
    const sql = `
        UPDATE APPT_TESTS
        SET DONE = 'Y'
        WHERE APPTID = :APPTID
        AND TEST_NAME = :TEST_NAME
    `;
    const binds = {
        TEST_NAME: req.body.TEST_NAME,
        APPTID: req.body.APPTID
    }
    let result = await database.execute(sql, binds);
    // console.log(result);

    const sql2 = `
        INSERT INTO TEST_RESULTS(APPTID, TEST_NAME, RESULTS, EID) VALUES(:APPTID, :TEST_NAME, :TEST_RESULT, :EID)
    `;
    const binds2 = {
        TEST_NAME: req.body.TEST_NAME,
        APPTID: req.body.APPTID,
        TEST_RESULT: req.body.TEST_RESULT,
        EID: req.body.EID
    }
    result = await database.execute(sql2, binds2);
    // console.log(result);
    res.json("success");


}
/*
Export
*/
module.exports = {
    getLabAssistantHome,
    getLabAssistantUpcomingTests,
    getLabAssistantEditTests,
    getTests,
    getGiveTestResult,
    getSingleTest,
    getUploadTestResult
}