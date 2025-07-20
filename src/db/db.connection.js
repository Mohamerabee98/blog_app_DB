//Connection
import mysql from 'mysql2';
const dbConnection = mysql.createConnection({
  host: '127.0.0.1' ,
  user:'root',
  password: '',
  database:'blog_app',
});

dbConnection.connect((error) => {
  if (error) {
    return console.error(error.message);
  }
  return console.log("db connection successfully");
});
export  default dbConnection