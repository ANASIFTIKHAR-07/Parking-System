import { 
    getAllCompanies,
    updateCompany,
    deleteCompany,
    addCompany,

} from "../controllers/admin.controller.js";
import express, { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/get-all-companies").get(verifyJWT, getAllCompanies)
