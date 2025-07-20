import express from "express";
import cors from "cors";
import bootstrap from "./src/app.controller.js";


const app = express();
app.use(cors());



bootstrap(app,express)

const port = 3000;
app.listen(port, () => {
  console.log("server is running on port", port);
});