/*
Importing  External Dependencies
*/
const express = require('express');
const dotenv = require('dotenv');

/*
To access the env variables by 'process.env.varname'
*/
dotenv.config();

const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const database = require('./database/database')

// Optional: Add a simple connection test
async function testDBConnection() {
    try {
        const sql = `SELECT version()`;
        const result = await database.execute(sql, {});
        console.log('Connected to Postgres:', result.rows[0].version);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

/*
Importing Internal Dependencies
*/
const loginRouter = require('./router/loginRouter');
const regRouter = require("./router/regRouter");
const patientRouter = require("./router/patientRouter");
const doctorRouter = require("./router/doctorRouter");
const receptionistRouter = require("./router/receptionistRouter");
const labAssistantRouter = require("./router/labAssistantRouter");
const adminRouter = require("./router/adminRouter");
const { notFoundHandler, errorHandler } = require('./middlewares/common-middlewares/errorHandler');



/*
Create app Router
*/
const app = express();

/*
App helpers
*/
app.use(express.json());    //To Parse JSON data
app.use(express.urlencoded({ extended: true }));   // To Parse HTML form data and 'extended:true' => now it can parse query data
app.use(express.static(path.join(__dirname, "public")));     //Setting up static Folders
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(cookieParser(process.env.JWT_SECRET));  //To Parse Cookies
// console.log(process.env.PORT);
// app.use(cookieParser('fndjkbfbj'));  //To Parse Cookies

app.use(cors());
app.options('*', cors());

// app.use(cors({
//     origin: 'http://localhost:4200'  // Replace with your frontend's URL
// }));




/*
Set view Engine
=>Default folder : 'views'
*/
app.set("view engine", "ejs");




/*
logout
*/
function logout(req, res) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.render('loginAll');
}

/*
Routing Setup
*/
app.use('/', loginRouter);
app.use('/reg', regRouter);
app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/receptionist', receptionistRouter);
app.use('/labAssistant', labAssistantRouter);
app.use('/admin', adminRouter);
app.delete('/logout', logout);
app.use('/test', async (req, res) => {
    await testDBConnection();
    res.send('Database connection tested');
});
app.use('/test1', (req, res) => {
    res.render('test');
});



/*
Error Handling
=>Common Error Handler,Should be the last middleware
*/
//404 Not Found Handler
app.use(notFoundHandler);

//Common error  handler
app.use(errorHandler);





app.listen(process.env.PORT, () => {
    console.log('Listening....');
});