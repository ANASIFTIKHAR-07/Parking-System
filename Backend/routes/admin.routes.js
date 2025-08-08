import { 
    getAllCompanies,
    updateCompany,
    deleteCompany,
    addCompany,

} from "../controllers/admin.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/companies").get(verifyJWT, getAllCompanies)
router.route("/companies").post(verifyJWT, addCompany)
router.route("/companies/:id").put(verifyJWT, updateCompany)
router.route("/companies/:id").delete(verifyJWT, deleteCompany)

export default router;


// router.route("/all-companies").get(verifyJWT, getAllCompanies)
// router.route("/company/:id").put(verifyJWT, updateCompany)
// router.route("/add-company").post(verifyJWT, addCompany)
// router.route("/company/:id").delete(verifyJWT, deleteCompany)