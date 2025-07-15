const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();

const cors = require("cors");
const app = express();
app.use(cors());
// builtin middleware json
app.use(express.json());

const mysql = require("mysql2");
const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


dbConnection.connect((error) => {
  if (error) {
    return console.error(error.message);
  }
  return console.log("db connection successfully");
});

// register >> post | "/register"

app.post("/register", async (req, res, next) => {
  const { fname, lname, email, password, dob } = req.body;

  dbConnection.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    async (error, result) => {
      if (error)
        return res.status(500).json({ message: "server error", error });

      if (result.length > 0) {
        return res.status(409).json({ message: "user already exist" });
      }

      // ✅ تشفير الباسورد
      const hashedPassword = await bcrypt.hash(password, 10);

      dbConnection.execute(
        `INSERT INTO users (f_name, l_name, email, password, dob) VALUES (?, ?, ?, ?, ?)`,
        [fname, lname, email, hashedPassword, dob],
        (error, result) => {
          if (error)
            return res.status(500).json({ message: "server error", error });

          if (result.affectedRows === 0) {
            return res.status(500).json({ message: "fail to create user" });
          }

          return res.status(201).json({ message: "user created successfully" });
        }
      );
    }
  );
});

// login >> post  >> "/login"
app.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  dbConnection.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error)
        return res.status(500).json({ message: "server error", error });

      if (result.length === 0) {
        return res.status(401).json({ message: "invalid credentials" });
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        result[0].password
      );

      if (!isPasswordMatch) {
        return res.status(401).json({ message: "invalid credentials" });
      }

      return res
        .status(200)
        .json({ message: "login successfully", userId: result[0].id });
    }
  );
});

// add blog >> post >> /blog

app.post("/blog", (req, res, next) => {
  // get data from req

  const { title, content, userId } = req.body;
  // console.log({title,content ,userId});
  // add blog to db
  dbConnection.execute(
    "INSERT INTO blogs (title ,content , u_id) VALUES (?,?,?)",
    [title, content, userId],
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: "server error", error });
      }
      if (result.affectedRows == 0) {
        return res.status(500).json({ message: "fail to create blog" });
      }
      // send success response

      return res.status(201).json({ message: "blog created successfully" });
    }
  );
});

// delete blog >> delete >> /blog/id

app.delete("/blog/:id", (req, res, next) => {
  // get data from req
  const { id } = req.params;
  // console.log({id});

  //delete blog from db >> Soft delete
  dbConnection.execute(
    "UPDATE blogs SET is_deleted = 1 WHERE id = ? AND is_deleted = 0",
    [id],
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: "server error", error });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "blog not found" });
      }
      return res.status(200).json({ message: "blog deleted successfully" });
    }
  );
});

// get profile >> user data + blog

app.get("/profile/:id", (req, res, next) => {
  // get data from req

  const { id } = req.params;

  // get user data from db

  let sql = `
  SELECT 
    users.id AS userId,
    users.email,
    blogs.id AS blogId,
    blogs.title,
    blogs.content,
    TIMESTAMPDIFF(YEAR, users.dob, CURDATE()) AS age,
    CONCAT(f_name, ' ', l_name) AS userName
  FROM users
  LEFT JOIN blogs ON users.id = blogs.u_id AND blogs.is_deleted = 0
  WHERE users.id = ?
`;

  let values = [id];
  dbConnection.execute(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "server error", error });
    }

    return res.status(200).json({ message: "Done", result });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log("server is running on port", port);
});
