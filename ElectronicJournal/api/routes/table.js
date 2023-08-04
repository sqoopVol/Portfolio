import express from "express";
import { getDates, getStudents, getGrades, getTeacher, getCurator, addDates, updateDates, deleteDates, addGrades, updateGrades, deleteGrades } from "../controllers/table.js";

const router = express.Router();

router.post("/dates", getDates);
router.post("/students", getStudents);
router.post("/grades", getGrades);
router.post("/teacher", getTeacher);
router.post("/curator", getCurator);
router.post("/add-dates", addDates);
router.put("/update-dates", updateDates);
router.delete("/delete-dates", deleteDates);
router.post("/add-grades", addGrades);
router.put("/update-grades", updateGrades);
router.delete("/delete-grades", deleteGrades);

export default router;