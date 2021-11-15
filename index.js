const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
 
 
//routes
app.get('/', (req, res) => {
  res.render('login');
});


app.get('/login', async (req, res) =>{
  let email = req.query.email;
  let password = req.query.password;

  let sql = `SELECT * 
             FROM user 
             WHERE emailAddress = "${email}" AND passWord = "${password}"`;
  let users = await executeSQL(sql);
  
  //TODO: Move this inside a function in functions.js
  if(users.length != 0){
    res.render('homeFeed', {"user":users});
  } else {
    res.render('login');
  } 
});

app.get('/register', async (req, res) =>{
  
  let error = "";

  res.render('register', {"error":error});
});

app.post('/register', async (req, res) =>{
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let emailAddress = req.body.emailAddress;
  let passWord = req.body.passWord;
  let phoneNumber = req.body.phoneNumber;

  let checkSql = `SELECT emailAddress, phoneNumber 
                  FROM user 
                  WHERE emailAddress = "${emailAddress}" AND phoneNumber = "${phoneNumber}"`;
  let rows = await executeSQL(checkSql);

  //TODO: Move this inside a function in functions.js
  
  if(rows.length == 0){
    let sql = `INSERT INTO user (firstName, lastName, emailAddress, phoneNumber, passWord) 
               VALUES (?, ?, ?, ?, ?)`;
    let params = [firstName, lastName, emailAddress, phoneNumber, passWord];
    rows = await executeSQL(sql, params);
    res.render('homeFeed');
  } else {  
    let error = "Error: Cannot continue";
    res.render('register', {"error": error});
  }  
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
