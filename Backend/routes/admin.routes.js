import {
  getAllCompanies,
  updateCompany,
  deleteCompany,
  addCompany,
  createFloor,
  deleteFloor,
  getAllFloors,
  updateFloor,
  createParkingSlots,
  getParkingSlots,
  updateParkingSlot,
  deleteParkingSlot,
} from "../controllers/admin.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/companies").get(verifyJWT, getAllCompanies);
router.route("/companies").post(verifyJWT, addCompany);
router.route("/companies/:id").put(verifyJWT, updateCompany);
router.route("/companies/:id").delete(verifyJWT, deleteCompany);
router.route("/floor").post(verifyJWT, createFloor);
router.route("/floors").get(verifyJWT, getAllFloors);
router.route("/floor/:id").delete(verifyJWT, deleteFloor);
router.route("/floor/:id").put(verifyJWT, updateFloor);
router.route("/parking-slots").post(verifyJWT, createParkingSlots);
router.route("/parking-slots").get(verifyJWT, getParkingSlots);
router.route("/parking-slot/:id").put(verifyJWT, updateParkingSlot);
router.route("/parking-slot/:id").delete(verifyJWT, deleteParkingSlot);

export default router;

// router.route("/all-companies").get(verifyJWT, getAllCompanies)
// router.route("/company/:id").put(verifyJWT, updateCompany)
// router.route("/add-company").post(verifyJWT, addCompany)
// router.route("/company/:id").delete(verifyJWT, deleteCompany)
