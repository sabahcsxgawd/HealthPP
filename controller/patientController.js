/*
    importing internal dependencies 
*/

const database = require("../database/database");

/*
For Rendering the Home page For Patient;
*/
function getPatientHome(req, res, next) {
  res.render("patientHome");
}

/*
For Rendering the Book Appointments page For Patient;
*/
function getPatientAppointments(req, res, next) {
  res.render("patientAppointments");
}

function getPatientAppointmentsHistory(req, res, next) {
  res.render("patientAppointmentHistory");
}

function getPatientHireAmbulance(req, res, next) {
  res.render("patientHireAmbulance");
}

function getPatientHireNurse(req, res, next) {
  res.render("patientHireNurse");
}

function getPatientTest(req, res, next) {
  res.render("patientTest");
}

function getPatientUpcomingAppointments(req, res, next) {
  res.render("patientUpcomingAppointments");
}

function getPatientAppointmentConfirm(req, res, next) {
  res.render('patientAppointmentConfirm');
}

function getPrescription(req, res, next) {
  res.render('patientPrescription');
}

function getPatientTestResult(req, res, next) {
  res.render('patientTestResult');
}

function dues(req,res,next){
  res.render('patientDues');
}

async function getDoctor(req, res) {
  const sql = `
  DECLARE 
  c1 SYS_REFCURSOR;
  c2 SYS_REFCURSOR;
  c3 SYS_REFCURSOR;
BEGIN
		OPEN c1 FOR SELECT DISTINCT
		EID,
		FIRST_NAME || ' ' || LAST_NAME AS NAME,
		WARD_NAME SPECIALITY,
		FEES,
		GENDER,
		ADDRESS,
		HOSPITAL_NAME 
	    FROM
		EMPLOYEES
		JOIN HOSPITALS USING ( HID )
		JOIN DOCTORS USING ( EID ) 
	  WHERE
		BRANCH = : BRANCH 
		AND WARD_NAME = : SPECIALITY;
	DBMS_SQL.RETURN_RESULT ( c1 );
	OPEN c2 FOR SELECT DISTINCT
	EID,
	DEGREE 
	FROM
		EMPLOYEES
		JOIN HOSPITALS USING ( HID )
		JOIN DOCTORS USING ( EID )
		JOIN DOC_DEGREES USING ( EID ) 
	WHERE
		BRANCH = : BRANCH 
		AND WARD_NAME = : SPECIALITY;
	DBMS_SQL.RETURN_RESULT ( c2 );
	OPEN c3 FOR SELECT DISTINCT
	EID,
	VIS_FROM,
	VIS_TO 
	FROM
		EMPLOYEES
		JOIN HOSPITALS USING ( HID )
		JOIN DOCTORS USING ( EID )
		JOIN DOC_VIS_TIME USING ( EID ) 
	WHERE
		BRANCH = : BRANCH 
		AND WARD_NAME = : SPECIALITY;
DBMS_SQL.RETURN_RESULT ( c3 );
END;
  `;
  const binds = {
    BRANCH: req.body.BRANCH,
    SPECIALITY: req.body.SPECIALITY,
  };

  let result = await database.execute(sql, binds);
  let docObjArr = [];
  let temp = result.implicitResults;
  for (let j = 0; j < temp[0].length; j++) {
    let docObj = {};
    docObj.EID = temp[0][j].EID;
    docObj.NAME = temp[0][j].NAME;
    docObj.SPECIALITY = temp[0][j].SPECIALITY;
    docObj.FEES = temp[0][j].FEES;
    docObj.GENDER = temp[0][j].GENDER;
    docObj.ADDRESS = temp[0][j].ADDRESS;
    docObj.HOSPITAL_NAME = temp[0][j].HOSPITAL_NAME;
    docObj.DEGREE = "";
    docObjArr.push(docObj);
  }

  for (let i = 0; i < temp[1].length; i++) {
    for (let j = 0; j < docObjArr.length; j++) {
      if (docObjArr[j].EID === temp[1][i].EID) {
        docObjArr[j].DEGREE += (temp[1][i].DEGREE + " ");
        break;
      }
    }
  }
  res.json(docObjArr);
}



async function getDoctorConfirm(req, res) {
  const sql = `
  DECLARE c1 SYS_REFCURSOR;
  c2 SYS_REFCURSOR;
  c3 SYS_REFCURSOR;
  BEGIN
      OPEN c1 FOR SELECT DISTINCT
      EID,
      FIRST_NAME || ' ' || LAST_NAME AS NAME,
      WARD_NAME SPECIALITY,
      FEES,
      GENDER,
      E.EMAIL,
      E.PHONE,
      ADDRESS,
      HOSPITAL_NAME,
      BRANCH 
    FROM
      EMPLOYEES E
      JOIN DOCTORS USING ( EID )
      JOIN HOSPITALS USING ( HID ) 
    WHERE
      EID = : EID;
    DBMS_SQL.RETURN_RESULT ( c1 );
    OPEN c2 FOR SELECT DISTINCT
    DEGREE 
    FROM
      DOC_DEGREES 
    WHERE
      EID = : EID;
    DBMS_SQL.RETURN_RESULT ( c2 );
    OPEN c3 FOR SELECT DISTINCT
    VIS_FROM,
    VIS_TO 
    FROM
      DOC_VIS_TIME 
    WHERE
      EID = : EID;
  DBMS_SQL.RETURN_RESULT ( c3 );
  END;
    `;
  const binds = {
    EID: req.body.EID
  };
  let result = await database.execute(sql, binds);
  let temp = result.implicitResults;
  let docObj = {};
  docObj.EID = temp[0][0].EID;
  docObj.NAME = temp[0][0].NAME;
  docObj.SPECIALITY = temp[0][0].SPECIALITY;
  docObj.FEES = temp[0][0].FEES;
  docObj.GENDER = temp[0][0].GENDER;
  docObj.EMAIL = temp[0][0].EMAIL;
  docObj.PHONE = temp[0][0].PHONE;
  docObj.ADDRESS = temp[0][0].ADDRESS;
  docObj.BRANCH = temp[0][0].BRANCH;
  docObj.DEGREE = "";
  docObj.VIS_TIME = [];

  for (let i = 0; i < temp[1].length; i++) {
    docObj.DEGREE += (temp[1][i].DEGREE + " ");;
  }

  docObj.DEGREE = docObj.DEGREE.trim();

  for (let i = 0; i < temp[2].length; i++) {
    let vis_time_str = temp[2][i].VIS_FROM + " - " + temp[2][i].VIS_TO;
    docObj.VIS_TIME.push(vis_time_str);
  }

  res.json(docObj);
}



async function getBookAppointment(req, res) {
  const sql = `
    INSERT INTO APPOINTMENTS(APPTID, APPT_TIME, PID, DEID, APPT_DATE) VALUES('APPT_' || APPT_SEQ.NEXTVAL, :APPT_TIME, :PID, :DEID, TO_DATE(:APPT_DATE, 'YYYY-MM-DD'))
    `;
  const binds = {
    DEID: req.body.DEID,
    PID: req.body.PID,
    APPT_TIME: req.body.APPT_TIME,
    APPT_DATE: req.body.APPT_DATE
  };
  let result = await database.execute(sql, binds);
  res.json("success");
}



async function getUpcomingAppointments(req, res) {
  const sql = `
  SELECT DISTINCT
	APPTID,
	APPT_DATE,
	APPT_TIME,
	FIRST_NAME || ' ' || LAST_NAME DOCTOR_NAME,
	WARD_NAME SPECIALITY,
	GET_DOC_DEGREES ( DEID ) DEGREES,
	HOSPITAL_NAME,
	BRANCH 
  FROM
	(
	  SELECT
		* 
	  FROM
		APPOINTMENTS 
	  WHERE
		PID = : PID 
		AND REID IS NOT NULL 
		AND DONE = 'N' 
		AND APPT_DATE >= TO_DATE( TO_CHAR( SYSDATE, 'YYYY-MM-DD' ), 'YYYY-MM-DD' ) 
	) T1
	JOIN EMPLOYEES ON ( EID = DEID )
	JOIN DOCTORS USING ( EID )
	JOIN DOC_DEGREES USING ( EID )
	JOIN HOSPITALS USING ( HID )
  ORDER BY
	APPT_DATE ASC,
	APPTID ASC 
  `;
  const binds = {
    PID: req.body.PID
  };
  //console.log(binds.EID);
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
	( SELECT * FROM APPOINTMENTS WHERE PID = : PID AND REID IS NOT NULL AND DONE = 'Y' ) T1
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
	( SELECT * FROM APPOINTMENTS WHERE APPTID = : APPT_ID ) T1
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

async function getTestResultHistory(req, res) {
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



async function getAmbulanceType(req, res) {
  const sql = `
    SELECT AMB_TYPE FROM AMBULANCES
  `;
  const binds = {

  };
  let result = await database.execute(sql, binds);
  //console.log(result);
  res.json(result.rows);
}


async function getBranch(req, res) {
  const sql = `
  SELECT DISTINCT BRANCH FROM HOSPITALS
  `;
  const binds = {

  };
  let result = await database.execute(sql, binds);
  //console.log(result);
  res.json(result.rows);
}


async function getAmbulances(req, res) {
  const sql = `
    SELECT AMB_TYPE, AMB_MANAGER_NAME, AMB_PHONE, HOSPITAL_NAME, BRANCH 
    FROM AMB_HOS 
    JOIN HOSPITALS USING(HID) 
    WHERE BRANCH = :BRANCH 
    AND AMB_TYPE = :AMB_TYPE
  `;
  const binds = {
    BRANCH: req.body.BRANCH,
    AMB_TYPE: req.body.AMB_TYPE
  };
  let result = await database.execute(sql, binds);
  //console.log(req.body.BRANCH);
  //console.log(req.body.AMB_TYPE);
  //console.log(result);
  res.json(result.rows);
}


async function getSpeciality(req, res) {
  const sql = `
  SELECT
	WARD_NAME SPECIALITY 
  FROM
	WARDS
  `;
  const binds = {};
  let result = await database.execute(sql, binds);
  //console.log(req.body.BRANCH);
  //console.log(req.body.AMB_TYPE);
  //console.log(result);
  res.json(result.rows);
}

async function getDues(req,res){
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

/*
Export
*/
module.exports = {
  getPatientHome,
  getPatientAppointments,
  getPatientAppointmentsHistory,
  getPatientHireAmbulance,
  getPatientHireNurse,
  getPatientTest,
  getPatientUpcomingAppointments,
  getPatientAppointmentConfirm,
  getDoctor,
  getDoctorConfirm,
  getBookAppointment,
  getUpcomingAppointments,
  getPrescription,
  getPatientTestResult,
  getAppointmentHistory,
  getSinglePrescription,
  getTestResultHistory,
  getSingleTestResult,
  getAmbulanceType,
  getBranch,
  getAmbulances,
  getSpeciality,
  dues,
  getDues
};
