import dbConnection from "../../db/db.connection.js";

export const getProfile = (req, res, next) => {
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
}