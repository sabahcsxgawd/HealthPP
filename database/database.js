const { Client } = require('pg');

// Global variable to store the database connection
let dbconnection;

async function startup() {
    if (!dbconnection) {
        console.log('starting up database.');
        dbconnection = new Client({
            connectionString: process.env.DATABASE_URL
        });
        try {
            await dbconnection.connect();
            console.log('database started');
        } catch (err) {
            console.error("ERROR connecting to the database: ", err.message);
            throw err;
        }
    }
    return dbconnection;
}

// Code to execute SQL
async function execute(sql, binds) {
  let results;
  try {
      // Convert the JSON object (binds) into an array of values
      const queryParams = Object.values(binds);

      // Get the connection (will reuse the same connection if it's already established)
      const connection = await startup();
      
      // Execute the SQL query with binds (parameters)
      results = await connection.query(sql, queryParams);
  } catch (err) {
      console.log("ERROR executing sql: " + err.message);
  }
  return results;
}


// // Function to close the connection (optional, only call this when your application shuts down)
// async function closeConnection() {
//     if (dbconnection) {
//         try {
//             await dbconnection.end();
//             console.log('Connection closed.');
//         } catch (err) {
//             console.error("ERROR closing connection: " + err.message);
//         }
//     }
// }

module.exports = {
    execute,
};
