import dbConnection from "../../db/db.connection.js"
import  bcrypt  from 'bcrypt';

export const  register =   async(req, res, next) => {
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
}

export const login = (req, res, next) => {
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
}