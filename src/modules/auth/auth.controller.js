import { Router } from "express";
import * as authService from "./auth.service.js"
const router = Router()

// [Auth (register and login)]
// register >> post | "/register" 

router.post("/register",authService.register);

// login >> post  >> "/login"
router.post("/login",authService.login );
export default router