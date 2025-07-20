import dbConnection from "../../db/db.connection.js";

export const addBlog = (req, res, next) => {
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
}

export const deleteBlog =  (req, res, next) => {
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
}