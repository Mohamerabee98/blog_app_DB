import { Router } from "express";
import { getProfile } from "./user.service.js";

const router = Router()


// get profile >> user data + blog

router.get("/profile/:id", getProfile);
export default router