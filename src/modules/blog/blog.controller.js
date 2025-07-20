import { Router } from "express";
import * as bs from "./blog.service.js";

const router = Router()



// add blog >> post >> /blog

router.post("/blog", bs.addBlog);

// delete blog >> delete >> /blog/id

router.delete("/blog/:id", bs.deleteBlog);
export default router