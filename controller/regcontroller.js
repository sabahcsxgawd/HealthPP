/*
    importing internal dependencies 
*/

const database = require('../database/database');
const jwt = require('jsonwebtoken');

/*
For Rendering the login page For DOctor,Patient,Nurse and All;
*/
function getLoginAll(req,res,next){
    res.render('loginAll');
}

/*
For Rendering Reg Page For Doctor
*/
function getRegDoctor(req,res,next){
    res.render('regDoctor');
}

/*
For Rendering Reg Page For Receiptionist
*/
function getRegReceptionist(req,res,next){
    res.render('regReceptionist');
}

/*
For Rendering Reg Page For Patient
*/
function getRegPatient(req,res,next){
    res.render('regPatient');
}

/*
For Rendering Reg Page For Lab Assistant
*/
function getRegLabAssistant(req,res,next){
    res.render('regLabAssistant');
}


async function doRegPatient(req,res){
    const sql1 = `
        SELECT GET_PID_COUNT(:PID) PID_COUNT
        FROM PATIENTS
    `;
    const binds1 = {
        PID:req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);
    // console.log(result1);
    if(result1.rows[0].PID_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This NID is already in use',
        };
        res.json(tempObj);
        return;
        
    }
    const sql2 = `
        SELECT GET_PEMAIL_COUNT(:EMAIL) PEMAIL_COUNT
        FROM PATIENTS
    `;
    const binds2 = {
        EMAIL:req.body.email
    }

    let result2 = await database.execute(sql2, binds2);
    // console.log(result2);
    if(result2.rows[0].PEMAIL_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_PPHONE_COUNT(:PHONE) PPHONE_COUNT
        FROM PATIENTS
    `;
    const binds3 = {
        PHONE:req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);
    // console.log(result3);
    if(result3.rows[0].PPHONE_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }
    
    const sql = `
        INSERT INTO PATIENTS VALUES (:PID,:FIRST_NAME,:LAST_NAME,:GENDER,:ADDRESS,:PHONE,:EMAIL,TO_DATE(:DOB,'YYYY-MM-DD'),:BLOOD_GROUP,:PASSWORD)
    `;

    const binds = {
        PID:req.body.nid,
        FIRST_NAME:req.body.firstName,
        LAST_NAME:req.body.lastName,
        GENDER:req.body.gender,
        ADDRESS:req.body.address,
        PHONE:req.body.phoneNumber,
        EMAIL:req.body.email,
        DOB:req.body.dob,
        BLOOD_GROUP:req.body.bloodGroup,
        PASSWORD:req.body.password
    };
    let result = await database.execute(sql, binds);
    // console.log(result);
    let tempObj = {
        success : true
    };
    res.json(tempObj);
    return;
}


async function doRegDoctor(req,res){
    const sql1 = `
        SELECT GET_EID_COUNT(:EID) EID_COUNT
        FROM EMPLOYEES
    `;
    const binds1 = {
        EID:req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);
    // console.log(result1);
    if(result1.rows[0].EID_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This NID is already in use',
        };
        res.json(tempObj);
        return;
        
    }
    const sql2 = `
        SELECT GET_EEMAIL_COUNT(:EMAIL) EEMAIL_COUNT
        FROM EMPLOYEES
    `;
    const binds2 = {
        EMAIL:req.body.email
    }

    let result2 = await database.execute(sql2, binds2);
    // console.log(result2);
    if(result2.rows[0].EEMAIL_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_EPHONE_COUNT(:PHONE) EPHONE_COUNT
        FROM EMPLOYEES
    `;
    const binds3 = {
        PHONE:req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);
    // console.log(result3);
    if(result3.rows[0].EPHONE_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }

    const sql4 = `
        INSERT INTO UV_EMPLOYEES
        VALUES
        (:EID,:FIRST_NAME,:LAST_NAME,:GENDER,:ADDRESS,TO_DATE(:DOB,'YYYY-MM-DD'),:BLOOD_GROUP,:PHONE,:EMAIL,:PASSWORD)
    `;
    const binds4 = {
        EID:req.body.nid,
        FIRST_NAME:req.body.firstName,
        LAST_NAME:req.body.lastName,
        GENDER:req.body.gender,
        ADDRESS:req.body.address,
        PHONE:req.body.phoneNumber,
        EMAIL:req.body.email,
        DOB:req.body.dob,
        BLOOD_GROUP:req.body.bloodGroup,
        PASSWORD:req.body.password
    };
    let result4 = await database.execute(sql4, binds4);

    const sql5 = `
        INSERT INTO UV_DOCTORS
        VALUES
        (:EID,1500,:SPECIALITY)
    `;
    const binds5 = {
        EID:req.body.nid,
        SPECIALITY:req.body.speciality
    };
    let result5 = await database.execute(sql5, binds5);

    let DEGREES = req.body.degrees;
    console.log(DEGREES);
    for(let i = 0; i < DEGREES.length; i++) {
        let sql6 = `
        INSERT INTO UV_DOC_DEGREES
        VALUES
        (:EID,:DEGREE)
    `;
    let binds6 = {
        EID:req.body.nid,
        DEGREE:DEGREES[i]
    };
    let result6 = await database.execute(sql6, binds6);
    }

    let fromVisTimes = req.body.fromVisTime;
    let toVisTimes = req.body.toVisTime;

    for(let i = 0; i < fromVisTimes.length; i++) {
        let sql7 = `
        INSERT INTO UV_DOC_VIS_TIME
        VALUES
        (:EID,:VIS_FROM,:VIS_TO)
    `;
    let binds7 = {
        EID:req.body.nid,
        VIS_FROM:fromVisTimes[i],
        VIS_TO:toVisTimes[i]
    };
    let result7 = await database.execute(sql7, binds7);
    }
    let tempObj = {
        success : true
    }
    res.json(tempObj);
}

async function doRegLabAssistant(req,res){
    const sql1 = `
        SELECT GET_EID_COUNT(:EID) EID_COUNT
        FROM EMPLOYEES
    `;
    const binds1 = {
        EID:req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);
    // console.log(result1);
    if(result1.rows[0].EID_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This NID is already in use',
        };
        res.json(tempObj);
        return;
        
    }
    const sql2 = `
        SELECT GET_EEMAIL_COUNT(:EMAIL) EEMAIL_COUNT
        FROM EMPLOYEES
    `;
    const binds2 = {
        EMAIL:req.body.email
    }

    let result2 = await database.execute(sql2, binds2);
    // console.log(result2);
    if(result2.rows[0].EEMAIL_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_EPHONE_COUNT(:PHONE) EPHONE_COUNT
        FROM EMPLOYEES
    `;
    const binds3 = {
        PHONE:req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);
    // console.log(result3);
    if(result3.rows[0].EPHONE_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }

    const sql4 = `
        INSERT INTO UV_EMPLOYEES
        VALUES
        (:EID,:FIRST_NAME,:LAST_NAME,:GENDER,:ADDRESS,TO_DATE(:DOB,'YYYY-MM-DD'),:BLOOD_GROUP,:PHONE,:EMAIL,:PASSWORD)
    `;
    const binds4 = {
        EID:req.body.nid,
        FIRST_NAME:req.body.firstName,
        LAST_NAME:req.body.lastName,
        GENDER:req.body.gender,
        ADDRESS:req.body.address,
        PHONE:req.body.phoneNumber,
        EMAIL:req.body.email,
        DOB:req.body.dob,
        BLOOD_GROUP:req.body.bloodGroup,
        PASSWORD:req.body.password
    };
    let result4 = await database.execute(sql4, binds4);

    const sql5 = `
        INSERT INTO UV_LAB_ASSISTANTS
        VALUES
        (:EID,50000,:LABNAME)
    `;
    const binds5 = {
        EID:req.body.nid,
        LABNAME:req.body.lab
    };
    let result5 = await database.execute(sql5, binds5);
    let tempObj = {
        success : true
    }
    res.json(tempObj);
}

async function doRegReceptionist(req,res){
    const sql1 = `
        SELECT GET_EID_COUNT(:EID) EID_COUNT
        FROM EMPLOYEES
    `;
    const binds1 = {
        EID:req.body.nid
    }

    let result1 = await database.execute(sql1, binds1);
    // console.log(result1);
    if(result1.rows[0].EID_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This NID is already in use',
        };
        res.json(tempObj);
        return;
        
    }
    const sql2 = `
        SELECT GET_EEMAIL_COUNT(:EMAIL) EEMAIL_COUNT
        FROM EMPLOYEES
    `;
    const binds2 = {
        EMAIL:req.body.email
    }

    let result2 = await database.execute(sql2, binds2);
    // console.log(result2);
    if(result2.rows[0].EEMAIL_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This EMAIL is already in use',
        };
        res.json(tempObj);
        return;
    }
    const sql3 = `
        SELECT GET_EPHONE_COUNT(:PHONE) EPHONE_COUNT
        FROM EMPLOYEES
    `;
    const binds3 = {
        PHONE:req.body.phoneNumber
    }

    let result3 = await database.execute(sql3, binds3);
    // console.log(result3);
    if(result3.rows[0].EPHONE_COUNT > 0) {
        let tempObj = {
            success : false,
            message : 'This PHONE is already in use',
        };
        res.json(tempObj);
        return;
    }

    const sql4 = `
        INSERT INTO UV_EMPLOYEES
        VALUES
        (:EID,:FIRST_NAME,:LAST_NAME,:GENDER,:ADDRESS,TO_DATE(:DOB,'YYYY-MM-DD'),:BLOOD_GROUP,:PHONE,:EMAIL,:PASSWORD)
    `;
    const binds4 = {
        EID:req.body.nid,
        FIRST_NAME:req.body.firstName,
        LAST_NAME:req.body.lastName,
        GENDER:req.body.gender,
        ADDRESS:req.body.address,
        PHONE:req.body.phoneNumber,
        EMAIL:req.body.email,
        DOB:req.body.dob,
        BLOOD_GROUP:req.body.bloodGroup,
        PASSWORD:req.body.password
    };
    let result4 = await database.execute(sql4, binds4);

    const sql5 = `
        INSERT INTO UV_RECEPTIONISTS
        VALUES
        (:EID,50000)
    `;
    const binds5 = {
        EID:req.body.nid
    };
    let result5 = await database.execute(sql5, binds5);
    let tempObj = {
        success : true
    }
    res.json(tempObj);
}

async function getDocSpeciality(req,res){
    const sql = `
        SELECT WARD_NAME SPECIALITY FROM WARDS
    `;
    const binds = {
        
    };
    let result = await database.execute(sql,binds);
    //console.log(result);
    res.json(result.rows);

}


async function getLabName(req,res){
    const sql = `
    SELECT LABNAME FROM LABORATORIES
    `;
    const binds = {
        
    };
    let result = await database.execute(sql,binds);
    //console.log(result);
    res.json(result.rows);

}



module.exports={
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