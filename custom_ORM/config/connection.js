// Set up MySQL connection.
var mysql = require("mysql");

var connection;


// Make connection.

try{
  if (process.env.JAWSDB_URL) {

    connection = mysql.createConnection(process.env.JAWSDB_URL);
    console.log("jaws connected as id " + connection.threadId);

  } else {
     connection = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'password',
       database: 'burger_db'
     });
     console.log("mysql connected as id " + connection.threadId);
   };

}catch(err){
  console.error("error connecting: " + err.stack);
}



// Export connection for our ORM to use.
module.exports = connection;



//Connection String 
//mysql://gtsydg3ec5x96f6w:fq4nq50v6arnxh92@ko86t9azcob3a2f9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/m5lyb51n61ilqc6e