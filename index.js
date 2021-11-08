const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));
 

//routes
app.get('/', (req, res) => {
   res.send('Hello Express app!')
});

app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL
//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "en1ehf30yom7txe7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "cbntik7m4d8ws4zx",
      password: "jcu267fvhhxu4lds",
      database: "yq8r605ykd6nfwwo"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )
