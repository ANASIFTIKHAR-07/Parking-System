import { Router } from "express";
import { 
    login,
    logout,
    getCurrentAdmin,
    accessRefreshToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(accessRefreshToken);
router.route("/me").get(verifyJWT, getCurrentAdmin);



export default router;

