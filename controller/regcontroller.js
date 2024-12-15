/*
    importing internal dependencies 
*/

const database = require('../database/database');
const jwt = require('jsonwebtoken');

/*
For Rendering the login page For DOctor,Patient,Nurse and All;
*/
function getLoginAll(req, res, next) {
    res.render('loginAll');
}

/*
For Rendering Reg Page For Doctor
*/
function getRegDoctor(req, res, next) {
    res.render('regDoctor');
}

/*
For Rendering Reg Page For Receiptionist
*/
function getRegReceptionist(req, res, next) {
    res.render('regReceptionist');
}

/*
For Rendering Reg Page For Patient
*/
function getRegPatient(req, res, next) {
    res.render('regPatient');
}

/*
For Rendering Reg Page For Lab Assistant
*/
function getRegLabAssistant(req, res, next) {
    res.render('regLabAssistant');
}


async function doRegPatient(req, res) {
    const sql1 = `
        SELECT GET_PID_COUNT($1) PID_COUNT
        FROM PATIENTS
    `;
    const binds1 = {
        PID: req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);
    // console.log(result1);
    if (result1.rows[0].PID_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This NID is already in use',
        };
        res.json(tempObj);
        return;

    }
    const sql2 = `
        SELECT GET_PEMAIL_COUNT($1) PEMAIL_COUNT
        FROM PATIENTS
    `;
    const binds2 = {
        EMAIL: req.body.email
    }

    let result2 = await database.execute(sql2, binds2);
    // console.log(result2);
    if (result2.rows[0].PEMAIL_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_PPHONE_COUNT($1) PPHONE_COUNT
        FROM PATIENTS
    `;
    const binds3 = {
        PHONE: req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);
    // console.log(result3);
    if (result3.rows[0].PPHONE_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }

    const sql = `
        INSERT INTO PATIENTS VALUES ($1,$2,$3,$4,$5,$6,$7,TO_DATE($8,'YYYY-MM-DD'),$9,$10)
    `;

    const binds = {
        PID: req.body.nid,
        FIRST_NAME: req.body.firstName,
        LAST_NAME: req.body.lastName,
        GENDER: req.body.gender,
        ADDRESS: req.body.address,
        PHONE: req.body.phoneNumber,
        EMAIL: req.body.email,
        DOB: req.body.dob,
        BLOOD_GROUP: req.body.bloodGroup,
        PASSWORD: req.body.password
    };
    let result = await database.execute(sql, binds);
    // console.log(result);
    let tempObj = {
        success: true
    };
    res.json(tempObj);
    return;
}


async function doRegDoctor(req, res) {
    const sql1 = `
        SELECT GET_EID_COUNT($1) EID_COUNT
        FROM EMPLOYEES
    `;
    const binds1 = {
        EID: req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);

    if (result1.rows[0].EID_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This NID is already in use',
        };
        res.json(tempObj);
        return;

    }
    const sql2 = `
        SELECT GET_EEMAIL_COUNT($1) EEMAIL_COUNT
        FROM EMPLOYEES
    `;
    const binds2 = {
        EMAIL: req.body.email
    }

    let result2 = await database.execute(sql2, binds2);

    if (result2.rows[0].EEMAIL_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_EPHONE_COUNT($1) EPHONE_COUNT
        FROM EMPLOYEES
    `;
    const binds3 = {
        PHONE: req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);

    if (result3.rows[0].EPHONE_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }

    const sql4 = `
        INSERT INTO UV_EMPLOYEES
        VALUES
        ($1,$2,$3,$4,$5,TO_DATE($6,'YYYY-MM-DD'),$7,$8,$9,$10)
    `;
    const binds4 = {
        EID: req.body.nid,
        FIRST_NAME: req.body.firstName,
        LAST_NAME: req.body.lastName,
        GENDER: req.body.gender,
        ADDRESS: req.body.address,
        DOB: req.body.dob,
        BLOOD_GROUP: req.body.bloodGroup,
        PHONE: req.body.phoneNumber,
        EMAIL: req.body.email,
        PASSWORD: req.body.password
    };

    try {
        await database.execute(sql4, binds4);

        const sql5 = `
            INSERT INTO UV_DOCTORS
            VALUES
            ($1,1500,$2)
        `;
        const binds5 = {
            EID: req.body.nid,
            SPECIALITY: req.body.speciality
        };

        await database.execute(sql5, binds5);

        let DEGREES = req.body.degrees;

        for (let i = 0; i < DEGREES.length; i++) {
            let sql6 = `
            INSERT INTO UV_DOC_DEGREES
            VALUES
            ($1,$2)
            `;
            let binds6 = {
                EID: req.body.nid,
                DEGREE: DEGREES[i]
            };
            await database.execute(sql6, binds6);
        }

        let fromVisTimes = req.body.fromVisTime;
        let toVisTimes = req.body.toVisTime;

        for (let i = 0; i < fromVisTimes.length; i++) {
            let sql7 = `
            INSERT INTO UV_DOC_VIS_TIME
            VALUES
            ($1,$2,$3)
            `;
            let binds7 = {
                EID: req.body.nid,
                VIS_FROM: fromVisTimes[i],
                VIS_TO: toVisTimes[i]
            };
            await database.execute(sql7, binds7);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering doctor. Please try again.'
        });
    }
}

async function doRegLabAssistant(req, res) {
    const sql1 = `
        SELECT GET_EID_COUNT($1) EID_COUNT
        FROM EMPLOYEES
    `;
    const binds1 = {
        EID: req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);
    // console.log(result1);
    if (result1.rows[0].EID_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This NID is already in use',
        };
        res.json(tempObj);
        return;

    }
    const sql2 = `
        SELECT GET_EEMAIL_COUNT($1) EEMAIL_COUNT
        FROM EMPLOYEES
    `;
    const binds2 = {
        EMAIL: req.body.email
    }

    let result2 = await database.execute(sql2, binds2);
    // console.log(result2);
    if (result2.rows[0].EEMAIL_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_EPHONE_COUNT($1) EPHONE_COUNT
        FROM EMPLOYEES
    `;
    const binds3 = {
        PHONE: req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);
    // console.log(result3);
    if (result3.rows[0].EPHONE_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }

    const sql4 = `
        INSERT INTO UV_EMPLOYEES
        VALUES
        ($1,$2,$3,$4,$5,TO_DATE($6,'YYYY-MM-DD'),$7,$8,$9,$10)
    `;
    const binds4 = {
        EID: req.body.nid,
        FIRST_NAME: req.body.firstName,
        LAST_NAME: req.body.lastName,
        GENDER: req.body.gender,
        ADDRESS: req.body.address,
        DOB: req.body.dob,
        BLOOD_GROUP: req.body.bloodGroup,
        PHONE: req.body.phoneNumber,
        EMAIL: req.body.email,
        PASSWORD: req.body.password
    };
    let result4 = await database.execute(sql4, binds4);

    const sql5 = `
        INSERT INTO UV_LAB_ASSISTANTS
        VALUES
        ($1, 50000, $2);

    `;
    const binds5 = {
        EID: req.body.nid,
        LABNAME: req.body.lab
    };
    let result5 = await database.execute(sql5, binds5);
    let tempObj = {
        success: true
    }
    res.json(tempObj);
}

async function doRegReceptionist(req, res) {
    const sql1 = `
        SELECT GET_EID_COUNT($1) EID_COUNT
        FROM EMPLOYEES
    `;
    const binds1 = {
        EID: req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);
    // console.log(result1);
    if (result1.rows[0].EID_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This NID is already in use',
        };
        res.json(tempObj);
        return;

    }
    const sql2 = `
        SELECT GET_EEMAIL_COUNT($1) EEMAIL_COUNT
        FROM EMPLOYEES
    `;
    const binds2 = {
        EMAIL: req.body.email
    }

    let result2 = await database.execute(sql2, binds2);
    // console.log(result2);
    if (result2.rows[0].EEMAIL_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_EPHONE_COUNT($1) EPHONE_COUNT
        FROM EMPLOYEES
    `;
    const binds3 = {
        PHONE: req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);
    // console.log(result3);
    if (result3.rows[0].EPHONE_COUNT > 0) {
        let tempObj = {
            success: false,
            message: 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }

    const sql4 = `
        INSERT INTO UV_EMPLOYEES
        VALUES
        ($1, $2, $3, $4, $5, TO_DATE($6, 'YYYY-MM-DD'), $7, $8, $9, $10);

    `;
    const binds4 = {
        EID: req.body.nid,
        FIRST_NAME: req.body.firstName,
        LAST_NAME: req.body.lastName,
        GENDER: req.body.gender,
        ADDRESS: req.body.address,
        DOB: req.body.dob,
        BLOOD_GROUP: req.body.bloodGroup,
        PHONE: req.body.phoneNumber,
        EMAIL: req.body.email,
        PASSWORD: req.body.password
    };
    let result4 = await database.execute(sql4, binds4);

    const sql5 = `
        INSERT INTO UV_RECEPTIONISTS
        VALUES
        ($1, 50000)
    `;
    const binds5 = {
        EID: req.body.nid
    };
    let result5 = await database.execute(sql5, binds5);
    let tempObj = {
        success: true
    }
    res.json(tempObj);
}

async function getDocSpeciality(req, res) {
    const sql = `
        SELECT WARD_NAME SPECIALITY FROM WARDS
    `;
    const binds = {

    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);

}


async function getLabName(req, res) {
    const sql = `
    SELECT LABNAME FROM LABORATORIES
    `;
    const binds = {

    };
    let result = await database.execute(sql, binds);
    //console.log(result);
    res.json(result.rows);

}



module.exports = {
    getRegDoctor,
    getRegLabAssistant,
    getRegPatient,
    getRegReceptionist,
    doRegPatient,
    doRegDoctor,
    doRegLabAssistant,
    doRegReceptionist,
    getDocSpeciality,
    getLabName
}