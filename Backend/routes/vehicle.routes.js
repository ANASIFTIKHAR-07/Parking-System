import { 
    checkInVehicle,
    checkOutVehicle
} from "../controllers/vehicle.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/check-in").post(verifyJWT, checkInVehicle);
router.route("/check-out").post(verifyJWT, checkOutVehicle);


export default router;