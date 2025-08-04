import { Router } from "express";
import { 
    login,
    logout,
    getCurrentAdmin,
    accessRefreshToken,
} from "../controllers/auth.controller.js";
import { veryifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/login").post(login);
router.route("/logout").post(veryifyJWT, logout);
router.route("/refresh-token").post(accessRefreshToken);
router.route("/me").get(veryifyJWT, getCurrentAdmin);



export default router;

