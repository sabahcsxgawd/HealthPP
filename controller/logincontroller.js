/*
    importing internal dependencies 
*/

const database = require("../database/database");
const jwt = require("jsonwebtoken");

/*
For Rendering the login page For DOctor,Patient,Nurse and All;
*/
function getLoginAll(req, res, next) {
  res.render("loginAll");
}

/*
For Rendering the login page For Admin;
*/
function getLoginAdmin(req, res, next) {
  res.render("loginAdmin");
}

async function doLoginAdmin(req, res) {
  const sql = `
  SELECT AID, FIRST_NAME ||' '|| LAST_NAME AS NAME, PHONE, EMAIL 
  FROM ADMIN  
  WHERE EMAIL = $1
  AND PASSWORD = $2
    `;
  const binds = {
    email: req.body.email,
    password: req.body.password,
  };

  let result = await database.execute(sql, binds);

  if (result.rows.length != 1) {
    const userObject = {
      success: false,
    };
    res.json(userObject);
  } else {
    const userObject = {
      EMAIL: result.rows[0].EMAIL,
      ROLE: "admin",
      AID: result.rows[0].AID,
      NAME: result.rows[0].NAME,
      success: true,
    };

    //generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    //set cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      signed: true,
    });
    res.locals.loggedInUser = userObject;
    res.json(userObject);
  }
}

/*
For Rendering the login page For Receiptionist;
*/
function getLoginReceiptionist(req, res, next) {
  res.render("loginReceiptionist");
}

async function doLoginReceptionist(req, res) {
  const sql = `
  SELECT
  E.EID,
  E.FIRST_NAME || ' ' || E.LAST_NAME AS NAME,
  E.GENDER,
  E.ADDRESS,
  E.PHONE,
  E.EMAIL,
  E.HID 
  FROM
  EMPLOYEES E
  JOIN RECEPTIONISTS R USING ( EID ) 
  WHERE
  E.EMAIL = $1 
  AND E.PASSWORD = $2
    `;
  const binds = {
    email: req.body.email,
    password: req.body.password,
  };
  let result = await database.execute(sql, binds);
  //console.log(result);
  if (result.rows.length != 1) {
    const userObject = {
      success: false,
    };
    res.json(userObject);
  } else {
    const userObject = {
      EMAIL: result.rows[0].EMAIL,
      ROLE: "receptionist",
      EID: result.rows[0].EID,
      NAME: result.rows[0].NAME,
      HID: result.rows[0].HID,
      success: true,
    };

    //generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    //set cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      signed: true,
    });
    res.locals.loggedInUser = userObject;
    res.json(userObject);
  }
}

/*
For Rendering the login page For Lab Assistant;
*/
function getLoginLabAssistant(req, res, next) {
  res.render("loginLabAssistant");
}

async function doLoginLabAssistant(req, res) {
  const sql = `
  SELECT
    EID,
    FIRST_NAME || ' ' || LAST_NAME AS NAME,
    GENDER,
    ADDRESS,
    GET_AGE(DOB) AS AGE,
    PHONE,
    EMAIL,
    HID,
    LABNAME 
  FROM
    EMPLOYEES
    JOIN LAB_ASSISTANTS USING (EID) 
  WHERE
    EMAIL = $1 
    AND PASSWORD = $2
    `;
  const binds = {
    email: req.body.email,
    password: req.body.password,
  };
  let result = await database.execute(sql, binds);
  console.log(result);
  if (result.rows.length != 1) {
    const userObject = {
      success: false,
    };
    res.json(userObject);
  } else {
    const userObject = {
      EMAIL: result.rows[0].EMAIL,
      ROLE: "Lab Assistant",
      EID: result.rows[0].EID,
      NAME: result.rows[0].NAME,
      HID: result.rows[0].HID,
      LABNAME: result.rows[0].LABNAME,
      success: true,
    };

    //generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    //set cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      signed: true,
    });
    res.locals.loggedInUser = userObject;
    res.json(userObject);
  }
}

/*
For Rendering the login page For Patient;
*/
function getLoginPatient(req, res, next) {
  res.render("loginPatient");
}

async function doLoginPatient(req, res) {
  const sql = `
    SELECT *
    FROM PATIENTS
    WHERE 
    EMAIL = :email
    AND PASSWORD = :password
    `;
  const binds = {
    email: req.body.email,
    password: req.body.password,
  };
  let result = await database.execute(sql, binds);
  //console.log(result);
  if (result.rows.length != 1) {
    const userObject = {
      success: false,
    };
    res.json(userObject);
  } else {
    const userObject = {
      EMAIL: result.rows[0].EMAIL,
      ROLE: "patient",
      PID: result.rows[0].PID,
      FIRST_NAME: result.rows[0].FIRST_NAME,
      LAST_NAME: result.rows[0].LAST_NAME,
      success: true,
    };

    //generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    //set cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      signed: true,
    });
    res.locals.loggedInUser = userObject;
    res.json(userObject);
  }
}

/*
For Rendering the login page For Doctor;
*/
function getLoginDoctor(req, res, next) {
  res.render("loginDoctor");
}

async function doLoginDoctor(req, res) {
  const sql = `
  SELECT
	EID,
	FIRST_NAME || ' ' || LAST_NAME NAME,
	GENDER,
	E.PHONE,
	E.EMAIL,
	HID,
	HOSPITAL_NAME,
	BRANCH,
	WARD_NAME SPECIALITY,
	FEES
  FROM
	EMPLOYEES E
	JOIN DOCTORS D USING ( EID )
	JOIN HOSPITALS H USING ( HID ) 
  WHERE
	E.EMAIL = : email 
	AND E.PASSWORD = : password
    `;
  const binds = {
    email: req.body.email,
    password: req.body.password,
  };
  let result = await database.execute(sql, binds);
  //console.log(result);
  if (result.rows.length != 1) {
    const userObject = {
      success: false,
    };
    res.json(userObject);
  } else {
    const userObject = {
      EMAIL: result.rows[0].EMAIL,
      ROLE: "doctor",
      EID: result.rows[0].EID,
      NAME: result.rows[0].NAME,
      HID: result.rows[0].HID,
      success: true,
    };

    //generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    //set cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      signed: true,
    });
    res.locals.loggedInUser = userObject;
    res.json(userObject);
  }
}



/*
Export
*/
module.exports = {
  getLoginAll,
  getLoginAdmin,
  getLoginDoctor,
  getLoginPatient,
  getLoginReceiptionist,
  getLoginLabAssistant,
  doLoginPatient,
  doLoginAdmin,
  doLoginDoctor,
  doLoginLabAssistant,
  doLoginReceptionist,
};